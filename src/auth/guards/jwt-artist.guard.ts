import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PayloadType } from '../types/payload.type';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class JwtArtistGuard extends JwtAuthGuard {
  handleRequest<TUser extends PayloadType>(
    err: Error | null,
    user: TUser,
    info: any,
    context: ExecutionContext,
  ): TUser {
    user = super.handleRequest(err, user, info, context);

    if (user.artistId) {
      return user;
    }

    throw err ?? new UnauthorizedException('User is not an artist');
  }
}
