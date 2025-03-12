const config = require('config');
const Joi = require('joi');
const mongoose = require('mongoose'); //load mongoose to connect to MongoDB.
const genres = require('./routes/genres'); //load the genres module.
const customers = require('./routes/customers'); //load the customers module.
const rentals = require('./routes/rentals');     //load the rentals module.
const movies = require('./routes/movies');       //load the movies module. 
const users = require('./routes/users');         //load the users module.
const auth = require('./routes/auth');          //load the auth module.
const express = require('express'); //load the express module.
const app = express(); //by default we store the result in a constant called app, to represent our application.

//Verify that the environment variable is set when the app starts. Exit the process in case of an error.
if (!config.get('jwtPrivateKey')){
    console.log('FATAL ERROR: jwtPrivateKey is not defined!');
    process.exit(1); 
}

//connect to MongoDB
mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(() => console.error('Could not connect to MongoDB...'));

app.use(express.json());                //to enable parsing of json objects in the body of a post request. 
app.use('/api/genres', genres);         //to use the genres router with Express, and remove all /api/genres route in genres.js
app.use('/api/customers', customers);   //to use the customers router with Express. 
app.use('/api/movies', movies);         //to use the movies router with Express. 
app.use('/api/rentals', rentals);       //to use the rentals router with Express. 
app.use('/api/users', users);           //to use the users router with Express. 
app.use('/api/auth', auth);             //to use the auth router with Express. 

//Add an environment variable, so you can listen to the port dinamically. On the terminal set PORT=5000 
const port = process.env.PORT || 3000;
app.listen(port, () => console.log (`Listening on port ${port}...`));