import { Module } from '@nestjs/common';
import { MediaController } from './controllers/media.controller';
import { KinopoiskService } from './services/kinopoisk.service';
import { TmdbService } from './services/tmdb.service';
import { AggregationService } from './services/aggregation.service';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [HttpModule, UsersModule],
  controllers: [MediaController],
  providers: [KinopoiskService, TmdbService, AggregationService],
})

export class MediaModule {}
