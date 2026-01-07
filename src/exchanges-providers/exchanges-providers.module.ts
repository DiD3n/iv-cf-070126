import { Module } from '@nestjs/common';
import { BinanceService } from './binance/binance.service';
import { HttpModule } from '@nestjs/axios';
import { ExchangesProvidersService } from './exchanges-providers/exchanges-providers.service';

@Module({
  imports: [HttpModule],
  providers: [BinanceService, ExchangesProvidersService]
})
export class ExchangesProvidersModule {}
