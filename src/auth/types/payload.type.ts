import { User } from 'src/entities/user.entity';

export interface PayloadType extends Omit<User, 'password'> {
  artistId?: number;
}
