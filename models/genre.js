const mongoose = require('mongoose'); //load mongoose to define the Schema.
const Joi = require('joi'); //load de joi module, for input validation, it returns a class.

//Create a model and Define the schema for the genres, and put it in a separate schema, to reuse it anywhere.
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
});

const Genre = mongoose.model('Genre', genreSchema);

//Function to reuse validation.This is the new updated code for Joi v16.
// The validate() method is now used directly on the schema object, rather than being called as a static method on Joi.
function validateGenre(genre) {
    const schema = Joi.object({
      name: Joi.string().min(5).max(50).required(),
    });
  
    return schema.validate(genre); 
  };

exports.genreSchema = genreSchema; 
exports.Genre = Genre;
exports.validate = validateGenre;