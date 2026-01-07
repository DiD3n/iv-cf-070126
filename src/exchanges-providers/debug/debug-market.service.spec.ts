import { DebugMarketService } from './debug-market.service';

describe('DebugMarketService', () => {
  let service: DebugMarketService;

  beforeEach(() => {
    service = new DebugMarketService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDepth', () => {
    it('should return market data with correct structure', async () => {
      const result = await service.getDepth('BTCUSDT', 10);

      expect(result).toHaveProperty('symbol', 'BTCUSDT');
      expect(result).toHaveProperty('exchange', 'debug');
      expect(result).toHaveProperty('lastUpdateId');
      expect(result).toHaveProperty('bids');
      expect(result).toHaveProperty('asks');
      expect(Array.isArray(result.bids)).toBe(true);
      expect(Array.isArray(result.asks)).toBe(true);
    });

    it('should return deterministic data for the same symbol', async () => {
      const result1 = await service.getDepth('BTCUSDT', 10);
      const result2 = await service.getDepth('BTCUSDT', 10);

      expect(result1.lastUpdateId).toBe(result2.lastUpdateId);
      expect(result1.bids).toEqual(result2.bids);
      expect(result1.asks).toEqual(result2.asks);
    });

    it('should return different data for different symbols', async () => {
      const btc = await service.getDepth('BTCUSDT', 10);
      const eth = await service.getDepth('ETHUSDT', 10);

      expect(btc.lastUpdateId).not.toBe(eth.lastUpdateId);
      expect(btc.bids).not.toEqual(eth.bids);
    });

    it('should respect the limit parameter', async () => {
      const result5 = await service.getDepth('BTCUSDT', 5);
      const result20 = await service.getDepth('BTCUSDT', 20);

      expect(result5.bids.length).toBeLessThanOrEqual(5);
      expect(result5.asks.length).toBeLessThanOrEqual(5);
      expect(result20.bids.length).toBeLessThanOrEqual(20);
      expect(result20.asks.length).toBeLessThanOrEqual(20);
    });

    it('should have bids in descending order', async () => {
      const result = await service.getDepth('BTCUSDT', 10);

      for (let i = 1; i < result.bids.length; i++) {
        const prevPrice = parseFloat(result.bids[i - 1][0]);
        const currPrice = parseFloat(result.bids[i][0]);
        expect(prevPrice).toBeGreaterThan(currPrice);
      }
    });

    it('should have asks in ascending order', async () => {
      const result = await service.getDepth('BTCUSDT', 10);

      for (let i = 1; i < result.asks.length; i++) {
        const prevPrice = parseFloat(result.asks[i - 1][0]);
        const currPrice = parseFloat(result.asks[i][0]);
        expect(prevPrice).toBeLessThan(currPrice);
      }
    });

    it('should have best bid lower than best ask (spread)', async () => {
      const result = await service.getDepth('BTCUSDT', 10);

      const bestBid = parseFloat(result.bids[0][0]);
      const bestAsk = parseFloat(result.asks[0][0]);

      expect(bestBid).toBeLessThan(bestAsk);
    });

    it('should use predefined base prices for known symbols', async () => {
      const btc = await service.getDepth('BTCUSDT', 10);
      const bestBid = parseFloat(btc.bids[0][0]);
      const bestAsk = parseFloat(btc.asks[0][0]);
      const midPrice = (bestBid + bestAsk) / 2;

      // Should be close to 42500 (within 1%)
      expect(midPrice).toBeGreaterThan(42000);
      expect(midPrice).toBeLessThan(43000);
    });

    it('should generate valid price and quantity strings', async () => {
      const result = await service.getDepth('BTCUSDT', 10);

      result.bids.forEach(([price, qty]) => {
        expect(parseFloat(price)).toBeGreaterThan(0);
        expect(parseFloat(qty)).toBeGreaterThan(0);
        expect(price).not.toContain('NaN');
        expect(qty).not.toContain('NaN');
      });

      result.asks.forEach(([price, qty]) => {
        expect(parseFloat(price)).toBeGreaterThan(0);
        expect(parseFloat(qty)).toBeGreaterThan(0);
      });
    });
  });
});
