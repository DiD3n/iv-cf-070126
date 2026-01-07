import { Injectable } from '@nestjs/common';
import { MarketHistoryService } from '../../exchanges/market-history/market-history.service';

@Injectable()
export class MarketViewService {
    constructor(
        private readonly marketHistoryService: MarketHistoryService
    ) {}

    async marketSymbolView(symbol: string) {
        const marketData = await this.marketHistoryService.getMarketData(symbol, 100, "debug");
        return {
            marketData: JSON.stringify(marketData)
        }
    }
}
