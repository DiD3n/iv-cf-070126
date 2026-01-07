import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExchangesModule } from './exchanges/exchanges.module';
import { ViewsModule } from './views/views.module';
import { ExchangesProvidersModule } from './exchanges-providers/exchanges-providers.module';
import { MarketHistoryService } from './exchanges/market-history/market-history.service';

@Module({
  imports: [ExchangesModule, ViewsModule, ExchangesProvidersModule],
  controllers: [AppController],
  providers: [AppService, MarketHistoryService],
})
export class AppModule {}
