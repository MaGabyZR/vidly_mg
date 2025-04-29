const moment = require('moment');
const mongoose = require('mongoose'); //load mongoose to define the Schema.
const Joi = require('joi'); //load de joi module, for input validation, it returns a class.

//Create a model and Define the schema for the rentals, and put it in a separate schema. Only use the properties needed for the rentals and
// not all properties included in the customer and movie module. This why you create a new customer and movie schema here. 
const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
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
    }),
    required: true
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        minlength: 0,
        maxlength: 255
      }
    }),
    required: true
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0
  }
});
//add a new static method to it. 
rentalSchema.statics.lookup = function(customerId, movieId) {
  return this.findOne({                                                   //Refactored for the static method Rental.lookup() in returns.js 
    'customer._id': customerId,
    'movie._id': movieId
  }); 
}

//add a new instance method to handle the state of the rental object.
rentalSchema.methods.return = function() {
  this.dateReturned = new Date();

  const rentalDays = moment().diff(this.dateOut, 'days');
  this.rentalFee = rentalDays * this.movie.dailyRentalRate;
}

const Rental = mongoose.model('Rental', rentalSchema);

//Function to reuse validation.This is the new updated code for Joi v16.
// The validate() method is now used directly on the schema object, rather than being called as a static method on Joi.
//This are the values the customer sends to the server.
function validateRental(rental) {
    const schema = Joi.object({
      customerId: Joi.string().required(),
      movieId: Joi.string().required()
    });
  
    return schema.validate(rental); 
  };

exports.rentalSchema = rentalSchema; 
exports.Rental = Rental;
exports.validate = validateRental;