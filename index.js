const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');             //load the express module.
const app = express();                          //by default we store the result in a constant called app, to represent our application. 

require('./startup/logging');                   //load the logging module first, in case you get an error.
require('./startup/routes')(app);               //load the routes module and app. 
require('./startup/db')();                      //load the DB.

//Verify that the environment variable is set when the app starts. Exit the process in case of an error.
if (!config.get('jwtPrivateKey')){
    console.log('FATAL ERROR: jwtPrivateKey is not defined!');
    process.exit(1); 
}

//Add an environment variable, so you can listen to the port dinamically. On the terminal set PORT=5000 
const port = process.env.PORT || 3000;
app.listen(port, () => console.log (`Listening on port ${port}...`));