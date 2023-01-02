import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { FindMediaDto } from '../dto/find-media.dto';
import { firstValueFrom } from 'rxjs';

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
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.apiHost}/search/movie`, {
        params: {
          api_key: this.apiKey,
          include_adult: true,
          query: findMediaDto.keyword,
          page: findMediaDto.page,
        },
      }),
    );
    return data;
  }
}
