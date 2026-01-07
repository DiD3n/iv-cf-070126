import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ExchangesModule } from "./exchanges/exchanges.module";
import { ViewsModule } from "./views/views.module";
import { ExchangesProvidersModule } from "./exchanges-providers/exchanges-providers.module";
import { MarketHistoryService } from "./exchanges/market-history/market-history.service";
import { InfraModule } from "./infra/infra.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://localhost/nest"),
    ScheduleModule.forRoot(),
    ExchangesModule,
    ViewsModule,
    ExchangesProvidersModule,
    InfraModule,
  ],
  controllers: [AppController],
  providers: [AppService, MarketHistoryService],
})
export class AppModule {}
