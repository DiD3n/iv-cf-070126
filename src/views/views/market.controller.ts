import { Controller, Get, Render } from '@nestjs/common';
import { MarketViewService } from './market-view.service';

@Controller()
export class ViewsController {

    constructor(
        private readonly marketViewService: MarketViewService
    ) {}

    @Get('/test')
    @Render('index')
    getHomePage() {
        const getData = this.marketViewService.marketSymbolView('BTCUSDT'); //todo: move to query param
        console.log('Market Data:', getData);

        return { message: JSON.stringify(getData) };
    }
}
