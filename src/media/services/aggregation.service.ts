import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FindMediaDto } from '../dto/find-media.dto';
import { KinopoiskService } from './kinopoisk.service';
import { TmdbService } from './tmdb.service';
import { GetSingleMediaDto } from '../dto/get-single-media.dto';
import { GetMediaRatingDto } from '../dto/get-media-rating.dto';
import { Media } from '../common/media';

@Injectable()
export class AggregationService {
  constructor(
    private kinopoiskService: KinopoiskService,
    private tmdbService: TmdbService,
  ) {}

  async findMedia(findMediaDto: FindMediaDto) {
    const kinopoiskPromise = this.kinopoiskService.findMedia(findMediaDto);
    const tmdbPromise = this.tmdbService.findMedia(findMediaDto);
    const dataSources: Array<string> = ['kinopoisk', 'tmdb'];
    const responses = await Promise.allSettled([kinopoiskPromise, tmdbPromise]);

    const warnings: Array<string> = [];
    responses.forEach((res, index) => {
      if (res.status === 'rejected') {
        warnings.push(
          `an error occurred while fetching data from ${dataSources[index]}`,
        );
        dataSources[index] = null;
      }
    });
    if (!dataSources.some((source) => source)) {
      throw new InternalServerErrorException(
        'failed to fetch all data sources',
      );
    }

    const items = responses
      .filter((res) => res.status === 'fulfilled')
      .map((res: PromiseFulfilledResult<any>) => res.value);
    const aggregatedItems = this.aggregateMedia(...items);
    return { sources: dataSources, items: aggregatedItems, warnings };
  }

  async getSingleMedia(getSingleMediaDto: GetSingleMediaDto) {
    return getSingleMediaDto;
  }

  async getMediaRating(getMediaRatingDto: GetMediaRatingDto) {
    return getMediaRatingDto;
  }

  private aggregateMedia(...args): Array<Media> {
    const items: Array<Media> = [];
    if (args.length == 2) {
      args[0].forEach((item, index) => {
        const sameMedia = args[1].find((comparedItem) =>
          this.isSameMedia(item, comparedItem),
        );
        if(sameMedia){

        }
      });
    } else {
      items.push(...args[0]);
    }
    return items;
  }

  private isSameMedia(...args: Array<Media>): boolean {
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
