import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { FindMediaDto } from '../dto/find-media.dto';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { MediaItem } from '../common/media-item';
import { KinopoiskGenresDictionary } from '../common/dictionaries/kinopoisk-genres.dictionary';
import { DetailedMediaItem } from '../common/detailed-media-item';

/**
 * Summary: Service responsible for pulling data from the source "Kinopoisk"
 */
@Injectable()
export class KinopoiskService {
  public readonly serviceName: string = 'kinopoisk';
  private readonly apiHost: string;
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.apiHost = configService.get('media.kinopoiskHost');
    this.apiKey = configService.get('media.kinopoiskKey');
  }

  /**
   * Summary: Pulls data by specified keywords and filters
   */
  async findMedia(findMediaDto: FindMediaDto) {
    const searchParams = {
      keyword: findMediaDto.keyword,
      yearFrom: findMediaDto.yearFrom,
      yearTo: findMediaDto.yearTo,
      ratingFrom: findMediaDto.ratingFrom,
      ratingTo: findMediaDto.ratingTo,
    };
    const { data } = await this.findMediaRequest({
      searchParams,
      page: 1,
    });
    const { totalPages } = data;
    if (totalPages > 1) {
      const requests = [];
      for (let page = 2; page <= totalPages; page++) {
        requests.push(this.findMediaRequest({ searchParams, page }));
      }
      const responses = await Promise.all(requests);
      responses.forEach((response) => {
        data.items.push(...response.data.items);
      });
    }
    return data.items.map((item) => this.convertItemToMedia(item));
  }

  /**
   * Summary: Pulls media data by ID
   */
  async getSingleMedia(id: string) {
    const response = await this.getSingleMediaRequest(id);
    const item = this.convertItemToMedia(response.data);
    return new DetailedMediaItem({ ...item });
  }

  /**
   * Summary: Brings data from the source to a common interface
   */
  private convertItemToMedia(item): MediaItem {
    const mediaItem = new MediaItem({
      sources: ['kinopoisk'],
      nameOriginal: item.nameOriginal ?? item.nameRu,
      alternativeNames: [],
      year: item.year,
      imdbId: item.imdbId,
      rating: {},
      genres: [],
      ids: {
        kinopoisk: item.kinopoiskId,
      },
      images: [item.posterUrl, item.posterUrlPreview],
      links: {
        kinopoisk: `https://www.kinopoisk.ru/film/${item.kinopoiskId}/`,
      },
    });
    if (item.nameRu && mediaItem.nameOriginal !== item.nameRu) {
      mediaItem.alternativeNames.push(item.nameRu);
    }
    if (item.ratingKinopoisk) {
      mediaItem.rating.kinopoisk = item.ratingKinopoisk;
      mediaItem.rating.average = item.ratingKinopoisk;
    }
    item.genres.forEach((kinopoiskGenre) => {
      const genre = KinopoiskGenresDictionary.find((x) => {
        return kinopoiskGenre.genre === x.genreRu;
      });
      mediaItem.genres.push(genre.genreEn);
    });
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
      this.httpService.get(`${this.apiHost}/api/v2.2/films`, {
        headers: {
          'Accept-Encoding': 'gzip,deflate,compress',
          'x-api-key': this.apiKey,
        },
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
      this.httpService.get(`${this.apiHost}/api/v2.2/films/${id}`, {
        headers: {
          'Accept-Encoding': 'gzip,deflate,compress',
          'x-api-key': this.apiKey,
        },
      }),
    );
  }
}
