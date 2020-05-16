const mongoose = require('mongoose');
const connectMongo = require('./lib/mongoose');
const worldometer = require('./source/worldometerYesterday');


async function run() {
    await connectMongo();
    await worldometer();
}
run();

