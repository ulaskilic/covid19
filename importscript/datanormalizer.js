const mongoose = require('mongoose');
const connectMongo = require('./lib/mongoose');
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

const run = async () => {
    await connectMongo();
    await checkData();
};

const checkData = async () => {
    const allDatas = await Covid19.find({}).sort({code: 1, day: 1});
    let prev = null;
    console.log(`Data inconsistency checking is started`);
    for (const row of allDatas) {
        if (prev) {
            if (prev.code == row.code) {
                if (row.confirmed < prev.confirmed) {
                    console.log(`${row.code} confirmed data is not match ${prev.day} ${row.day} ${prev.confirmed} ${row.confirmed}`)
                }
                if (row.death < prev.death) {
                    console.log(`${row.code} death data is not match ${prev.day} ${row.day} ${prev.death} ${row.death}`)
                }
                if (row.cured < prev.cured) {
                    console.log(`${row.code} cured data is not match ${prev.day} ${row.day} ${prev.cured} ${row.cured}`)
                }
            }

        }
        prev = row;
    }
    console.log(`Data inconsistency checking is ended`);
    console.log(`Missing data checking is started`);
    const totalDay = moment.utc().diff(moment.utc(new Date("2020-01-21")), 'days');
    const groups = _.groupBy(allDatas, 'code');
    for (const groupCode of Object.keys(groups)) {
        const group = groups[groupCode];
        if (group.length !== totalDay) {
            console.log(`${groupCode} data is missing ${group.length}`);
            const example = group[0];
            for (let day = totalDay; day--; day < 1) {
                const formatedDay = moment.utc().subtract(day, 'days').format('YYYY/MM/DD');
                if(!_.find(group, {day: formatedDay})) {
                    const data = new Covid19({
                        timestamp: moment.utc().subtract(day, 'days').valueOf(),
                        day: moment.utc().subtract(day, 'days').format('YYYY/MM/DD'),
                        type: 'country',
                        name: example.name,
                        code: example.code,
                        location: example.location,
                        region: example.region,
                        subRegion: example.subRegion,
                        confirmed: 0,
                        death: 0,
                        cured: 0,
                        isManual: false,
                    });
                    await data.save();
                }
            }
        }
    }
    // for(let day  = totalDay; day--; day < 1) {
    //     console.log(moment.utc().subtract(day, 'days').format('YYYY-MM-DD'));
    // }
    // console.log(totalDay);
    console.log(`Missing data checking is started ended`);

    process.exit();
};
run();
