import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { MarketSymbolData } from '../marketData.interface';
import { MarketProvider } from '../marketProvider.interface';

interface DepthResponse {
    lastUpdateId: number;
    bids: [string, string][];
    asks: [string, string][];
}

@Injectable()
export class BinanceService implements MarketProvider {

    constructor(
        private readonly httpService: HttpService,
    ) {}

    async getDepth(symbol: string, limit: number = 100): Promise<MarketSymbolData> {
        const response = await firstValueFrom(
            this.httpService.get<DepthResponse>('https://api.binance.com/api/v3/depth', { // todo: test this
                params: { symbol, limit },
            }),
        );
        return this.formatResult(symbol, response.data);
    }

    private formatResult(symbol: string, data: DepthResponse): MarketSymbolData {
        return {
            symbol,
            exchange: 'binance',
            lastUpdateId: data.lastUpdateId,
            bids: data.bids,
            asks: data.asks,
        };
    }
}
