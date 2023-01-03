import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { FindMediaDto } from '../dto/find-media.dto';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class KinopoiskService {
  private readonly apiHost: string;
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.apiHost = configService.get('media.kinopoiskHost');
    this.apiKey = configService.get('media.kinopoiskKey');
  }

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
          'x-api-key': this.apiKey,
        },
        params: {
          page,
          ...searchParams,
        },
      }),
    );
  }

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
    data.items.forEach((item) => {
      if (!item.nameOriginal) {
        item.nameOriginal = item.nameRu;
      }
    });
    return data;
  }
}
