import { Module } from '@nestjs/common';
import { MediaController } from './controllers/media.controller';
import { KinopoiskService } from './services/kinopoisk.service';
import { TmdbService } from './services/tmdb.service';
import { AggregationService } from './services/aggregation.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [MediaController],
  providers: [KinopoiskService, TmdbService, AggregationService],
})

export class MediaModule {}
