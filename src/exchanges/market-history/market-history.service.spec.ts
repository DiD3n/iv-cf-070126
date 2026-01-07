import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MarketHistoryService } from './market-history.service';
import { MarketHistory, MarketHistoryDocument } from '../../infra/schemas/market-history.schema';
import { MarketSymbolData } from '../../exchanges-providers/marketData.interface';

describe('MarketHistoryService', () => {
  let service: MarketHistoryService;
  let model: Model<MarketHistoryDocument>;

  const mockMarketData: MarketSymbolData = {
    symbol: 'BTCUSDT',
    exchange: 'Binance',
    lastUpdateId: 12345,
    bids: [['50000.00', '1.5']],
    asks: [['50001.00', '2.0']],
  };

  const mockMarketHistoryDoc = {
    ...mockMarketData,
    timestamp: new Date(),
    save: jest.fn().mockResolvedValue(mockMarketData),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketHistoryService,
        {
          provide: getModelToken(MarketHistory.name),
          useValue: {
            new: jest.fn().mockResolvedValue(mockMarketHistoryDoc),
            constructor: jest.fn().mockResolvedValue(mockMarketHistoryDoc),
            findOne: jest.fn(),
            find: jest.fn(),
            deleteMany: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MarketHistoryService>(MarketHistoryService);
    model = module.get<Model<MarketHistoryDocument>>(getModelToken(MarketHistory.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getLatestCached', () => {
    it('should return null when no cache exists', async () => {
      // Given: no cached data exists in the database
      jest.spyOn(model, 'findOne').mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      } as any);

      // When: requesting the latest cached data for a symbol
      const result = await service.getLatestCached('BTCUSDT');

      // Then: should return null
      expect(result).toBeNull();
    });

    it('should return cached data when available', async () => {
      // Given: cached data exists in the database
      jest.spyOn(model, 'findOne').mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockMarketHistoryDoc),
        }),
      } as any);

      // When: requesting the latest cached data for a symbol
      const result = await service.getLatestCached('BTCUSDT');

      // Then: should return the cached market data
      expect(result).toEqual(mockMarketData);
    });
  });

  describe('getOrFetch', () => {
    it('should return cached data if available', async () => {
      // Given: cached data exists in the database
      jest.spyOn(model, 'findOne').mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockMarketHistoryDoc),
        }),
      } as any);
      const fetchFn = jest.fn();

      // When: requesting data with a fetch function
      const result = await service.getOrFetch('BTCUSDT', fetchFn);

      // Then: should return cached data without calling fetch function
      expect(result).toEqual(mockMarketData);
      expect(fetchFn).not.toHaveBeenCalled();
    });

    it('should fetch and cache data if cache is empty', async () => {
      // Given: no cached data exists in the database
      jest.spyOn(model, 'findOne').mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      } as any);
      const fetchFn = jest.fn().mockResolvedValue(mockMarketData);

      // When: requesting data with a fetch function
      const result = await service.getOrFetch('BTCUSDT', fetchFn);

      // Then: should fetch fresh data and return it
      expect(result).toEqual(mockMarketData);
      expect(fetchFn).toHaveBeenCalled();
    });
  });
});
