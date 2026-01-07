import { Module } from '@nestjs/common';
import { MarketHistoryService } from './market-history/market-history.service';
import { MarketCollectorService } from './market-collector/market-collector.service';

@Module({
  providers: [MarketHistoryService, MarketCollectorService]
})
export class ExchangesModule {}
