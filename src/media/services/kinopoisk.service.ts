import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { FindMediaDto } from '../dto/find-media.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KinopoiskService {
  private apiHost: string;
  private apiKey: string;
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.apiHost = configService.get('media.kinopoiskHost');
    this.apiKey = configService.get('media.kinopoiskKey');
  }

  async findMedia(findMediaDto: FindMediaDto) {}
}
