//This error handling middleware works only for handling errors in Express. Outside, you have to handle them, as donde in index.js 

const winston = require('winston');

module.exports = function( err, req, res, next ){
    winston.error(err.message, err);
    res.status(500).send('Something went wrong...');
}