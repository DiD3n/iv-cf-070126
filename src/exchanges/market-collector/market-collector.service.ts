import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class MarketCollectorService {
    private logger = new Logger(MarketCollectorService.name);
    
}
