import { CacheModule, Module } from '@nestjs/common';
import { MediaController } from './controllers/media.controller';
import { KinopoiskService } from './services/kinopoisk.service';
import { TmdbService } from './services/tmdb.service';
import { AggregationService } from './services/aggregation.service';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import MediaConfig from '../config/media.config';

@Module({
  imports: [
    CacheModule.register({ ttl: 60 * 5 }),
    HttpModule,
    UsersModule,
    ConfigModule.forFeature(MediaConfig),
  ],
  controllers: [MediaController],
  providers: [KinopoiskService, TmdbService, AggregationService],
})

export class MediaModule {}
