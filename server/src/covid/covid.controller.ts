import { Controller, Get } from '@nestjs/common';
import { CovidService } from './covid.service';

@Controller('covid')
export class CovidController {
  constructor(private covidService: CovidService) {
  }

  @Get('countryList')
  async latestCountryList(): Promise<any> {
    return this.covidService.latestCountryList();
  }

  @Get('total')
  async total(): Promise<any> {
    return this.covidService.total();
  }

  @Get('totalTimeSeries')
  async totalTimeSeries(): Promise<any> {
    return this.covidService.totalTimeSeries();
  }

  @Get('totalRegion')
  async totalRegion(): Promise<any> {
    return this.covidService.totalRegion();
  }

  @Get('totalRegionTimeSeries')
  async totalRegionTimeSeries(): Promise<any> {
    return this.covidService.totalRegionTimeSeries();
  }

}
