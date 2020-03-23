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
const createCsvWriter = require('csv-writer').createArrayCsvWriter;

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
    await generateReport();
};

const generateReport = async () => {
    const allDatas = await Covid19.find({}).sort({code: 1, day: 1});
    const today = moment.utc().format('YYYY/MM/DD');
    console.log(`Report is started`);
    async function countryReport() {
        const groups = _.groupBy(allDatas, 'code');
        for (const groupCode of Object.keys(groups)) {
            const group = groups[groupCode];
            const csvWriter = createCsvWriter({
                header: ['day', 'countryCode', 'countryName', 'lat', 'lon', 'confirmed', 'cured', 'death'],
                path: `/root/covid19-timeseries/report/country/${groupCode}.csv`
            });
            const records = [];
            for (const row of group) {
                if(row.day === today)
                    continue;
                records.push([row.day, row.code, row.name,
                    row.location.coordinates[0], row.location.coordinates[1],
                    row.confirmed, row.death, row.cured]);
            }
            await csvWriter.writeRecords(records);
        }
        console.log(`Country report exported`)
    }

    async function dailyReport() {
        const days = _.groupBy(allDatas, 'day');
        for (const dayKey of Object.keys(days)) {
            const day = days[dayKey];
            const csvWriter = createCsvWriter({
                header: ['day', 'countryCode', 'countryName', 'lat', 'lon', 'confirmed', 'cured', 'death'],
                path: `/root/covid19-timeseries/report/daily/${dayKey.replace(/\//gi,'-')}.csv`
            });
            if(dayKey === today)
                continue;
            const records = [];
            for (const row of day) {
                if(row.day === today)
                    continue;
                records.push([row.day, row.code, row.name,
                    row.location.coordinates[0], row.location.coordinates[1],
                    row.confirmed, row.death, row.cured]);
            }
            await csvWriter.writeRecords(records);
        }
        console.log(`Daily report exported`)
    }

    async function rawReport() {
        const csvWriter = createCsvWriter({
            header: ['day', 'countryCode', 'countryName', 'lat', 'lon', 'confirmed', 'cured', 'death'],
            path: `/root/covid19-timeseries/report/raw/rawReport.csv`
        });
        const records = [];
        for (const row of allDatas) {
            if(row.day === today)
                continue;
            records.push([row.day, row.code, row.name,
                row.location.coordinates[0], row.location.coordinates[1],
                row.confirmed, row.death, row.cured]);
        }
        await csvWriter.writeRecords(records);
        console.log(`Raw report exported`)
    }

    await countryReport();
    await dailyReport();
    await rawReport();

    console.log(`Report is ended`);
    process.exit();
};
run();
