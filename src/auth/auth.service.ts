import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async login(loginDTO: LoginDTO): Promise<User> {
    const user = this.userService.findOne(loginDTO);
    const passwordMatched = bcrypt.compare(loginDTO.password, user.password);

    if (passwordMatched) {
      delete user.password;

      return user;
    } else {
      throw new UnauthorizedException("Password doesn't match");
    }
  }
}
