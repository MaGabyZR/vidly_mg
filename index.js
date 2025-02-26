const mongoose = require('mongoose'); //load mongoose to connect to MongoDB.
const genres = require('./routes/genres'); //load the genres module.
const customers = require('./routes/customers'); //load the customers module.
const movies = require('./routes/movies');       //load the movies module. 
const express = require('express'); //load the express module
const app = express(); //by default we store the result in a constant called app, to represent our application.

//connect to MongoDB
mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(() => console.error('Could not connect to MongoDB...'));

app.use(express.json());                //to enable parsing of json objects in the body of a post request. 
app.use('/api/genres', genres);         //to use the genres router with Express, and remove all /api/genres route in genres.js
app.use('/api/customers', customers);   //to use the customers router with Express. 
app.use('/api/movies', movies);         //to use the movies router with Express. 

//Add an environment variable, so you can listen to the port dinamically. On the terminal set PORT=5000 
const port = process.env.PORT || 3000;
app.listen(port, () => console.log (`Listening on port ${port}...`));