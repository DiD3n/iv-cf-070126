import { Test, TestingModule } from '@nestjs/testing';
import { MarketViewService } from './market-view.service';

describe('MarketViewService', () => {
  let service: MarketViewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarketViewService],
    }).compile();

    service = module.get<MarketViewService>(MarketViewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
