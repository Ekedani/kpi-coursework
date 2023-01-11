import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { FindMediaDto } from '../dto/find-media.dto';
import { KinopoiskService } from './kinopoisk.service';
import { TmdbService } from './tmdb.service';
import { GetSingleMediaDto } from '../dto/get-single-media.dto';
import { MediaItem } from '../common/media-item';
import { isEmpty } from 'lodash';
import searchQueryToKey from '../common/search-query-to-key';
import { Cache } from 'cache-manager';

/**
 * Summary: Service responsible for aggregation of data from multiple sources
 * and their normalization
 */
@Injectable()
export class AggregationService {
  constructor(
    private kinopoiskService: KinopoiskService,
    private tmdbService: TmdbService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * Summary: Searches media by specified keywords and filters
   */
  async findMedia(findMediaDto: FindMediaDto) {
    const cacheKey = searchQueryToKey(findMediaDto);
    const cache = await this.getMediaCache(cacheKey);
    if (cache) {
      const { items, pages } = this.paginateMedia(cache.items, findMediaDto);
      cache.items = items;
      return { ...cache, pages };
    }
    const dataSources: Array<string> = [
      this.kinopoiskService.serviceName,
      this.tmdbService.serviceName,
    ];
    const requests = [
      this.kinopoiskService.findMedia(findMediaDto),
      this.tmdbService.findMedia(findMediaDto),
    ];
    const { fulfilledResponses, warnings } = await this.handleRequests(
      dataSources,
      requests,
    );
    const nonaggregatedItems = fulfilledResponses.map((res) => res.value);
    const aggregatedItems = this.aggregateMedia(...nonaggregatedItems);

    const items = this.filterAggregated(aggregatedItems, findMediaDto);
    const total = items.length;
    const result = { dataSources, total, items, warnings: undefined };
    if (warnings.length === 0) {
      await this.setMediaCache(cacheKey, result);
    } else {
      result.warnings = warnings;
    }
    const { items: paginated, pages } = this.paginateMedia(items, findMediaDto);
    result.items = paginated;
    return { ...result, pages };
  }

  /**
   * Summary: Gets detailed information about a particular media
   */
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
      if (prev.isSameMedia(cur)) {
        return prev.join(cur);
      } else {
        throw new BadRequestException('media in the query is not the same');
      }
    });
    const result = { aggregatedItem, warnings: undefined };
    if (warnings.length) {
      result.warnings = warnings;
    }
    return result;
  }

  /**
   * Summary: Gets detailed information about a particular media rating
   */
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
   * Summary: Queries data from data sources and returns successful responses and warnings
   */
  private async handleRequests(
    dataSources: Array<string>,
    requests: Array<Promise<any>>,
  ) {
    const responses = await Promise.allSettled(requests);
    const warnings: Array<string> = [];
    const fulfilledResponses = responses.filter((res, index) => {
      if (res.status !== 'fulfilled') {
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
   * Summary: Filters data that does not match the search criteria after aggregation
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
   * Summary: Splits the result into pages
   */
  private paginateMedia(items: Array<MediaItem>, findMediaDto: FindMediaDto) {
    const page = findMediaDto.page ?? 1;
    const take = findMediaDto.itemsPerPage ?? 20;
    const paginated = items.slice((page - 1) * take, page * take);
    return {
      items: paginated,
      pages: Math.floor(items.length / take) + 1,
    };
  }

  /**
   * Summary: Finds the cache by the search query key
   */
  async getMediaCache(
    cacheKey,
  ): Promise<{ dataSources; total; items } | undefined> {
    const cache: string | undefined = await this.cacheManager.get(cacheKey);
    if (cache === undefined) {
      return undefined;
    } else {
      return JSON.parse(cache);
    }
  }

  /**
   * Summary: Caches response data for quick access
   */
  async setMediaCache(cacheKey, { dataSources, total, items }): Promise<void> {
    await this.cacheManager.set(
      cacheKey,
      JSON.stringify({ dataSources, total, items }),
      60 * 60 * 5,
    );
  }

  /**
   * Summary: Calls the aggregation algorithms depending on the number of data sources
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

  /**
   * Summary: Aggregates data from two data sources with n-square complexity
   */
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
