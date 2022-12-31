import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { KinopoiskService } from './services/kinopoisk.service';
import { ImdbService } from './services/imdb.service';
import { AggregationService } from './services/aggregation.service';

@Module({
  controllers: [MediaController],
  providers: [KinopoiskService, ImdbService, AggregationService],
})
export class MediaModule {}
