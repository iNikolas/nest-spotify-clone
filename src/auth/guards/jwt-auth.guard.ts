import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest<TUser = any>(
    err: any,
    user: any,
    _: any,
    context: ExecutionContext,
  ): TUser {
    const is2FAEndpoint = this.reflector.get<boolean>(
      'is2FAEndpoint',
      context.getHandler(),
    );

    if (err || !user || (user.verified === false && !is2FAEndpoint)) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
