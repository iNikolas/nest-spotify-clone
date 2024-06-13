import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ArtistsService } from 'src/artists/artists.service';
import { PayloadType } from './types/payload.type';

@Injectable()
export class AuthService {
  constructor(
    private artistsService: ArtistsService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDTO: LoginDTO): Promise<{ accessToken: string }> {
    const user = await this.userService.findOne(loginDTO);
    const passwordMatched = bcrypt.compare(loginDTO.password, user.password);

    if (passwordMatched) {
      const userCopy = { ...user };
      delete userCopy.password;
      const artist = await this.artistsService.findArtist(user.id);
      const payload: PayloadType = { ...userCopy, artistId: artist?.id };

      return {
        accessToken: this.jwtService.sign(payload),
      };
    } else {
      throw new UnauthorizedException("Password doesn't match");
    }
  }
}
