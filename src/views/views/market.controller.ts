import { Controller, Get, Render } from '@nestjs/common';
import { MarketViewService } from './market-view.service';

@Controller('views')
export class ViewsController {

    constructor(
        private readonly marketViewService: MarketViewService
    ) {}

    @Get('/')
    @Render('home')
    getHomePage() {
        return { message: 'Welcome to the Home Page!' };
    }
}
