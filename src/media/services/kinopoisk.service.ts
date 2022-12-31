import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KinopoiskService {
  private apiHost: string;
  private apiKey: string;
  constructor(private configService: ConfigService) {
    this.apiHost = '';
    this.apiKey = '';
  }
}
