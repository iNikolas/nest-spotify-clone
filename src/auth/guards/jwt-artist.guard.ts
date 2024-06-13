import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PayloadType } from '../types/payload.type';

@Injectable()
export class JwtArtistGuard extends AuthGuard('jwt') {
  handleRequest<TUser extends PayloadType>(
    err: Error | null,
    user: TUser,
  ): TUser {
    if (user.artistId) {
      return user;
    }

    throw err ?? new UnauthorizedException();
  }
}
