const {Rental, validate} = require('../models/rental');
const {Movie} = require('../models/movie');
const{Customer} = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express'); //load the Express module.
const router = express.Router(); //to call express in this separate module.Here you work with a router object, instead of an app object. 


//Define a route and return all the rentals in the db.
router.get('/', async(req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
  });

//Define a post request and its path, and create a new rental object and push it on the array.
router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    //Verify that the customerId is valid
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid Customer!');

    //Verify that he movieId is valid.
    const movie = await Movie.findById(req.body.movieId);
    if(!movie) return res.status(400).send('Invalid Movie!');

    //Verify if the movie is available.
    if (movie.numberInStock === 0) return res.status(400).send('Movie not available!');
  
    //Create a new rental object. 
    let rental = new Rental({
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate
      }
    }); 

    rental = await rental.save();
    //update the numberInStock and save it.
    movie.numberInStock--;
    movie.save();
    
    res.send(rental);
  
});

//GET Request. To GET a specific rental, use a route parameter and in this case we use id as the parameter. Use the findById approach.
//And return a 404 error if the rental is not found.
router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id);

    if (!rental) return res.status(404).send('The rental with the given ID was not found.');
    
    res.send(rental);
  });

module.exports = router; 