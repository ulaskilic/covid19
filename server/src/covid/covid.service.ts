import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as moment from 'moment';

@Injectable()
export class CovidService {
  constructor(@InjectModel('Covid19') private covidModel: Model<any>) {
  }

  async latestCountryList(): Promise<any> {
    return this.covidModel.find({'day': moment.utc().format('YYYY/MM/DD')})
  }
  async total() {
    return this.covidModel.aggregate([
      {
        '$match': {
          'day': moment.utc().format('YYYY/MM/DD'),
        },
      },
      {
        '$group': {
          '_id': {
            'day': '$day',
          },
          'lastUpdated': {
            '$first': '$timestamp'
          },
          'totalConfirmed': {
            '$sum': '$confirmed',
          },
          'totalDeath': {
            '$sum': '$death',
          },
          'totalRecovered': {
            '$sum': '$cured',
          },
        },
      },
    ]).exec();
  }

  async totalTimeSeries(): Promise<any> {
    return this.covidModel.aggregate([
      {
        '$group': {
          '_id': {
            'day': '$day'
          },
          'totalConfirmed': {
            '$sum': '$confirmed'
          },
          'totalDeath': {
            '$sum': '$death'
          },
          'totalRecovered': {
            '$sum': '$cured'
          },
          'lastUpdated': {
            '$first': '$timestamp'
          },
          'day': {
            '$first': '$day'
          }
        }
      }, {
        '$sort': {
          'day': 1
        }
      }
    ]);
  }

  async totalRegion() {
    return this.covidModel.aggregate([
      {
        '$match': {
          'day': moment.utc().format('YYYY/MM/DD'),
        },
      },
      {
        '$group': {
          '_id': {
            'day': '$day', 'region': '$region',
          },
          'lastUpdated': {
            '$first': '$timestamp'
          },
          'region': {'$first': '$region'},
          'totalConfirmed': {
            '$sum': '$confirmed',
          },
          'totalDeath': {
            '$sum': '$death',
          },
          'totalRecovered': {
            '$sum': '$cured',
          },
        },
      },
      {
        '$sort': {
          'region': 1
        }
      }
    ]).exec();
  }

  async totalRegionTimeSeries(): Promise<any> {
    return this.covidModel.aggregate([
      {
        '$group': {
          '_id': {
            'day': '$day',
            'region': '$region'
          },
          'totalConfirmed': {
            '$sum': '$confirmed'
          },
          'totalDeath': {
            '$sum': '$death'
          },
          'totalRecovered': {
            '$sum': '$cured'
          },
          'lastUpdated': {
            '$first': '$timestamp'
          },
          'region': {
            '$first': '$region'
          },
          'day': {
            '$first': '$day'
          }
        }
      }, {
        '$sort': {
          'day': 1,
          'region': 1,
        }
      }
    ]);
  }

}
