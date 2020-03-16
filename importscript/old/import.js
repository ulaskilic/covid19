const testIndexName = 'covid19_test2';
const {Client} = require('@elastic/elasticsearch');
const fs = require('fs').promises;
const _ = require('lodash');
const moment = require('moment');
const apisauce = require('apisauce');
const md5 = require('crypto-js/md5');
const client = new Client({
    node: 'http://localhost:9200',
    auth: {
        username: 'elastic',
        password: 'changeme'
    }
});

const apiClient = apisauce.create({
    baseURL: "https://us1.locationiq.com",
    headers: {
        'Content-Type': 'application/json'
    }
});

const days = ["1/22/20",
    "1/23/20",
    "1/24/20",
    "1/25/20",
    "1/26/20",
    "1/27/20",
    "1/28/20",
    "1/29/20",
    "1/30/20",
    "1/31/20",
    "02/01/2020",
    "02/02/2020",
    "02/03/2020",
    "02/04/2020",
    "02/05/2020",
    "02/06/2020",
    "02/07/2020",
    "02/08/2020",
    "02/09/2020",
    "02/10/2020",
    "02/11/2020",
    "02/12/2020",
    "2/13/20",
    "2/14/20",
    "2/15/20",
    "2/16/20",
    "2/17/20",
    "2/18/20",
    "2/19/20",
    "2/20/20",
    "2/21/20",
    "2/22/20",
    "2/23/20",
    "2/24/20",
    "2/25/20",
    "2/26/20",
    "2/27/20",
    "2/28/20",
    "2/29/20",
    "03/01/2020",
    "03/02/2020",
    "03/03/2020",
    "03/04/2020",
    "03/05/2020",
    "03/06/2020",
    "03/07/2020",
    "03/08/2020",
    "03/09/2020",
    "03/10/2020",
    "03/11/2020",
    "03/12/2020",
    "3/13/20",
    "3/14/20"
];


async function createIndiceIfNotExists() {
    const isExists = await client.indices.exists({index: testIndexName});

    if (!isExists.body) {
        await client.indices.create({index: testIndexName});
        await client.indices.putMapping({
            index: testIndexName,
            body: {
                properties: {
                    // timestamp: timestamp,
                    // type: 'country',
                    // name: countryCode.name.common,
                    // code: countryCode.cca2,
                    // location: {lat: countryCode.latlng[0], lon: countryCode.latlng[1]},
                    // region: countryCode.region,
                    // subregion: countryCode.subregion,
                    // confirmed: 0,
                    // death:0,
                    // cured: 0,
                    timestamp: {type: 'date'},
                    type: {type: 'keyword'},
                    name: {type: 'keyword'},
                    code: {type: 'keyword'},
                    location: {type: 'geo_point'},
                    region: {type: 'keyword'},
                    subregion: {type: 'keyword'},
                    confirmed: {type: 'integer'},
                    death: {type: 'integer'},
                    cured: {type: 'integer'},
                }
            }
        });
    }
}

async function run() {
    await createIndiceIfNotExists();
    const confirmeds = JSON.parse(await fs.readFile('./confirmed.json'));
    const deaths = JSON.parse(await fs.readFile('./death.json'));
    const cureds = JSON.parse(await fs.readFile('./cured.json'));
    const countries = JSON.parse(await fs.readFile('./countries.json'));
    const mapping = JSON.parse(await fs.readFile('./mapping.json'));

    for(const day of days) {
        const timestamp = moment(day, 'M/D/YY').hour(3).toISOString();
        console.log(timestamp);
        const entry = {};
        for (const item of confirmeds) {
            const confirmed = item;
            const death = _.find(deaths, {'state': item.state, country: item.country});
            const cured = _.find(cureds, {'state': item.state, country: item.country});
            if(!entry.hasOwnProperty(item.country)){
                const mapped = _.find(mapping, {who: item.country});
                if(!mapped) {
                    console.log(`Mapping not found! ${item.country}`);
                    continue;
                }
                const countryCode = _.find(countries, {cca2: mapped.mappingCountry});
                if(!countryCode) {
                    console.log(`Country code not found! ${item.country}`);
                    continue;
                }
                entry[item.country] = {
                    timestamp: timestamp,
                    type: 'country',
                    name: countryCode.name.common,
                    code: countryCode.cca2,
                    location: {lat: countryCode.latlng[0], lon: countryCode.latlng[1]},
                    region: countryCode.region,
                    subregion: countryCode.subregion,
                    confirmed: 0,
                    death:0,
                    cured: 0,
                }
            }
            entry[item.country].confirmed += confirmed[day];
            entry[item.country].death += death[day];
            entry[item.country].cured += cured[day];
        }
        const data = [];
        for (const cn of Object.keys(entry)) {
            data.push(entry[cn])
        }
        console.log(`Adding ${day} , entry count ${data.length}`);
        const payload = [];
        data.forEach(item => {
            payload.push({index: {_index: testIndexName}});
            payload.push(item);
        });

        await client.bulk({
            refresh: true,
            body: payload
        });
        console.log(`Added!`);
    }

    // const data = [];
    // for (const item of confirmeds) {
    //     const confirmed = item;
    //     const death = _.find(deaths, {'state': item.state, country: item.country});
    //     const cured = _.find(cureds, {'state': item.state, country: item.country});
    //     const keys = Object.keys(item);
    //     keys.splice(0,4);
    //     for(const key of keys){
    //
    //         const timestamp = moment(key, 'M/D/YY').toISOString();
    //
    //         const obj = {
    //             timestamp: timestamp,
    //             state: confirmed.state,
    //             country: confirmed.country,
    //             location: {lat: confirmed.Lat, lon: confirmed.Long},
    //             confirmed: confirmed[key],
    //             death: death[key],
    //             recovered: cured[key]
    //         };
    //         data.push(obj);
    //     }
    // }
    // console.log("Adding");
    // const payload = data.flatMap(doc => [{index: { _index: testIndexName}}, doc]);
    // console.log("Doc count: " + payload.length);

}

run();
