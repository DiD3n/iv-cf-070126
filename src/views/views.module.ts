import { Module } from '@nestjs/common';
import { ViewsController } from './views/market.controller';
import { MarketViewService } from './views/market-view.service';
import { ExchangesModule } from 'src/exchanges/exchanges.module';

@Module({
  imports: [
    ExchangesModule,
  ],
  controllers: [ViewsController],
  providers: [MarketViewService]
})
export class ViewsModule {}
