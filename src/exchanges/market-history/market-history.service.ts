import { Injectable } from '@nestjs/common';
import { MarketSymbolData } from 'src/exchanges-providers/marketData.interface';

@Injectable()
export class MarketHistoryService {

    getMarketHistory(symbol: string): MarketSymbolData {
        return {
            symbol,
            exchange: 'MockExchange',
            lastUpdateId: 0,
            bids: [['100.0', '1.0']],
            asks: [['101.0', '1.5']],
        }
    }
}
