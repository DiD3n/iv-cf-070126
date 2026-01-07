import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ExchangesModule } from "./exchanges/exchanges.module";
import { ViewsModule } from "./views/views.module";
import { ExchangesProvidersModule } from "./exchanges-providers/exchanges-providers.module";
import { InfraModule } from "./infra/infra.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MDB_CONNECTION_STRING || ''),
    ScheduleModule.forRoot(),
    ExchangesModule,
    ViewsModule,
    ExchangesProvidersModule,
    InfraModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
