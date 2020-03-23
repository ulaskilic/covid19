const mongoose = require('mongoose');
const connectMongo = require('../lib/mongoose');
const db = mongoose.connection;
const Crawler = require("crawler");
const fs = require('fs').promises;
const _ = require('lodash');
const moment = require('moment');
const md5 = require('crypto-js/md5');
const c = new Crawler();
const cron = require('node-cron');
const csvtojson = require('csvtojson');

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

const sync = async () => {
    const countries = JSON.parse(await fs.readFile('./store/countries.json'));
    const mapping = await csvtojson({checkType: true}).fromFile('./store/map.csv');

    c.queue([{
        uri: 'https://www.worldometers.info/coronavirus/',
        jQuery: true,
        callback: function (error, res, done) {
            if (error) {
                console.log(error);
            } else {
                console.log(`Crawler triggered`);
                const $ = res.$;
                const list = [];

                $('#main_table_countries_today tbody tr').each(function (index, elem) {
                    const confirmed = isNaN(parseInt($(elem).children('td').eq(1).text().trim().replace(',', ''))) ? 0 :
                        parseInt($(elem).children('td').eq(1).text().trim().replace(',', ''));

                    const death = isNaN(parseInt($(elem).children('td').eq(3).text().trim().replace(',', ''))) ? 0 :
                        parseInt($(elem).children('td').eq(3).text().trim().replace(',', ''));

                    const cured = isNaN(parseInt($(elem).children('td').eq(5).text().trim().replace(',', ''))) ? 0 :
                        parseInt($(elem).children('td').eq(5).text().trim().replace(',', ''));

                    list.push({
                        country: $(elem).children('td').eq(0).text().trim(),
                        confirmed: confirmed,
                        death: death,
                        cured: cured,
                    });
                });
                const finalList = [];

                list.forEach(item => {
                    let mapped = _.find(mapping, {worldometer: item.country});
                    if (!mapped) {
                        console.log(`Mapping not found! ${item.country}`);
                        return;
                    }
                    const countryCode = _.find(countries, {cca2: mapped.mappingCountry});
                    if (!countryCode) {
                        console.log(`Country code not found! ${item.country}`);
                        return;
                    }

                    const obj = {
                        timestamp: moment.utc().valueOf(),
                        day: moment.utc().format('YYYY/MM/DD'),
                        type: 'country',
                        name: countryCode.name.common,
                        code: countryCode.cca2,
                        location: {type: 'Point', coordinates: countryCode.latlng},
                        region: countryCode.region,
                        subRegion: countryCode.subregion,
                        confirmed: item.confirmed,
                        death: item.death,
                        cured: item.cured,
                    };
                    finalList.push(obj);
                });

                new Promise(async (resolve) => {
                    console.log(`Crawler saving data. Data size: ${finalList.length}`);
                    for (const item of finalList) {
                        const find = await Covid19.findOne({code: item.code, day: item.day});
                        if (find) {
                            // Baş koymuşum türkiyemin yoluna :]
                            if (!find.isManual) {
                                find.confirmed = item.confirmed;
                                find.death = item.death;
                                find.cured = item.cured
                            }
                            find.timestamp = item.timestamp;
                            await find.save();
                        } else {
                            const newItem = new Covid19(item);
                            await newItem.save();
                        }

                        // If values lower than old, update old
                        await Covid19.updateMany({code: item.code, confirmed: {$gte: item.confirmed}},
                            {
                                $set: {
                                    confirmed: item.confirmed,
                                }
                            });
                        await Covid19.updateMany({code: item.code, death: {$gte: item.death}},
                            {
                                $set: {
                                    death: item.death,
                                }
                            });
                        await Covid19.updateMany({code: item.code, cured: {$gte: item.cured}},
                            {
                                $set: {
                                    cured: item.cured,
                                }
                            });

                    }
                    resolve();
                }).then(() => {
                    console.log(`Crawler finished`);
                    done();
                });
            }
        }
    }]);
}

module.exports = sync
