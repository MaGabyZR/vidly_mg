const mongoose = require('mongoose'); //load mongoose to define the Schema.
const Joi = require('joi'); //load de joi module, for input validation, it returns a class.


//Create a model and Define the schema for the customers.
const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
  },
    isGold: {
        type: Boolean,
        default: false
  },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
  } 

}));

//Function to reuse validation.This is the new updated code for Joi v16.
// The validate() method is now used directly on the schema object, rather than being called as a static method on Joi.
function validateCustomer(customer) {
    const schema = Joi.object({
      name: Joi.string().min(5).max(50).required(),
      phone: Joi.string().min(5).max(50).required(),
      isGold: Joi.boolean()
    });
  
    return schema.validate(customer); 
  }

exports.Customer = Customer;
exports.validate = validateCustomer; 
