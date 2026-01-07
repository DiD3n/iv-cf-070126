import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MarketSymbolData } from '../../exchanges-providers/marketData.interface';
import { MarketHistory, MarketHistoryDocument, MarketHistorySchema } from '../../infra/schemas/market-history.schema';

export interface MarketHistoryQuery {
    symbol: string;
    startTime?: Date;
    endTime?: Date;
    limit?: number;
}

@Injectable()
export class MarketHistoryService {
    private readonly logger = new Logger(MarketHistoryService.name);
    private readonly DEFAULT_CACHE_TTL_MS = 60000; // 1 minute default cache TTL

    constructor(
        @InjectModel(MarketHistory.name)
        private readonly marketHistoryModel: Model<MarketHistoryDocument>,
    ) {}

    /**
     * Get the latest cached market data for a symbol
     * Returns null if cache is stale or not found
     */
    async getLatestCached(symbol: string, maxAgeMs: number = this.DEFAULT_CACHE_TTL_MS): Promise<MarketSymbolData | null> {
        const minTimestamp = new Date(Date.now() - maxAgeMs);

        const cached = await this.marketHistoryModel
            .findOne({
                symbol,
                timestamp: { $gte: minTimestamp },
            })
            .sort({ timestamp: -1 })
            .exec();

        if (!cached) {
            this.logger.debug(`No valid cache found for ${symbol}`);
            return null;
        }

        this.logger.debug(`Cache hit for ${symbol}`);
        return this.toMarketSymbolData(cached);
    }

    /**
     * Get market history for a symbol within a time range
     */
    async getMarketHistory(query: MarketHistoryQuery): Promise<MarketSymbolData[]> {
        const filter: Record<string, unknown> = { symbol: query.symbol };

        if (query.startTime || query.endTime) {
            filter.timestamp = {};
            if (query.startTime) {
                (filter.timestamp as Record<string, Date>).$gte = query.startTime;
            }
            if (query.endTime) {
                (filter.timestamp as Record<string, Date>).$lte = query.endTime;
            }
        }

        const results = await this.marketHistoryModel
            .find(filter)
            .sort({ timestamp: -1 })
            .limit(query.limit || 100)
            .exec();

        return results.map((doc) => this.toMarketSymbolData(doc));
    }

    /**
     * Get or fetch market data with caching
     * If cached data exists and is fresh, returns cached data
     * Otherwise fetches fresh data and caches it
     */
    async getOrFetch(
        symbol: string,
        fetchFn: () => Promise<MarketSymbolData>,
        maxAgeMs: number = this.DEFAULT_CACHE_TTL_MS,
    ): Promise<MarketSymbolData> {
        // Try to get from cache first
        const cached = await this.getLatestCached(symbol, maxAgeMs);
        if (cached) {
            return cached;
        }

        // Fetch fresh data
        const freshData = await fetchFn();

        // Save to cache (fire and forget, don't block the response)
        this.saveMarketData(freshData).catch((err) => {
            this.logger.error(`Failed to cache market data for ${symbol}`, err);
        });

        return freshData;
    }
    
    private async saveMarketData(data: MarketSymbolData): Promise<MarketHistoryDocument> {
        const marketHistory: MarketHistory = {
            symbol: data.symbol,
            exchange: data.exchange,
            lastUpdateId: data.lastUpdateId,
            bids: data.bids,
            asks: data.asks,
            timestamp: new Date(),
        }

        const saved = await this.marketHistoryModel.insertOne(marketHistory);
        this.logger.debug(`Cached market data for ${data.symbol} from ${data.exchange}`);
        return saved;
    }

    private toMarketSymbolData(doc: MarketHistoryDocument): MarketSymbolData {
        return {
            symbol: doc.symbol,
            exchange: doc.exchange,
            lastUpdateId: doc.lastUpdateId,
            bids: doc.bids,
            asks: doc.asks,
        };
    }
}
