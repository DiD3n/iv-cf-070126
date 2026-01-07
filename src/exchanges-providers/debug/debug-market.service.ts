// note: fully llm generated mock

import { Injectable, Logger } from '@nestjs/common';
import { MarketSymbolData } from '../marketData.interface';
import { MarketProvider } from '../marketProvider.interface';

/**
 * Generates a numeric seed from a string (symbol name)
 */
function stringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash);
}

interface DebugMarketConfig {
  /** Base price for the symbol (will be derived from symbol if not provided) */
  basePrice?: number;
  /** Price spread percentage (default: 0.1 = 0.1%) */
  spreadPercent?: number;
  /** Number of price levels to generate per side (default: 20) */
  defaultLevels?: number;
}

@Injectable()
export class DebugMarketService implements MarketProvider {
  private readonly logger = new Logger(DebugMarketService.name);
  private readonly config: Required<DebugMarketConfig>;

  // Predefined base prices for common symbols (for realistic data)
  private readonly symbolBasePrices: Record<string, number> = {
    BTCUSDT: 42500,
    ETHUSDT: 2250,
    BNBUSDT: 310,
    SOLUSDT: 95,
    XRPUSDT: 0.62,
    ADAUSDT: 0.58,
    DOGEUSDT: 0.085,
    DOTUSDT: 7.5,
    MATICUSDT: 0.85,
    LINKUSDT: 14.5,
  };

  constructor() {
    this.config = {
      basePrice: 100,
      spreadPercent: 0.1,
      defaultLevels: 20,
    };
    this.logger.log('DebugMarketService initialized with seeded random data');
  }

  async getDepth(symbol: string, limit: number = 100): Promise<MarketSymbolData> {
    const seed = stringToSeed(symbol);
    const rng = new SeededRandom(seed);

    const basePrice = this.getBasePrice(symbol, rng);
    const spreadPercent = this.config.spreadPercent;
    const levels = Math.min(limit, this.config.defaultLevels);

    const midPrice = basePrice;
    const halfSpread = (midPrice * spreadPercent) / 100 / 2;

    // Generate bids (buy orders) - prices below mid, descending
    const bids = this.generateOrderBook(
      rng,
      midPrice - halfSpread,
      levels,
      'descending',
      basePrice,
    );

    // Generate asks (sell orders) - prices above mid, ascending
    const asks = this.generateOrderBook(
      rng,
      midPrice + halfSpread,
      levels,
      'ascending',
      basePrice,
    );

    // Generate a deterministic lastUpdateId based on symbol
    const lastUpdateId = seed % 1000000000;

    this.logger.debug(
      `Generated mock depth for ${symbol}: ${bids.length} bids, ${asks.length} asks, mid=${midPrice.toFixed(4)}`,
    );

    return {
      symbol,
      exchange: 'debug',
      lastUpdateId,
      bids,
      asks,
    };
  }

  private getBasePrice(symbol: string, rng: SeededRandom): number {
    // Use predefined price if available
    if (this.symbolBasePrices[symbol]) {
      return this.symbolBasePrices[symbol];
    }

    // Generate a deterministic "realistic" price based on symbol
    // Use logarithmic scale for variety (0.01 to 10000)
    const logMin = Math.log10(0.01);
    const logMax = Math.log10(10000);
    const logPrice = rng.nextInRange(logMin, logMax);
    return Math.pow(10, logPrice);
  }

  private generateOrderBook(
    rng: SeededRandom,
    startPrice: number,
    levels: number,
    direction: 'ascending' | 'descending',
    basePrice: number,
  ): [string, string][] {
    const orders: [string, string][] = [];
    let currentPrice = startPrice;

    // Determine decimal precision based on price magnitude
    const pricePrecision = this.getPrecision(basePrice);
    const qtyPrecision = Math.max(0, 4 - Math.floor(Math.log10(basePrice)));

    for (let i = 0; i < levels; i++) {
      // Price step varies slightly for realism (0.01% to 0.05% of base price)
      const stepPercent = rng.nextInRange(0.01, 0.05);
      const priceStep = basePrice * (stepPercent / 100);

      if (direction === 'descending') {
        currentPrice -= priceStep;
      } else {
        currentPrice += priceStep;
      }

      // Ensure price is positive
      if (currentPrice <= 0) break;

      // Generate quantity - typically larger quantities at worse prices
      const distanceFromMid = i + 1;
      const baseQty = rng.nextInRange(0.1, 10) * distanceFromMid;
      const quantity = baseQty * rng.nextInRange(0.5, 2);

      const priceStr = currentPrice.toFixed(pricePrecision);
      const qtyStr = quantity.toFixed(qtyPrecision);

      orders.push([priceStr, qtyStr]);
    }

    return orders;
  }

  private getPrecision(price: number): number {
    if (price >= 1000) return 2;
    if (price >= 1) return 4;
    if (price >= 0.01) return 6;
    return 8;
  }
}


/**
 * Seeded random number generator (Mulberry32)
 * Produces deterministic pseudo-random numbers based on a seed
 */
class SeededRandom {
  private state: number;

  constructor(seed: number) {
    this.state = seed;
  }

  /** Returns a random float in [0, 1) */
  next(): number {
    this.state |= 0;
    this.state = (this.state + 0x6d2b79f5) | 0;
    let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Returns a random float in [min, max) */
  nextInRange(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  /** Returns a random integer in [min, max] */
  nextIntInRange(min: number, max: number): number {
    return Math.floor(this.nextInRange(min, max + 1));
  }
}
