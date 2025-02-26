const {Movie, validate} = require('../models/movie');
const {Genre} = require('../models/genre'); 
const mongoose = require('mongoose'); //load mongoose to connect to MongoDB.
const express = require('express'); //load the Express module.
const router = express.Router(); //to call express in this separate module.Here you work with a router object, instead of an app object. 

//Define a route and return all the movies in the db.
router.get('/', async(req, res) => {
    const movies = await Movie.find().sort('name');
    res.send(movies);
  });

//Define a post request and its path, and create a new course object and push it on the array, => create a new movie.
router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    //to asure that the genreId that the client sends, represents a valid Genre. 
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre...');
  
    //Change the object to a the new model, delete the id, as it managed by Mongo. Save the new object to the db.=>create a movie object.
    let movie = new Movie({
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    });
    movie = await movie.save();
  })

//To update a movie, add a new route handler.1.Look up the movie and if it doesn´t exist return 404. 
// Validate it or return 400 and if valid update it and return it.
//Use the update first approach, to update documents in Mongo. 
router.put('/:id', async (req, res) => {
  const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movie.findByIdAndUpdate(req.params.id, { title: req.body.name }, {
    new: true
  });
  
    if (!movie) return res.status(404).send('The movie with the given ID was not found.');
    res.send(movie);
  });
  
//1.look up the movie, if it doesn´t exist return 404.Than delete it and return the same movie.
//Use the findByIdAndRemove method. 
router.delete('/:id', async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);
    if (!movie) return res.status(404).send('The movie with the given ID was not found.');
  
    res.send(movie);
  });
  
//GET Request. To GET a specific movie, use a route parameter and in this case we use id as the parameter. Use the findById approach.
//And return a 404 error if the course is not find.
router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send('The movie with the given ID was not found.');
    
    res.send(movie);
  });

module.exports = router; 