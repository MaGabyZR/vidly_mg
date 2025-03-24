const mongoose = require('mongoose');           //load mongoose to connect to MongoDB.
const winston = require('winston');

//connect to MongoDB
module.exports = function(){
    mongoose.connect('mongodb://localhost/vidly')
    .then(() => winston.info('Connected to MongoDB...'))
    .catch(err => winston.error('Could not connect to MongoDB...', err));
}