import { Test, TestingModule } from '@nestjs/testing';
import { ExchangesProvidersService } from './exchanges-providers.service';

describe('ExchangesProvidersService', () => {
  let service: ExchangesProvidersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExchangesProvidersService],
    }).compile();

    service = module.get<ExchangesProvidersService>(ExchangesProvidersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
