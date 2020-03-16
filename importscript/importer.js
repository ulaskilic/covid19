const mongoose = require('mongoose');
const connectMongo = require('./lib/mongoose');
const db = mongoose.connection;
const fs = require('fs').promises;
const _ = require('lodash');
const moment = require('moment');

const covid19Schema = new mongoose.Schema({
    timestamp: Date,
    day: String,
    type: String,
    name: String,
    code: String,
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    region: String,
    subRegion: String,
    confirmed: Number,
    death: Number,
    cured: Number,
});
const Covid19 = mongoose.model('Covid19', covid19Schema);

async function run() {
    await connectMongo();
    await importPrevious()
}

async function importPrevious() {
    const confirmeds = JSON.parse(await fs.readFile('./confirmed.json'));
    const deaths = JSON.parse(await fs.readFile('./death.json'));
    const cureds = JSON.parse(await fs.readFile('./cured.json'));
    const countries = JSON.parse(await fs.readFile('./countries.json'));
    const mapping = JSON.parse(await fs.readFile('./mapping.json'));

    const days = ['1/22/20', '1/23/20', '1/24/20', '1/25/20', '1/26/20', '1/27/20', '1/28/20', '1/29/20', '1/30/20',
        '1/31/20', '2/1/20', '2/2/20', '2/3/20', '2/4/20', '2/5/20', '2/6/20', '2/7/20', '2/8/20', '2/9/20', '2/10/20',
        '2/11/20', '2/12/20', '2/13/20', '2/14/20', '2/15/20', '2/16/20', '2/17/20', '2/18/20', '2/19/20', '2/20/20',
        '2/21/20', '2/22/20', '2/23/20', '2/24/20', '2/25/20', '2/26/20', '2/27/20', '2/28/20', '2/29/20', '3/1/20',
        '3/2/20', '3/3/20', '3/4/20', '3/5/20', '3/6/20', '3/7/20', '3/8/20', '3/9/20', '3/10/20', '3/11/20', '3/12/20',
        '3/13/20', '3/14/20', '3/15/20'];

    for (const day of days) {
        moment.utc(day, 'M/D/YY').valueOf();
        const entries = {};
        for (const item of confirmeds) {
            const confirmed = item;
            const death = _.find(deaths, {state: item.state, country: item.country});
            const cured = _.find(cureds, {state: item.state, country: item.country});
            if(!entries.hasOwnProperty(confirmed.country)) {
                const mapped = _.find(mapping, {who: item.country});
                if(!mapped) {
                    console.log(`Mapping not found! ${item.country}`);
                    continue;
                }
                const country = _.find(countries, {cca2: mapped.mappingCountry});
                if(!country) {
                    console.log(`Country code not found! ${item.country}`);
                    continue;
                }
                entries[item.country] = {
                    timestamp: moment.utc(day, 'M/D/YY').valueOf(),
                    day: moment.utc(day, 'M/D/YY').format('YYYY/MM/DD'),
                    type: 'country',
                    name: country.name.common,
                    code: country.cca2,
                    location: {type: 'Point', coordinates: country.latlng},
                    region: country.region,
                    subRegion: country.subregion,
                    confirmed: 0,
                    death: 0,
                    cured: 0,
                }
            }
            entries[item.country].confirmed += confirmed[day];
            entries[item.country].death += death[day];
            entries[item.country].cured += cured[day];
        }

        for (const entryKey of Object.keys(entries)) {
            const _covid19 = new Covid19(entries[entryKey]);
            await _covid19.save();
        }
    }
    console.log('done');
}

run();
