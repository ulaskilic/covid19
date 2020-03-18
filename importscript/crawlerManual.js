const mongoose = require('mongoose');
const connectMongo = require('./lib/mongoose');
const worldometer = require('./source/worldometer');


async function run() {
    await connectMongo();
    await worldometer();
}
run();

