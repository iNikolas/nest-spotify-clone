import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Artist } from '../entities/artist.entity';
import { Playlist } from '../entities/playlist.entity';
import { Song } from '../entities/song.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
  ) {}

  async seed() {
    const regularUser = this.userRepository.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: '123456',
    });

    const artistUser = this.userRepository.create({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      password: '123456',
    });

    await this.userRepository.save([regularUser, artistUser]);

    const artist = this.artistRepository.create({ user: artistUser });
    await this.artistRepository.save(artist);

    const song = this.songRepository.create({
      title: 'New Song',
      releasedDate: new Date('2023-01-01'),
      duration: new Date('1970-01-01T00:03:30.000Z'),
      lyrics: 'La la la...',
      artists: [artist],
    });
    await this.songRepository.save(song);

    const playlist = this.playlistRepository.create({
      name: 'My Playlist',
      user: regularUser,
      songs: [song],
    });
    await this.playlistRepository.save(playlist);

    console.log('Seeding completed');
  }
}
