import { MarketSymbolData } from "./marketData.interface";

// universal interface for market data providers
// (to ensure no processing in )
export interface MarketProvider {
    getDepth(symbol: string, limit?: number): Promise<MarketSymbolData>;
}