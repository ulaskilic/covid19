import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as moment from 'moment';

@Injectable()
export class CovidService {
  constructor(@InjectModel('Covid19') private covidModel: Model<any>) {
  }

  async getDetails(type: string, country: string = null): Promise<any> {
    const date = moment.utc(await this.getLatestDate());
    const aggregationQuery = this.prepareAggregation(type, country, [
      date.format('YYYY/MM/DD')]);
    const data = await this.covidModel.aggregate(aggregationQuery);
    return data.length == 1 ? data[0] : data;
  }

  async getDetailsTimeSeries(type: string, country: string = null): Promise<any> {
    const aggregationQuery = this.prepareAggregation(type, country, []);
    const data = await this.covidModel.aggregate(aggregationQuery);
    return data.length == 1 ? data[0] : data;
  }

  private async getLatestDate() {
    return this.covidModel.findOne({}, { day: 1 }).sort({ day: -1 });
  }

  private prepareAggregation(type: string, search: string, days: string[]): object {
    const aggregationQuery = [];
    let groupQuery: object = {};
    let searchField: string = null;
    switch (type) {
      case 'global':
        groupQuery = {
          '_id': { 'day': '$day' },
          'day': { '$first': '$day' },
          'lastUpdated': { '$first': '$timestamp' },
          'confirmed': { '$sum': '$confirmed' },
          'death': { '$sum': '$death' },
          'cured': { '$sum': '$cured' },
        };
        searchField = null;
        break;
      case 'region':
        groupQuery = {
          '_id': { 'day': '$day', 'region': '$region' },
          'region': { '$first': '$region' },
          'day': { '$first': '$day' },
          'lastUpdated': { '$first': '$timestamp' },
          'confirmed': { '$sum': '$confirmed' },
          'death': { '$sum': '$death' },
          'cured': { '$sum': '$cured' },
        };
        searchField = 'region';
        break;
      case 'country':
        groupQuery = {
          '_id': { 'day': '$day', 'name': '$name' },
          'country': { '$first': '$name' },
          'region': { '$first': '$region' },
          'subRegion': { '$first': '$subRegion' },
          'code': { '$first': '$code' },
          'day': { '$first': '$day' },
          'lastUpdated': { '$first': '$timestamp' },
          'confirmed': { '$sum': '$confirmed' },
          'death': { '$sum': '$death' },
          'cured': { '$sum': '$cured' },
          'location': {'$first': '$location'}
        };
        searchField = 'name';
        break;
      default:
        throw new BadRequestException('Type is not valid. Type should be: global, region, country');
    }
    if (days.length) {
      aggregationQuery.push({ $match: { day: { $in: [...days] } } });
    }
    if (search && searchField) {
      aggregationQuery.push({ '$match': { [searchField]: search } });
    }
    aggregationQuery.push({ '$group': groupQuery });
    aggregationQuery.push({
      '$addFields': {
        active: { $subtract: ['$confirmed', { $add: ['$death', '$cured'] }] },
      },
    });
    aggregationQuery.push({ '$sort': { 'day': 1, 'region': 1, 'country': 1 } });

    return aggregationQuery;
  }

}
