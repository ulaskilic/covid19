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
const worldometer = require('./source/worldometer');


async function run() {
    await connectMongo();
    await crawl()
}
run();

async function crawl() {
    cron.schedule('*/5 * * * *', () => {
        worldometer().then(() => {}).catch(() => {
            console.log(`Something went wrong for worldometer!`);
        })
    })
}
