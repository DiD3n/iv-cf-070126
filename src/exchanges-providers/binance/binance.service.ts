import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { MarketSymbolData } from '../marketData.interface';
import { MarketProvider } from '../marketProvider.interface';

interface DepthResponse {
    lastUpdateId: number;
    bids: [string, string][];
    asks: [string, string][];
}

interface RetryConfig {
    maxRetries: number;
    baseDelayMs: number;
    maxDelayMs: number;
}

@Injectable()
export class BinanceService implements MarketProvider {
    private readonly logger = new Logger(BinanceService.name);
    private readonly retryConfig: RetryConfig = {
        maxRetries: 3,
        baseDelayMs: 1000,
        maxDelayMs: 30000,
    };

    constructor(
        private readonly httpService: HttpService,
    ) {}

    async getDepth(symbol: string, limit: number = 100): Promise<MarketSymbolData> {
        return this.executeWithRetry(async () => {
            // todo: check for authentication if needed in future
            const response = await firstValueFrom(
                this.httpService.get<DepthResponse>('https://api.binance.com/api/v3/depth', {
                    params: { symbol, limit },
                }),
            );
            return this.formatResult(symbol, response.data);
        });
    }

    private async executeWithRetry<T>(operation: () => Promise<T>): Promise<T> {
        let lastError: Error | undefined;

        for (let attempt = 0; attempt <= this.retryConfig.maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error as Error;
                
                if (!this.isRetryableError(error)) {
                    throw error;
                }

                if (attempt === this.retryConfig.maxRetries) {
                    this.logger.error(`Max retries (${this.retryConfig.maxRetries}) exceeded`, lastError.message);
                    throw error;
                }

                const delay = this.calculateDelay(error, attempt);
                this.logger.warn(
                    `Request failed (attempt ${attempt + 1}/${this.retryConfig.maxRetries + 1}), ` +
                    `retrying in ${delay}ms: ${lastError.message}`
                );
                
                await this.sleep(delay);
            }
        }

        throw lastError;
    }

    private isRetryableError(error: unknown): boolean {
        if (!(error instanceof AxiosError)) {
            return false;
        }

        const status = error.response?.status;

        // Rate limit errors (429) and server errors (5xx) are retryable
        if (status === 429 || (status && status >= 500 && status < 600)) {
            return true;
        }

        // Network errors (no response) are retryable
        if (!error.response && error.code) {
            const retryableCodes = ['ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED', 'ENOTFOUND'];
            return retryableCodes.includes(error.code);
        }

        return false;
    }

    private calculateDelay(error: unknown, attempt: number): number {
        // Check for Retry-After header (common in rate limit responses)
        if (error instanceof AxiosError && error.response?.headers) {
            const retryAfter = error.response.headers['retry-after'];
            if (retryAfter) {
                const retryAfterMs = parseInt(retryAfter, 10) * 1000;
                if (!isNaN(retryAfterMs) && retryAfterMs > 0) {
                    return Math.min(retryAfterMs, this.retryConfig.maxDelayMs);
                }
            }
        }

        // Exponential backoff: baseDelay * 2^attempt with jitter
        const exponentialDelay = this.retryConfig.baseDelayMs * Math.pow(2, attempt);
        const jitter = Math.random() * 0.3 * exponentialDelay; // Add up to 30% jitter
        const delay = exponentialDelay + jitter;

        return Math.min(delay, this.retryConfig.maxDelayMs);
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
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
