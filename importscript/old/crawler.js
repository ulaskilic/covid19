const testIndexName = 'covid19_test2';
const Crawler = require("crawler");
const {Client} = require('@elastic/elasticsearch');
const fs = require('fs').promises;
const _ = require('lodash');
const moment = require('moment');
const md5 = require('crypto-js/md5');
const c = new Crawler();

const client = new Client({
    node: 'http://localhost:9200',
    auth: {
        username: 'elastic',
        password: 'changeme'
    }
});

async function run() {

    const countries = JSON.parse(await fs.readFile('./countries.json'));
    const mapping = JSON.parse(await fs.readFile('./mapping.json'));

    c.queue([{
        uri: 'https://www.worldometers.info/coronavirus/',
        jQuery: true,

        callback: function (error, res, done) {
            if (error) {
                console.log(error);
            } else {
                const $ = res.$;
                const list = [];

                $('#main_table_countries tbody tr').each(function (index, elem) {
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
                    if(!mapped) {
                        console.log(`Mapping not found! ${item.country}`);
                        return;
                    }
                    const countryCode = _.find(countries, {cca2: mapped.mappingCountry});
                    if(!countryCode) {
                        console.log(`Country code not found! ${item.country}`);
                        return;
                    }
                    const timestamp = moment.utc();
                    const obj = {
                        timestamp: timestamp,
                        type: 'country',
                        name: countryCode.name.common,
                        code: countryCode.cca2,
                        location: {lat: countryCode.latlng[0], lon: countryCode.latlng[1]},
                        region: countryCode.region,
                        subregion: countryCode.subregion,
                        confirmed: item.confirmed,
                        death: item.death,
                        cured: item.cured,
                    };
                    finalList.push(obj);
                });

                new Promise(async (resolve) => {
                    const body = finalList.flatMap(doc => [{ index: { _index: 'covid19_test2' } }, doc])
                    await client.bulk({
                        refresh: true,
                        body: body
                    });
                    resolve();
                }).then(() => {
                    done();
                })
            }
        }
    }]);
}

run();
