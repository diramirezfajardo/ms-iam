import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  HttpStatus,
  Headers,
  Get,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { throwHttpException } from 'src/utils/exception';
import { I18nService } from 'nestjs-i18n';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  async create(@Body(new ValidationPipe()) userDto: UserDto) {
    try {
      return this.userService.create(userDto);
    } catch (error: unknown) {
      return throwHttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        await this.i18n.translate('ERROR'),
        { error },
      );
    }
  }

  @Post('login')
  async login(@Body(new ValidationPipe()) userDto: UserDto) {
    try {
      return this.userService.login(userDto);
    } catch (error: unknown) {
      return throwHttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        await this.i18n.translate('ERROR'),
        { error },
      );
    }
  }

  @Get('check')
  async check(@Headers() headers: Record<string, string>) {
    try {
      await this.userService.check(headers);
    } catch (error: unknown) {
      return throwHttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        await this.i18n.translate('ERROR'),
        { error },
      );
    }
  }
}
