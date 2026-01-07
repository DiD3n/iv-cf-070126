import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MarketHistoryDocument = MarketHistory & Document;

@Schema({ timestamps: true })
export class MarketHistory {
    @Prop({ required: true, index: true })
    symbol: string;

    @Prop({ required: true })
    exchange: string;

    @Prop({ required: true })
    lastUpdateId: number;

    @Prop({ type: [[String]], required: true })
    bids: [string, string][];

    @Prop({ type: [[String]], required: true })
    asks: [string, string][];

    @Prop({ type: Date, default: Date.now, index: true })
    timestamp: Date;
}

export const MarketHistorySchema = SchemaFactory.createForClass(MarketHistory);

// Create compound index for efficient queries
MarketHistorySchema.index({ symbol: 1, timestamp: -1 });

// TTL index to automatically delete old records after 24 hours (optional)
MarketHistorySchema.index({ timestamp: 1 }, { expireAfterSeconds: 86400 });
