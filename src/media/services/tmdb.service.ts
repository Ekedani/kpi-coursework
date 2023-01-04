import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { FindMediaDto } from '../dto/find-media.dto';
import { firstValueFrom } from 'rxjs';
import { MediaInterface } from '../common/media.interface';
import { TmdbGenresDictionary } from '../common/dictionaries/tmdb-genres.dictionary';

@Injectable()
export class TmdbService {
  private readonly apiHost: string;
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.apiHost = configService.get('media.tmdbHost');
    this.apiKey = configService.get('media.tmdbKey');
  }

  async findMedia(findMediaDto: FindMediaDto) {
    const searchParams = {
      api_key: this.apiKey,
      query: findMediaDto.keyword,
    };
    const { data } = await this.findMovieRequest({ searchParams, page: 1 });
    let { total_pages: totalPages } = data;
    totalPages = totalPages <= 20 ? totalPages : 20;
    if (totalPages > 1) {
      const requests = [];
      for (let page = 2; page <= totalPages; page++) {
        requests.push(this.findMovieRequest({ searchParams, page }));
      }
      const responses = await Promise.allSettled(requests);
      responses.forEach((response) => {
        if (response.status === 'fulfilled') {
          data.results.push(...response.value.data.results);
        }
      });
    }
    const convertedData = data.results.map((item) =>
      this.convertItemToMedia(item),
    );
    return this.filterMedia(convertedData, findMediaDto);
  }

  private convertItemToMedia(item): MediaInterface {
    const mediaItem: MediaInterface = {
      sources: ['tmdb'],
      nameOriginal: item.original_title,
      alternativeNames: [],
      year: null,
      imdbId: null,
      rating: {
        tmdb: item.vote_average,
      },
      genres: [],
      ids: {
        tmdb: item.id,
      },
      images: [],
      links: {
        tmdb: `https://www.themoviedb.org/movie/${item.id}/`,
      },
    };
    if (item.release_date) {
      mediaItem.year = new Date(item.release_date).getFullYear();
    }
    item.genre_ids.forEach((genreId) => {
      const genre = TmdbGenresDictionary.find((x) => x.id == genreId);
      return genre.genreEn;
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

  private findMovieRequest({
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

  private filterMedia(data: Array<MediaInterface>, findMediaDto: FindMediaDto) {
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
    console.log(data.length, ' filtered');
    return data;
  }
}
