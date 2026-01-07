import { Test, TestingModule } from '@nestjs/testing';
import { MarketCollectorService } from './market-collector.service';

describe('MarketCollectorService', () => {
  let service: MarketCollectorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarketCollectorService],
    }).compile();

    service = module.get<MarketCollectorService>(MarketCollectorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
