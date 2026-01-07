import { Injectable } from '@nestjs/common';
import { MarketHistoryService } from '../../exchanges/market-history/market-history.service';

@Injectable()
export class MarketViewService {
    constructor(
        private readonly marketHistoryService: MarketHistoryService
    ) {}

    async marketSymbolView(symbol: string) {
        const marketData = await this.marketHistoryService.getMarketHistory({ symbol });
        return {
            marketData
        }
    }
}
