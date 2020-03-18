import { Controller, Get, Query } from '@nestjs/common';
import { CovidService } from './covid.service';

@Controller('covid')
export class CovidController {
  constructor(private covidService: CovidService) {
  }

  @Get()
  async _total(
    @Query('type') type = 'global',
    @Query('search') search = null): Promise<any> {
    return this.covidService.getDetails(type, search);
  }

  @Get('series')
  async _totalSeries(@Query('type') type = 'global', @Query('search') search = null): Promise<any> {
    return this.covidService.getDetailsTimeSeries(type, search);
  }

}
