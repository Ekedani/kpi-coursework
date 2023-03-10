import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { FindMediaDto } from '../dto/find-media.dto';
import { firstValueFrom } from 'rxjs';
import { MediaItem } from '../common/media-item';
import { TmdbGenresDictionary } from '../common/dictionaries/tmdb-genres.dictionary';
import { DetailedMediaItem } from '../common/detailed-media-item';

/**
 * Summary: Service responsible for pulling data from the source "TMDB"
 */
@Injectable()
export class TmdbService {
  public readonly serviceName: string = 'tmdb';
  private readonly apiHost: string;
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.apiHost = configService.get('media.tmdbHost');
    this.apiKey = configService.get('media.tmdbKey');
  }

  /**
   * Summary: Pulls data by specified keywords and filters
   */
  async findMedia(findMediaDto: FindMediaDto) {
    const searchParams = {
      api_key: this.apiKey,
      query: findMediaDto.keyword,
    };
    const { data } = await this.findMediaRequest({ searchParams, page: 1 });
    let { total_pages: totalPages } = data;
    if (totalPages > 1) {
      totalPages = totalPages <= 20 ? totalPages : 20;
      const requests = [];
      for (let page = 2; page <= totalPages; page++) {
        requests.push(this.findMediaRequest({ searchParams, page }));
      }
      const responses = await Promise.all(requests);
      responses.forEach((response) => {
        data.results.push(...response.data.results);
      });
    }
    const convertedData = data.results.map((item) =>
      this.convertItemToMedia(item),
    );
    const filteredData = this.filterMedia(convertedData, findMediaDto);
    await this.findImdbIds(filteredData);
    return filteredData;
  }

  /**
   * Summary: Pulls media data by ID
   */
  async getSingleMedia(id: string) {
    const response = await this.getSingleMediaRequest(id);
    return this.convertSingleItemToMedia(response.data);
  }

  /**
   * Summary: Brings data from the source to a common interface
   */
  private convertItemToMedia(item): MediaItem {
    const mediaItem = new MediaItem({
      sources: ['tmdb'],
      nameOriginal: item.original_title,
      alternativeNames: [],
      year: null,
      imdbId: null,
      rating: {
        tmdb: item.vote_average,
        average: item.vote_average,
      },
      genres: [],
      ids: {
        tmdb: item.id,
      },
      images: [],
      links: {
        tmdb: `https://www.themoviedb.org/movie/${item.id}/`,
      },
    });
    if (item.release_date) {
      mediaItem.year = new Date(item.release_date).getFullYear();
    }
    item.genre_ids.forEach((genreId) => {
      const genre = TmdbGenresDictionary.find((x) => x.id == genreId);
      mediaItem.genres.push(genre.genreEn);
    });
    if (item.poster_path) {
      mediaItem.images.push(
        `https://image.tmdb.org/t/p/original${item.poster_path}`,
      );
    }
    if (item.backdrop_path) {
      mediaItem.images.push(
        `https://image.tmdb.org/t/p/original${item.backdrop_path}`,
      );
    }
    return mediaItem;
  }

  /**
   * Summary: Brings single media from the source to a common interface
   */
  private convertSingleItemToMedia(item): DetailedMediaItem {
    const mediaItem = new DetailedMediaItem({
      sources: ['tmdb'],
      nameOriginal: item.original_title,
      alternativeNames: [],
      year: null,
      imdbId: item.imdb_id,
      rating: {
        tmdb: item.vote_average,
        average: item.vote_average,
      },
      genres: [],
      ids: {
        tmdb: item.id,
      },
      images: [],
      links: {
        tmdb: `https://www.themoviedb.org/movie/${item.id}/`,
      },
      overview: item.overview,
      budget: item.budget,
      originalLanguage: item.original_language,
    });
    if (item.release_date) {
      mediaItem.year = new Date(item.release_date).getFullYear();
    }
    item.genres.forEach((genre) => mediaItem.genres.push(genre.name));
    if (item.poster_path) {
      mediaItem.images.push(
        `https://image.tmdb.org/t/p/original${item.poster_path}`,
      );
    }
    if (item.backdrop_path) {
      mediaItem.images.push(
        `https://image.tmdb.org/t/p/original${item.backdrop_path}`,
      );
    }
    return mediaItem;
  }

  /**
   * Summary: Helper function for HTTP API search request
   */
  private findMediaRequest({
    searchParams,
    page,
  }: {
    searchParams: any;
    page: number;
  }) {
    return firstValueFrom(
      this.httpService.get(`${this.apiHost}/search/movie`, {
        headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
        params: {
          page,
          ...searchParams,
        },
      }),
    );
  }

  /**
   * Summary: Helper function for HTTP API get by id request
   */
  private getSingleMediaRequest(id: string) {
    return firstValueFrom(
      this.httpService.get(`${this.apiHost}/movie/${id}`, {
        headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
        params: {
          api_key: this.apiKey,
        },
      }),
    );
  }

  /**
   * Summary: Additionally filters data on request
   */
  private filterMedia(data: Array<MediaItem>, findMediaDto: FindMediaDto) {
    if (findMediaDto.yearTo) {
      data = data.filter((item) => item.year <= findMediaDto.yearTo);
    }
    if (findMediaDto.yearFrom) {
      data = data.filter((item) => item.year >= findMediaDto.yearFrom);
    }
    if (findMediaDto.ratingTo) {
      data = data.filter((item) => item.rating.tmdb <= findMediaDto.ratingTo);
    }
    if (findMediaDto.ratingFrom) {
      data = data.filter((item) => item.rating.tmdb >= findMediaDto.ratingFrom);
    }
    return data;
  }

  /**
   * Summary: Finds IMDb IDs for the specified media
   */
  private async findImdbIds(data) {
    const detailedInfo = await Promise.allSettled(
      data.map((item) => {
        return this.getSingleMediaRequest(item.ids.tmdb);
      }),
    );
    detailedInfo.forEach((item, index) => {
      if (item.status === 'fulfilled') {
        item.value.data.imdb_id = item.value.data.imdb_id
          ? item.value.data.imdb_id
          : null;
        data[index].imdbId = item.value.data.imdb_id;
      }
    });
  }
}
