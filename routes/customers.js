const {Customer, validate} = require('../models/customer');
const mongoose = require('mongoose'); //load mongoose to define the Schema.
const express = require('express'); //load the Express module.
const router = express.Router(); //to call express in this separate module.Here you work with a router object, instead of an app object. 

//Define a route and return all the customers in the db.
router.get('/', async(req, res) => {
    const customers = await Customer.find().sort('name');

    res.send(customers);
  });

  //Define a post request and its path, and create a new customer object and push it on the array.
router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    //Change the object to a the new model, delete the id, as it managed by Mongo. Save the new object to the db.
    let customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
     });
    customer = await customer.save();
    
    res.send(customer);
  });

//To update a customer, add a new route handler.1.Look up the customer and if it doesn´t exist return 404. 
// Validate it or return 400 and if valid update it and return it.
//Use the update first approach, to update documents in Mongo. 
router.put('/:id', async (req, res) => {
    const { error } = validate(req.body); 
      if (error) return res.status(400).send(error.details[0].message);
  
    const customer = await Customer.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
      new: true
    });
      if (!customer) return res.status(404).send('The customer with the given ID was not found.');

      res.send(customer);
    });

//1.look up the customer, if it doesn´t exist return 404.Than delete it and return the same customer.
//Use the findByIdAndRemove method. 
router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
      if (!customer) return res.status(404).send('The customer with the given ID was not found.');

      res.send(customer);
    });

//GET Request. To GET a specific customer, use a route parameter and in this case we use id as the parameter. Use the findById approach.
//And return a 404 error if the course is not find.
router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
      if (!customer) return res.status(404).send('The customer with the given ID was not found.');
      
      res.send(customer);
    });

  module.exports = router; 