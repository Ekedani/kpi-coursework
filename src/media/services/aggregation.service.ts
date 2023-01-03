import { Injectable } from '@nestjs/common';
import { FindMediaDto } from '../dto/find-media.dto';
import { KinopoiskService } from './kinopoisk.service';
import { TmdbService } from './tmdb.service';
import { GetSingleMediaDto } from '../dto/get-single-media.dto';
import { GetMediaRatingDto } from '../dto/get-media-rating.dto';

@Injectable()
export class AggregationService {
  constructor(
    private kinopoiskService: KinopoiskService,
    private tmdbService: TmdbService,
  ) {}
  findMedia(findMediaDto: FindMediaDto) {
    const cacheKey = JSON.stringify(findMediaDto);
    return this.kinopoiskService.findMedia(findMediaDto);
  }

  getSingleMedia(getSingleMediaDto: GetSingleMediaDto) {
    return getSingleMediaDto;
  }

  getMediaRating(getMediaRatingDto: GetMediaRatingDto) {

  }
}
