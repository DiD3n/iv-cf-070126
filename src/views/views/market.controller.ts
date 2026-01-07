import { Controller, Get, Render } from '@nestjs/common';
import { MarketViewService } from './market-view.service';

@Controller()
export class ViewsController {

    constructor(
        private readonly marketViewService: MarketViewService
    ) {}

    @Get('/home')
    @Render('index')
    async getHomePage() {
        return await this.marketViewService.marketSymbolView('BTCUSDT');
    }

    @Get('/about')
    @Render('about')
    getAboutPage() {
        return {};
    }
}
