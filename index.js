const winston = require('winston');
const express = require('express');             //load the express module.
const app = express();                          //by default we store the result in a constant called app, to represent our application. 

require('./startup/logging')();                   //load the logging module first, in case you get an error.
require('./startup/routes')(app);               //load the routes module and app. 
require('./startup/db')();                      //load the DB.
require('./startup/config')();                  //load the config module.
require('./startup/validation')();              //load the validation module.

//Add an environment variable, so you can listen to the port dinamically. On the terminal set PORT=5000 
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    winston.info(`Listening on port ${port}...`);
    //console.log(`Listening on port ${port}...`); // Fallback in case Winston fails
});

module.exports = server; 