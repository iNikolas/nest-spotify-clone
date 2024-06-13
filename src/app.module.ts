import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerModule } from './common/middleware/logger/logger.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { SongsController } from './songs/songs.controller';
import { DevConfigService } from './common/providers/dev-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Song } from './entities/song.entity';
import { User } from './entities/user.entity';
import { Artist } from './entities/artist.entity';
import { Playlist } from './entities/playlist.entity';
import { PlaylistsModule } from './playlists/playlists.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

const devConfig = {
  port: 3000,
};
const proConfig = {
  port: 400,
};

// Module - foundational building block of a Nest.js Application. Modules encapsulate realted functionality and can be developed or maintained independently

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SongsModule,
    LoggerModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [Artist, Playlist, Song, User],
        synchronize: true, // New table and fields will materialize automatically without migrations
      }),
      inject: [ConfigService],
    }),
    PlaylistsModule,
    AuthModule,
    UserModule,
  ], // external modules needed for the current module
  controllers: [AppController], // Serve the function of handling incoming requests and sending responeses back to the client
  providers: [
    AppService,
    { provide: DevConfigService, useClass: DevConfigService },
    {
      provide: 'CONFIG',
      useFactory: () =>
        process.env.NODE_ENV === 'development' ? devConfig : proConfig,
    },
  ], // Classes that acts as services, factories or repositories. They incapsulate business logic that can be injected into controllers or other Services
  exports: [], // Make Services available for other modules
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {
    console.log(dataSource.driver.database); // Testing database connection
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(SongsController);
  }
}
