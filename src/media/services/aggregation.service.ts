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

  async findMedia(findMediaDto: FindMediaDto) {
    const sources: Array<string> = [];
    const items: Array<MediaInterface> = [];

    try {
      const kinopoiskPromise = this.kinopoiskService.findMedia(findMediaDto);
      const tmdbPromise = this.tmdbService.findMedia(findMediaDto);
      const responses = await Promise.allSettled([
        kinopoiskPromise,
        tmdbPromise,
      ]);
      const items = this.aggregateMedia();
      return responses;
    } catch (e) {
      throw e;
    }
  }

  async getSingleMedia(getSingleMediaDto: GetSingleMediaDto) {
    return getSingleMediaDto;
  }

  async getMediaRating(getMediaRatingDto: GetMediaRatingDto) {
    return getMediaRatingDto;
  }

  private aggregateMedia(): Array<MediaInterface> {
    return [];
  }

  private isSameMedia(...args: Array<MediaInterface>): boolean {
    try {
      const imdbId = args[0]?.imdbId;
      // TODO: Check Nulls
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
}
