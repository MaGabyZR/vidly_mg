require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');           //load mongoose to connect to MongoDB.
const express = require('express');             //load the express module.
const app = express();                          //by default we store the result in a constant called app, to represent our application. 

require('./startup/routes')(app);               //load the routes module. 

/* //Catch errors at a Node level.First approach:
process.on('uncaughtException', (ex) => {
    winston.error(ex.message, ex);
    process.exit(1);
}); */

//Catch errors at a Node level, with winston. A better approach, as it is not manually done.
//Second approach:
winston.exceptions.handle(
    new winston.transports.File({filename: 'uncaughtExceptions.log'})
);

/* //Catch unhandled promise rejections. First approach.
process.on('unhandledRejection', (ex) => {
    winston.error(ex.message, ex);
    process.exit(1);
}); */

//Catch unhandled promise rejections, automated with winston.  
//Second approach:
winston.rejections.handle(
    new winston.transports.File({ filename: 'unhandledRejections.log' })
);

//log messages in the file and in mongoDB
winston.add(new winston.transports.File({ filename: 'logfile.log' }));
winston.add(new winston.transports.MongoDB({ 
    db: 'mongodb://localhost/vidly',
    level: 'error'
 }));


//Verify that the environment variable is set when the app starts. Exit the process in case of an error.
if (!config.get('jwtPrivateKey')){
    console.log('FATAL ERROR: jwtPrivateKey is not defined!');
    process.exit(1); 
}

//connect to MongoDB
mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(() => console.error('Could not connect to MongoDB...'));

//Add an environment variable, so you can listen to the port dinamically. On the terminal set PORT=5000 
const port = process.env.PORT || 3000;
app.listen(port, () => console.log (`Listening on port ${port}...`));