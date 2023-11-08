import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './entities/user.entity';
import { Connection, EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { throwHttpException } from 'src/utils/exception';
import { I18nService } from 'nestjs-i18n';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { UserSessionEntity } from './entities/user_session.entity';
import baseConfig from 'src/config/env/base-config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    private readonly i18n: I18nService,
    private readonly connection: Connection,
    @Inject(baseConfig.KEY)
    private configService: ConfigType<typeof baseConfig>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(UserSessionEntity)
    private readonly userSessionRepository: Repository<UserSessionEntity>,
  ) {}

  async create(userDto: UserDto) {
    const { email, password } = userDto;

    const user = this.userRepository.create({
      email,
      password,
    });

    await this.connection.transaction(
      async (transactionalEntityManager: EntityManager): Promise<void> => {
        try {
          await transactionalEntityManager.save(user);
        } catch (error: unknown) {
          return throwHttpException(
            HttpStatus.INTERNAL_SERVER_ERROR,
            await this.i18n.translate('ERROR_TRX'),
            { error },
          );
        }
      },
    );

    return user;
  }

  async login(loginDto: UserDto): Promise<UserSessionEntity> {
    const { email, password } = loginDto;

    const user: UserEntity | undefined = await this.userRepository.findOne({
      email,
      password,
    });

    if (!user) {
      return throwHttpException(
        HttpStatus.BAD_REQUEST,
        await this.i18n.translate('BAD_REQUEST'),
        { error: '' },
      );
    }

    const accessToken: string = sign(
      {
        data: JSON.stringify({ id: user?.id }),
      },
      this.configService.app.jwtSecret as string,
      { expiresIn: '24h' },
    );

    const refreshToken: string = sign(
      {
        data: JSON.stringify({ id: user?.id }),
      },
      this.configService.app.jwtSecret as string,
      { expiresIn: '144h' },
    );

    const userSession = this.userSessionRepository.create({
      userId: user.id,
      accessToken,
      refreshToken,
    });

    await this.userSessionRepository.save(userSession);

    return userSession;
  }

  async check(headers: Record<string, string>): Promise<any> {
    const token: string = headers?.authorization?.split(' ')[1] || '';

    if (!token) {
      return throwHttpException(
        HttpStatus.UNAUTHORIZED,
        await this.i18n.translate('UNAUTHORIZED'),
        { error: '' },
      );
    }

    const payload: JwtPayload | undefined = this.verifyToken(token);

    if (!payload) {
      return throwHttpException(
        HttpStatus.UNAUTHORIZED,
        await this.i18n.translate('UNAUTHORIZED'),
        { error: '' },
      );
    }

    const data: Record<string, string | number> = JSON.parse(payload?.data);

    const userSession: UserSessionEntity | undefined =
      await this.userSessionRepository.findOne({
        where: { accessToken: token },
      });

    if (!userSession || userSession?.userId != data?.id) {
      return throwHttpException(
        HttpStatus.UNAUTHORIZED,
        await this.i18n.translate('UNAUTHORIZED'),
        { error: '' },
      );
    }

    return true;
  }

  verifyToken = (token: string): JwtPayload | undefined => {
    try {
      return verify(
        token,
        this.configService.app.jwtSecret as string,
      ) as JwtPayload;
    } catch (err) {
      return undefined;
    }
  };
}
