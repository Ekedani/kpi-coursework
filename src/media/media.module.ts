import { Module } from '@nestjs/common';
import { MediaController } from './controllers/media.controller';
import { KinopoiskService } from './services/kinopoisk.service';
import { ImdbService } from './services/imdb.service';
import { AggregationService } from './services/aggregation.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [MediaController],
  providers: [KinopoiskService, ImdbService, AggregationService],
})

export class MediaModule {}
