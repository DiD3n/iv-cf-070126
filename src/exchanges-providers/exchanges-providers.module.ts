import { Module } from '@nestjs/common';
import { BinanceService } from './binance/binance.service';
import { HttpModule } from '@nestjs/axios';
import { ExchangesProvidersService } from './exchanges-providers/exchanges-providers.service';
import { DebugMarketService } from './debug/debug-market.service';

@Module({
  imports: [HttpModule],
  providers: [BinanceService, DebugMarketService, ExchangesProvidersService],
  exports: [ExchangesProvidersService],
})
export class ExchangesProvidersModule {}
