import { Module } from '@nestjs/common';
import { MarketHistoryService } from './market-history/market-history.service';
import { ExchangesProvidersModule } from '../exchanges-providers/exchanges-providers.module';
import { InfraModule } from '../infra/infra.module';

@Module({
  imports: [ExchangesProvidersModule, InfraModule],
  exports: [MarketHistoryService],
  providers: [MarketHistoryService]
})
export class ExchangesModule {}
