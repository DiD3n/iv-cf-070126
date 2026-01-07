import { Module } from '@nestjs/common';
import { BinanceService } from './binance/binance.service';

@Module({
  providers: [BinanceService]
})
export class ExchangesProvidersModule {}
