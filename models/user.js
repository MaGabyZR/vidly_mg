const mongoose = require('mongoose'); //load mongoose to define the Schema.
const Joi = require('joi'); //load de joi module, for input validation, it returns a class.

//Create a model and Define the schema for the users, while calling the model method. In this case we do not need to define it as a separate constant.
const User = mongoose.model('User', new mongoose.Schema({
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true 
      },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
      }
  })
);

//Function to reuse validation.This is the new updated code for Joi v16.
// The validate() method is now used directly on the schema object, rather than being called as a static method on Joi.
function validateUser(user) {
    const schema = Joi.object({
      name: Joi.string().min(5).max(50).required(),
      name: Joi.string().min(5).max(255).required().email(),
      name: Joi.string().min(5).max(255).required()
    });
  
    return schema.validate(user, schema); 
  };

exports.User = User;
exports.validate = validateUser;