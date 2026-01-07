import { Injectable } from '@nestjs/common';
import { MarketHistoryService } from 'src/exchanges/market-history/market-history.service';

@Injectable()
export class MarketViewService {
    constructor(
        private readonly marketHistoryService: MarketHistoryService
    ) {}

    marketSymbolView() {
        return {
            marketData: this.marketHistoryService.getMarketHistory('BTCUSDT')
        }
    }
}
