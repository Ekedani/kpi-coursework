import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { FindMediaDto } from '../dto/find-media.dto';
import { KinopoiskService } from './kinopoisk.service';
import { TmdbService } from './tmdb.service';
import { GetSingleMediaDto } from '../dto/get-single-media.dto';
import { MediaItem } from '../common/mediaItem';
import { isEmpty } from 'lodash';

@Injectable()
export class AggregationService {
  constructor(
    private kinopoiskService: KinopoiskService,
    private tmdbService: TmdbService,
  ) {}

  async findMedia(findMediaDto: FindMediaDto) {
    const dataSources: Array<string> = [
      this.kinopoiskService.serviceName,
      this.tmdbService.serviceName,
    ];
    const responses = await Promise.allSettled([
      this.kinopoiskService.findMedia(findMediaDto),
      this.tmdbService.findMedia(findMediaDto),
    ]);
    const warnings: Array<string> = [];
    responses.forEach((res, index) => {
      if (res.status === 'rejected') {
        warnings.push(`can't fetch data from ${dataSources[index]}`);
      }
    });
    const items = responses
      .filter((res) => res.status === 'fulfilled')
      .map((res: PromiseFulfilledResult<any>) => res.value);
    const aggregatedItems = this.aggregateMedia(...items);
    const filteredItems = this.filterAggregated(aggregatedItems, findMediaDto);
    return {
      dataSources,
      total: filteredItems.length,
      items: filteredItems,
      warnings,
    };
  }

  async getSingleMedia(getSingleMediaDto: GetSingleMediaDto) {
    const requests: Array<Promise<any>> = [];
    const dataSources: Array<string> = [];
    if (getSingleMediaDto.kinopoiskId) {
      requests.push(
        this.kinopoiskService.getSingleMedia(getSingleMediaDto.kinopoiskId),
      );
      dataSources.push(this.kinopoiskService.serviceName);
    }
    if (getSingleMediaDto.tmdbId) {
      requests.push(this.tmdbService.getSingleMedia(getSingleMediaDto.tmdbId));
      dataSources.push(this.tmdbService.serviceName);
    }
    const { fulfilledResponses, warnings } = await this.handleRequests(
      dataSources,
      requests,
    );
    const items = fulfilledResponses.map((res) => res.value);
    const aggregatedItem = items.reduce((prev, cur) => {
      if (prev.isSame(cur)) {
        return prev.join(cur);
      } else {
        throw new BadRequestException();
      }
    });
    return { aggregatedItem, warnings };
  }

  async getMediaRating(getSingleMediaDto: GetSingleMediaDto) {
    const { aggregatedItem, warnings } = await this.getSingleMedia(
      getSingleMediaDto,
    );
    return {
      sources: aggregatedItem.source,
      rating: aggregatedItem.rating,
      warnings,
    };
  }

  /**
   * Summary. Queries data from data sources and returns successful responses and warnings
   */
  private async handleRequests(
    dataSources: Array<string>,
    requests: Array<Promise<any>>,
  ) {
    const responses = await Promise.allSettled(requests);
    const warnings: Array<string> = [];
    const fulfilledResponses = responses.filter((res, index) => {
      if (res.status === 'fulfilled') {
        warnings.push(`can't fetch data from ${dataSources[index]}`);
      }
      return res.status === 'fulfilled';
    }) as PromiseFulfilledResult<any>[];
    if (fulfilledResponses.length === 0) {
      throw new InternalServerErrorException("can't fetch datasources");
    }
    return { fulfilledResponses, warnings };
  }

  /**
   * Summary. Filters data that does not match the search criteria after aggregation
   */
  private filterAggregated(
    items: Array<MediaItem>,
    findMediaDto: FindMediaDto,
  ): Array<MediaItem> {
    if (findMediaDto.yearFrom || findMediaDto.yearTo) {
      items = items.filter((item) => item.year !== null);
    }
    if (findMediaDto.ratingFrom || findMediaDto.ratingTo) {
      items = items.filter((item) => !isEmpty(item.rating));
    }
    return items;
  }

  /**
   * Summary. Calls the aggregation algorithms depending on the number of data sources
   */
  private aggregateMedia(...args): Array<MediaItem> {
    let items: Array<MediaItem> = [];
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

  private squareAggregation(
    a: Array<MediaItem>,
    b: Array<MediaItem>,
  ): Array<MediaItem> {
    const aggregatedItems: Array<MediaItem> = [];
    a.forEach((item: MediaItem, index) => {
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
