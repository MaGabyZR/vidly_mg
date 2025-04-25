const express = require('express');                //load the express module.
const genres = require('../routes/genres');        //load the genres module.
const customers = require('../routes/customers'); //load the customers module.
const rentals = require('../routes/rentals');     //load the rentals module.
const movies = require('../routes/movies');       //load the movies module. 
const users = require('../routes/users');         //load the users module.
const auth = require('../routes/auth');          //load the auth module.
const returns = require('../routes/returns');    // load the returns module. 
const error = require('../middleware/error');


module.exports = function(app){
    app.use(express.json());                //to enable parsing of json objects in the body of a post request. 
    app.use('/api/genres', genres);         //to use the genres router with Express, and remove all /api/genres route in genres.js
    app.use('/api/customers', customers);   //to use the customers router with Express. 
    app.use('/api/movies', movies);         //to use the movies router with Express. 
    app.use('/api/rentals', rentals);       //to use the rentals router with Express. 
    app.use('/api/users', users);           //to use the users router with Express. 
    app.use('/api/auth', auth);             //to use the auth router with Express. 
    app.use('/api/returns', returns);       //to use the returns router with Express. 
    app.use(error);                         //Handle all the errors in the app, with this error handling middleware function.
};