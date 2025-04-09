const winston = require('winston');
//require('winston-mongodb');       //commented our for running integration tests.
require('express-async-errors');

module.exports = function () {
    /* //Catch errors at a Node level.First approach:
    process.on('uncaughtException', (ex) => {
        winston.error(ex.message, ex);
        process.exit(1);
    }); */
    
    //Catch errors at a Node level, with winston. A better approach, as it is not manually done.
    //Second approach:
    winston.exceptions.handle(
        new winston.transports.Console({ colorize: true, prettyPrint: true }),
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
    /* winston.add(new winston.transports.MongoDB, { 
        db: 'mongodb://localhost/vidly',
        level: 'info'
     });   */       //Commented out for running integration tests. 
}