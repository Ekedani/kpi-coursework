import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FindMediaDto } from '../dto/find-media.dto';
import { KinopoiskService } from './kinopoisk.service';
import { TmdbService } from './tmdb.service';
import { GetSingleMediaDto } from '../dto/get-single-media.dto';
import { GetMediaRatingDto } from '../dto/get-media-rating.dto';
import { Media } from '../common/media';
import { isEmpty } from 'lodash';

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
    const filteredItems = this.filterAggregated(aggregatedItems, findMediaDto);
    return {
      sources: dataSources,
      total: filteredItems.length,
      items: filteredItems,
      warnings,
    };
  }

  async getSingleMedia(getSingleMediaDto: GetSingleMediaDto) {
    return getSingleMediaDto;
  }

  async getMediaRating(getMediaRatingDto: GetMediaRatingDto) {
    return getMediaRatingDto;
  }

  private filterAggregated(
    items: Array<Media>,
    findMediaDto: FindMediaDto,
  ): Array<Media> {
    if (findMediaDto.yearFrom || findMediaDto.yearTo) {
      items = items.filter((item) => item.year !== null);
    }
    if (findMediaDto.ratingFrom || findMediaDto.ratingTo) {
      items = items.filter((item) => !isEmpty(item.rating));
    }
    return items;
  }

  private aggregateMedia(...args): Array<Media> {
    let items: Array<Media> = [];
    switch (args.length) {
      case 1: {
        items = args[0];
        break;
      }
      case 2: {
        items = this.squareAggregation(args[0], args[1]);
        break;
      }
    }
    return items;
  }

  private squareAggregation(a: Array<Media>, b: Array<Media>): Array<Media> {
    const aggregatedItems: Array<Media> = [];
    a.forEach((item: Media, index) => {
      const sameMediaIndex = b.findIndex((comparedItem) =>
        item.isSameMedia(comparedItem),
      );
      if (sameMediaIndex !== -1) {
        aggregatedItems.push(item.join(b[sameMediaIndex]));
        a.splice(index, 1);
        b.splice(sameMediaIndex, 1);
      }
    });
    aggregatedItems.push(...a, ...b);
    return aggregatedItems;
  }
}
