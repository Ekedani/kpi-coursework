import { Test, TestingModule } from '@nestjs/testing';
import { KinopoiskService } from './kinopoisk.service';

describe('KinopoiskService', () => {
  let service: KinopoiskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KinopoiskService],
    }).compile();

    service = module.get<KinopoiskService>(KinopoiskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
