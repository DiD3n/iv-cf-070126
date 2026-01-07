import { Module } from '@nestjs/common';
import { MarketHistoryService } from './market-history/market-history.service';
import { MarketCollectorService } from './market-collector/market-collector.service';
import { ExchangesProvidersModule } from 'src/exchanges-providers/exchanges-providers.module';

@Module({
  imports: [ExchangesProvidersModule],
  providers: [MarketHistoryService, MarketCollectorService]
})
export class ExchangesModule {}
