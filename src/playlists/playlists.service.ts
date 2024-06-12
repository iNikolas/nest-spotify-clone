import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from 'src/entities/playlist.entity';
import { Song } from 'src/entities/song.entity';
import { User } from 'src/entities/user.entity';
import { In, Repository } from 'typeorm';
import { CreatePlayListDto } from './dto/create-playlist.dto';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,

    @InjectRepository(Song) private songsRepository: Repository<Song>,

    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(playlistDTO: CreatePlayListDto): Promise<Playlist> {
    const playlist = new Playlist();

    playlist.name = playlistDTO.name;

    const songs = await this.songsRepository.findBy({
      id: In(playlistDTO.songs),
    });
    const user = await this.userRepository.findOneBy({ id: playlistDTO.user });

    playlist.songs = songs;
    playlist.user = user;

    return await this.playlistRepository.save(playlist);
  }
}
