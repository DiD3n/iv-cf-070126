import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExchangesModule } from './exchanges/exchanges.module';
import { ViewsModule } from './views/views.module';
import { MarketHistoryService } from './exchange/market-history/market-history.service';
import { ExchangesProvidersService } from './exchanges-providers/exchanges-providers.service';
import { ExchangesProvidersModule } from './exchanges-providers/exchanges-providers.module';

@Module({
  imports: [ExchangesModule, ViewsModule, ExchangesProvidersModule],
  controllers: [AppController],
  providers: [AppService, MarketHistoryService, ExchangesProvidersService],
})
export class AppModule {}
