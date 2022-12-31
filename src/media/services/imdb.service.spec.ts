import { Test, TestingModule } from '@nestjs/testing';
import { ImdbService } from './imdb.service';

describe('ImdbService', () => {
  let service: ImdbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImdbService],
    }).compile();

    service = module.get<ImdbService>(ImdbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
