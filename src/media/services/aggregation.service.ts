import { Injectable } from '@nestjs/common';
import { FindMediaDto } from '../dto/find-media.dto';
import { KinopoiskService } from './kinopoisk.service';
import { TmdbService } from './tmdb.service';

@Injectable()
export class AggregationService {
  constructor(
    private kinopoiskService: KinopoiskService,
    private tmdbService: TmdbService,
  ) {}
  findMedia(findMediaDto: FindMediaDto) {
    return this.kinopoiskService.findMedia(findMediaDto);
  }
}
