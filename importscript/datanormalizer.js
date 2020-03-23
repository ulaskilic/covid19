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

const run = async() =>  {
    await connectMongo();
    await checkData();
};

const checkData = async () => {
  const allDatas = await Covid19.find({}).sort({code:1, day:1});
  let prev = null;
  for(const row of allDatas) {
      if(prev) {
          if(prev.code == row.code) {
              if(row.confirmed < prev.confirmed) {
                  console.log(`${row.code} confirmed data is not match ${prev.day} ${row.day} ${prev.confirmed} ${row.confirmed}`)
              }
              if(row.death < prev.death) {
                  console.log(`${row.code} death data is not match ${prev.day} ${row.day} ${prev.death} ${row.death}`)
              }
              if(row.cured < prev.cured) {
                  console.log(`${row.code} cured data is not match ${prev.day} ${row.day} ${prev.cured} ${row.cured}`)
              }
          }

      }
      prev = row;
  }
  console.log(allDatas.length);
  process.exit();
};
run();
