const mongoose = require('mongoose');
const connectMongo = require('./lib/mongoose');
const db = mongoose.connection;
const fs = require('fs').promises;
const _ = require('lodash');
const moment = require('moment');
const csvtojson = require('csvtojson');
const apisauce = require('apisauce');

const api = apisauce.create({headers: {}});

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
    isManual: {type: Boolean, default: false},
});
const Covid19 = mongoose.model('Covid19', covid19Schema);

async function run() {
    await connectMongo();
    await importWHOStats()
}

async function importWHOStats() {
    const confirmedsCSV = await api.get("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv");
    const deathsCSV = await api.get("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv");
    const recoveredCSV = await api.get("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv");
    if(!confirmedsCSV.ok || !deathsCSV.ok || !recoveredCSV.ok) {
        console.log(`Request error!`, confirmedsCSV.ok, deathsCSV.ok, recoveredCSV.ok);
        process.exit(0);
    }
    const mapping = await csvtojson({checkType: true}).fromFile('./store/map.csv');
    const confirmeds = await csvtojson({checkType: true}).fromString(confirmedsCSV.data);
    const deaths = await csvtojson({checkType: true}).fromString(deathsCSV.data);
    const cureds = await csvtojson({checkType: true}).fromString(recoveredCSV.data);
    const countries = JSON.parse(await fs.readFile('./store/countries.json'));

    const days = Object.keys(confirmeds[0]).slice(4);


    for(const day of days) {
        const entities = {};
        console.log(`---------------------------------`);
        for(const item of confirmeds) {
            item.country = item['Country/Region'];
            item.state = item['Province/State'];
            const confirmed = item;
            const death = _.find(deaths, {'Province/State': item.state, 'Country/Region': item.country});
            const cured = _.find(cureds, {'Province/State': item.state, 'Country/Region': item.country});
            const manualMapped = _.find(mapping, {who: `${item.country}|${item.state}`});
            if(manualMapped) {
                console.log(`Manual mapped -> ${item.country} - ${item.state}`);
                const country = _.find(countries, {cca2: manualMapped.mappingCountry});
                if(!country) {
                    console.log(`Manuel mapped country not found! ${item.country} - ${item.state}`);
                    continue;
                }
                entities[`${item.state}-${item.country}`] = {
                    timestamp: moment.utc(day, 'M/D/YY').valueOf(),
                    day: moment.utc(day, 'M/D/YY').format('YYYY/MM/DD'),
                    type: 'country',
                    name: country.name.common,
                    code: country.cca2,
                    location: {type: 'Point', coordinates: country.latlng},
                    region: country.region,
                    subRegion: country.subregion,
                    confirmed: confirmed[day],
                    death: death[day],
                    cured: cured[day],
                };
                continue;
            }

            if(!entities.hasOwnProperty(item.country)) {
                const autoMapped = _.find(mapping, {who: item.country});
                if(!autoMapped) {
                    console.log(`Mapping not found! ${item.country}`);
                    continue;
                }
                const country = _.find(countries, {cca2: autoMapped.mappingCountry});
                if(!country) {
                    console.log(`Country code not found! ${item.country}`);
                    continue;
                }
                entities[item.country] = {
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

            entities[item.country].confirmed += confirmed[day] ? confirmed[day] : 0;
            entities[item.country].death += death[day] ? death[day] : 0;
            entities[item.country].cured += cured[day] ? cured[day] : 0;
        }

        for (const entryKey of Object.keys(entities)) {
            await Covid19.updateOne(
                {code: entities[entryKey].code, day: entities[entryKey].day},
                {...entities[entryKey]},
                {upsert: true});
        }
    }
}

run();
