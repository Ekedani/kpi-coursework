import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { FindMediaDto } from '../dto/find-media.dto';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, lastValueFrom } from 'rxjs';

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

  async findMedia(findMediaDto: FindMediaDto) {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.apiHost}/api/v2.2/films`, {
        headers: {
          'x-api-key': this.apiKey,
        },
        params: {
          page: findMediaDto.page,
          keyword: findMediaDto.keyword,
          yearFrom: findMediaDto.yearFrom,
          yearTo: findMediaDto.yearTo,
          ratingFrom: findMediaDto.ratingFrom,
          ratingTo: findMediaDto.ratingTo,
        },
      }),
    );
    return data;
  }
}
