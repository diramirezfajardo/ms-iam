import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

const validateRequest = async (request?: unknown): Promise<boolean> => {
  return false;
};

@Injectable()
export class JwtGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: unknown = context.switchToHttp().getRequest();
    const validation: boolean = await validateRequest(request);

    if (!validation) throw new UnauthorizedException();

    return validation;
  }
}
