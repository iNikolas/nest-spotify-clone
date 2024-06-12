import { Body, Controller, Post } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { Playlist } from 'src/entities/playlist.entity';
import { CreatePlayListDto } from './dto/create-playlist.dto';

@Controller('playlists')
export class PlaylistsController {
  constructor(private playlistsService: PlaylistsService) {}

  @Post()
  create(@Body() playlistDTO: CreatePlayListDto): Promise<Playlist> {
    return this.playlistsService.create(playlistDTO);
  }
}
