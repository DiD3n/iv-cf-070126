
export interface MarketSymbolData {
    symbol: string;
    exchange: string;

    lastUpdateId: number;
    bids: [string, string][];
    asks: [string, string][];
}