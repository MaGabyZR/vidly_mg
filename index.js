const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');             //load the express module.
const app = express();                          //by default we store the result in a constant called app, to represent our application. 

require('./startup/logging');                   //load the logging module first, in case you get an error.
require('./startup/routes')(app);               //load the routes module and app. 
require('./startup/db')();                      //load the DB.
require('./startup/config')();                    //load the config module.

//Add an environment variable, so you can listen to the port dinamically. On the terminal set PORT=5000 
const port = process.env.PORT || 3000;
app.listen(port, () => console.log (`Listening on port ${port}...`));