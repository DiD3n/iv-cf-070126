import { Injectable } from '@nestjs/common';
import { BinanceService } from '../binance/binance.service';
import { MarketSymbolData } from '../marketData.interface';

// addictional separation layer for future multiple exchange providers
@Injectable()
export class ExchangesProvidersService {

  constructor(
    private readonly binanceService: BinanceService,
  ) {}

  async getMarketDataForSymbol(
    symbol: string, 
    limit: number, /* preferedExchange?: string */
  ): Promise<MarketSymbolData> {
    
    // for now we have only one exchange provider - Binance
    return this.binanceService.getDepth(symbol, limit);
  }
}
