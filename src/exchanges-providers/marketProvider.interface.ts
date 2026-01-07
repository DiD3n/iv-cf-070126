import { MarketSymbolData } from "./marketData.interface";


// universal interface for market data providers
export interface MarketProvider {
    getDepth(symbol: string, limit?: number): Promise<MarketSymbolData>;
}