const {Genre, validate} = require('../models/genre');
const mongoose = require('mongoose'); //load mongoose to define the Schema.
const express = require('express'); //load the Express module.
const router = express.Router(); //to call express in this separate module.Here you work with a router object, instead of an app object. 

//Define a route and return all the genres in the db.
router.get('/', async(req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
  });

//Define a post request and its path, and create a new course object and push it on the array.
//This API endpoint should only be called by an authenticated user, reading the request headers.
router.post('/', async (req, res) => {

  
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  //Change the object to a the new model, delete the id, as it managed by Mongo. Save the new object to the db.
  let genre = new Genre({name: req.body.name });
  genre = await genre.save();
    
  res.send(genre);
  });

//To update a genre, add a new route handler.1.Look up the genre and if it doesn´t exist return 404. 
// Validate it or return 400 and if valid update it and return it.
//Use the update first approach, to update documents in Mongo. 
router.put('/:id', async (req, res) => {
  const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
    new: true
  });
  
    //const genre = genres.find(c => c.id === parseInt(req.params.id)); //Replaced in the findbyidandupdate.
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
    
    //genre.name = req.body.name; ////Replaced in the findbyidandupdate.
    res.send(genre);
  });
  
//1.look up the genre, if it doesn´t exist return 404.Than delete it and return the same course.
//Use the findByIdAndRemove method. 
router.delete('/:id', async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
    // const genre = genres.find(c => c.id === parseInt(req.params.id)); //you don´t need to look a genre in an array anymore. 
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  
    /* const index = genres.indexOf(genre); //this two lines are for working with an array, not a database. 
    genres.splice(index, 1); */
  
    res.send(genre);
  });
  
//GET Request. To GET a specific genre, use a route parameter and in this case we use id as the parameter. Use the findById approach.
//And return a 404 error if the course is not find.
router.get('/:id', async (req, res) => {
  const genre = await Genre.findById(req.params.id);
    //const genre = genres.find(c => c.id === parseInt(req.params.id)); //We do not need it, as this is only for working with arrays, not db.
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
    
    res.send(genre);
  });

module.exports = router; 