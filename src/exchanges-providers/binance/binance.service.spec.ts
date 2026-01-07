import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { BinanceService } from './binance.service';

describe('BinanceService', () => {
  let service: BinanceService;
  let httpService: HttpService;

  const mockHttpService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BinanceService,
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    service = module.get<BinanceService>(BinanceService);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDepth', () => {
    it('should return formatted market data', async () => {
      const mockResponse = {
        data: {
          lastUpdateId: 123456789,
          bids: [['50000.00', '1.5'], ['49999.00', '2.0']],
          asks: [['50001.00', '1.0'], ['50002.00', '3.0']],
        },
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      const result = await service.getDepth('BTCUSDT', 100);

      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://api.binance.com/api/v3/depth',
        { params: { symbol: 'BTCUSDT', limit: 100 } },
      );

      expect(result).toEqual({
        symbol: 'BTCUSDT',
        exchange: 'binance',
        lastUpdateId: 123456789,
        bids: [['50000.00', '1.5'], ['49999.00', '2.0']],
        asks: [['50001.00', '1.0'], ['50002.00', '3.0']],
      });
    });

    it('should use default limit of 100', async () => {
      const mockResponse = {
        data: {
          lastUpdateId: 123456789,
          bids: [],
          asks: [],
        },
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      await service.getDepth('ETHUSDT');

      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://api.binance.com/api/v3/depth',
        { params: { symbol: 'ETHUSDT', limit: 100 } },
      );
    });
  });
});
