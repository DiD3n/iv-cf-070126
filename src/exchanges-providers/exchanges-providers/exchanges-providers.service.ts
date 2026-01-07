import { Injectable } from '@nestjs/common';
import { BinanceService } from '../binance/binance.service';
import { DebugMarketService } from '../debug/debug-market.service';
import { MarketSymbolData } from '../marketData.interface';

type Exchange = 'binance' | 'debug';

// addictional separation layer for future multiple exchange providers
@Injectable()
export class ExchangesProvidersService {

  constructor(
    private readonly binanceService: BinanceService,
    private readonly debugMarketService: DebugMarketService,
  ) {}

  async getMarketDataForSymbol(
    symbol: string, 
    limit: number,
    exchange: Exchange = 'debug',
  ): Promise<MarketSymbolData> {
    
    switch (exchange) {
      case 'debug':
        return this.debugMarketService.getDepth(symbol, limit);
      case 'binance':
      default:
        return this.binanceService.getDepth(symbol, limit);
    }
  }
}
