const mongoose = require('mongoose');           //load mongoose to connect to MongoDB.
const winston = require('winston');
const config = require('config');

//connect to MongoDB
module.exports = function(){
    const db = config.get('db');
    mongoose.connect(db)
    //.then(() => winston.info(`Connected to ${db}...`))
    .then (console.log(`Connected to ${db}...`));
}