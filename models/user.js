const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose'); //load mongoose to define the Schema.
const Joi = require('joi'); //load de joi module, for input validation, it returns a class.

//Define the schema for the users.
const userSchema = new mongoose.Schema({
  name: {
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
    },
  isAdmin: Boolean
});
//Add a method to encapsulate the logic to generate a jwt. Add the isAdmin property to the payload.
userSchema.methods.generateAuthToken = function(){
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
  return token;
}

//Create a model.
const User = mongoose.model('User', userSchema);

//Function to reuse validation.This is the new updated code for Joi v16.
// The validate() method is now used directly on the schema object, rather than being called as a static method on Joi.
function validateUser(user) {
    const schema = Joi.object({
      name: Joi.string().min(5).max(50).required(),
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required()
    });
  
    return schema.validate(user); 
  };

exports.User = User;
exports.validate = validateUser;