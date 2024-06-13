import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as speakeasy from 'speakeasy';
import { UserService } from 'src/user/user.service';
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ArtistsService } from 'src/artists/artists.service';
import { PayloadType } from './types/payload.type';
import { Enable2FAType } from './types/auth.type';
import { UpdateResult } from 'typeorm';

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
      const payload: PayloadType = {
        ...userCopy,
        artistId: artist?.id,
        ...(user.enable2FA && user.twoFASecret && { verified: false }),
      };

      return {
        accessToken: this.jwtService.sign(payload),
      };
    }

    throw new UnauthorizedException("Password doesn't match");
  }

  async enable2FA(userId: number): Promise<Enable2FAType> {
    const user = await this.userService.findById(userId);

    if (user.enable2FA) {
      return { secret: user.twoFASecret };
    }

    const { base32 } = speakeasy.generateSecret();

    await this.userService.updateSecretKey(userId, base32);
    return { secret: base32 };
  }

  async disable2FA(userId: number): Promise<UpdateResult> {
    return this.userService.disable2FA(userId);
  }

  async validate2FAToken(userId: number, token: string) {
    try {
      const user = await this.userService.findById(userId);

      const verified = speakeasy.totp.verify({
        secret: user.twoFASecret,
        token,
        encoding: 'base32',
      });

      if (!verified) {
        throw new Error();
      }

      const userCopy = { ...user };
      delete userCopy.password;
      const artist = await this.artistsService.findArtist(user.id);
      const payload: PayloadType = {
        ...userCopy,
        artistId: artist?.id,
        verified: true,
      };

      return {
        accessToken: this.jwtService.sign(payload),
      };
    } catch (err) {
      throw new UnauthorizedException('Error verifying token');
    }
  }
}
