import { CacheModule, Module } from '@nestjs/common';
import { MediaController } from './controllers/media.controller';
import { KinopoiskService } from './services/kinopoisk.service';
import { TmdbService } from './services/tmdb.service';
import { AggregationService } from './services/aggregation.service';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import MediaConfig from '../config/media.config';
import * as redisStore from 'cache-manager-redis-store';
import redisConfig from '../config/redis.config';
import { ClientOpts } from 'redis';

/**
 * Summary: This module is responsible for automatic aggregation and normalization
 * of media content from online cinemas
 */
@Module({
  imports: [
    HttpModule,
    UsersModule,
    ConfigModule.forFeature(MediaConfig),
    CacheModule.register<ClientOpts>({
      store: redisStore,
      ...redisConfig,
    }),
  ],
  controllers: [MediaController],
  providers: [KinopoiskService, TmdbService, AggregationService],
})
export class MediaModule {}
