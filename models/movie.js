const mongoose = require('mongoose'); //load mongoose to define the Schema.
const Joi = require('joi'); //load de joi module, for input validation, it returns a class.
const {genreSchema} = require('./genre');


//Create a model and define the schema for the movies.
const Movie = mongoose.model('Movies', new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 255
    },
    genre: {
      type: genreSchema,
      require: true 
    },
    numberInStock:{
      type: Number,
      required: true,
      min: 0,
      max: 255
    },
    dailyRentalRate:{
      type: Number,
      required: true,
      min: 0,
      max: 255
    }
  }));

//Function to reuse validation.This is the new updated code for Joi v16.
// The validate() method is now used directly on the schema object, rather than being called as a static method on Joi.
//This is what the client sends us, the input to our API, independent of our mongoose Schema. 
function validateMovie(movie) {
    const schema = Joi.object({
      title: Joi.string().min(5).max(50).required(),
      genreId: Joi.string().required(),
      numberInStock: Joi.number().min(0).required(),
      dailyRentalRate: Joi.number().min(0).required()
    });
  
    return schema.validate(movie); 
  };

exports.Movie = Movie;
exports.validate = validateMovie;