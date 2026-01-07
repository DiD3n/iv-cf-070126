import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MarketHistory, MarketHistorySchema } from './schemas/market-history.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: MarketHistory.name, schema: MarketHistorySchema },
        ]),
    ],
    exports: [MongooseModule],
})
export class InfraModule {}
