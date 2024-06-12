import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { CreateSongDto } from './dto/create-song.dto';
import { Connection } from 'src/common/constants/connection';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from 'src/entities/song.entity';
import { In, Repository } from 'typeorm';
import { UpdateSongDto } from './dto/update-song.dto';
import { Artist } from 'src/entities/artist.entity';

@Injectable({ scope: Scope.TRANSIENT }) // scope difines rules how often clas instance should be created
export class SongsService {
  constructor(
    @Inject('CONNECTION') connection: Connection,
    @InjectRepository(Song) private songRepository: Repository<Song>,
    @InjectRepository(Artist) private artistRepository: Repository<Artist>,
  ) {
    console.log(`Connection string: ${connection.CONNECTION_STRING}`);
  }
  private readonly songs = [];

  async create(songDTO: CreateSongDto): Promise<Song> {
    const song = new Song();

    const artists = await this.artistRepository.findBy({
      id: In(songDTO.artists),
    });

    song.title = songDTO.title;
    song.artists = artists;
    song.duration = songDTO.duration;
    song.lyrics = songDTO.lyrics;
    song.releasedDate = songDTO.releasedDate;

    return await this.songRepository.save(song);
  }

  async findAll(): Promise<Song[]> {
    return await this.songRepository.find();
  }

  async findOne(id: number): Promise<Song> {
    return await this.songRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.songRepository.delete({ id });
  }

  async update(id: number, updateSongDto: UpdateSongDto): Promise<Song> {
    const song = await this.songRepository.findOneBy({ id });

    if (!song) {
      throw new NotFoundException(`Song with ID ${id} not found`);
    }

    if (updateSongDto.title !== undefined) {
      song.title = updateSongDto.title;
    }

    if (updateSongDto.artists !== undefined) {
      const artists = await this.artistRepository.findBy({
        id: In(updateSongDto.artists),
      });
      if (artists.length !== updateSongDto.artists.length) {
        throw new NotFoundException('One or more artists not found');
      }
      song.artists = artists;
    }

    if (updateSongDto.duration !== undefined) {
      song.duration = updateSongDto.duration;
    }

    if (updateSongDto.lyrics !== undefined) {
      song.lyrics = updateSongDto.lyrics;
    }

    if (updateSongDto.releasedDate !== undefined) {
      song.releasedDate = updateSongDto.releasedDate;
    }

    return await this.songRepository.save(song);
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Song>> {
    return await paginate<Song>(this.songRepository, options);
  }
}
