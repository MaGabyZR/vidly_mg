const Joi = require('joi');
const validate = require('../middleware/validate');
const {Rental} = require('../models/rental');
const {Movie} = require('../models/movie');
const auth = require('../middleware/auth');
const express = require('express'); //load the Express module.
const router = express.Router();


router.post('/', [auth, validate(validateReturn)], async (req, res) => {                                       //You pass an array [] of middleware functions.
    /* if (!req.body.customerId) return res.status(400).send('CustomerId not provided.');                      //Replaced by Joi validation and moved into a middleware validator function to make it dynamic, in validate.js
    if (!req.body.movieId) return res.status(400).send('MovieId not provided.'); */
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);                                //New static method on the rental.js class.

    if (!rental) return res.status(404).send('No rental is found for this customer or movie.');

    if (rental.dateReturned) return res.status(400).send('Rental has already been processed, the customer already returned the movie.');

    rental.return();                                                                                           //Refactored in the instance method to handle the state of the rental object, in rental.js
    await rental.save();

    await Movie.updateMany({ _id: rental.movie._id }, {
        $inc: { numberInStock: 1 }
    });

    return res.send(rental);
});

//Function to reuse validation.This is the new updated code for Joi v16.
// The validate() method is now used directly on the schema object, rather than being called as a static method on Joi.
function validateReturn(req) {
    const schema = Joi.object({
      customerId: Joi.objectId().required(),
      movieId: Joi.objectId().required()
    });
  
    return schema.validate(req); 
  };

module.exports = router; 