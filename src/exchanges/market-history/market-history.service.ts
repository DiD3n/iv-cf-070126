import { Injectable } from "@nestjs/common";
import { MarketSymbolData } from "../../exchanges-providers/marketData.interface";
import { ExchangesProvidersService } from "../../exchanges-providers/exchanges-providers/exchanges-providers.service";
import {
    MarketHistoryStoreService,
} from "./market-history-store.service";

type Exchange = "binance" | "debug";

@Injectable()
export class MarketHistoryService {
    constructor(
        private readonly store: MarketHistoryStoreService,
        private readonly exchangesProviders: ExchangesProvidersService,
    ) {}

    async getMarketData(
        symbol: string,
        limit: number = 100,
        exchange: Exchange = "debug",
    ): Promise<MarketSymbolData> {
        return this.store.getOrFetch(
            symbol,
            () =>
                this.exchangesProviders.getMarketDataForSymbol(
                    symbol,
                    limit,
                    exchange,
                ),
        );
    }
}
