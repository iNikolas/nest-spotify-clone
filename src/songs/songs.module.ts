import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { connection } from 'src/common/constants/connection';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from 'src/entities/song.entity';
import { Artist } from 'src/entities/artist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Artist, Song])],
  controllers: [SongsController],
  providers: [
    { provide: SongsService, useClass: SongsService }, // standard vay to provide Services
    { provide: 'CONNECTION', useValue: connection }, // value providers. Allow to inject objects as a dependency. Usefull for injecting constants, external libraries or mock data
  ],
})
export class SongsModule {}
