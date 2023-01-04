import { Injectable } from '@nestjs/common';
import { FindMediaDto } from '../dto/find-media.dto';
import { KinopoiskService } from './kinopoisk.service';
import { TmdbService } from './tmdb.service';
import { GetSingleMediaDto } from '../dto/get-single-media.dto';
import { GetMediaRatingDto } from '../dto/get-media-rating.dto';
import { MediaInterface } from '../common/media.interface';

@Injectable()
export class AggregationService {
  constructor(
    private kinopoiskService: KinopoiskService,
    private tmdbService: TmdbService,
  ) {}

  private isSameMedia(...args): boolean {
    try {
      const imdbId = args[0]?.imdbId;
      const sameImdbId = args.reduce((accumulator, currentValue) => {
        return accumulator && currentValue?.imdbId === imdbId;
      }, true);
      if (sameImdbId) {
        return true;
      }
      const name = args[0]?.nameOriginal;
      const year = args[0]?.year;
      return args.reduce((accumulator, currentValue) => {
        const sameName = currentValue?.nameOriginal === name;
        const sameYear = currentValue?.year === year;
        return accumulator && sameName && sameYear;
      }, true);
    } catch (e) {
      return false;
    }
  }

  async findMedia(findMediaDto: FindMediaDto) {
    const items: Array<MediaInterface> = [];
    return this.kinopoiskService.findMedia(findMediaDto);
  }

  async getSingleMedia(getSingleMediaDto: GetSingleMediaDto) {
    return getSingleMediaDto;
  }

  async getMediaRating(getMediaRatingDto: GetMediaRatingDto) {
    return getMediaRatingDto;
  }
}
