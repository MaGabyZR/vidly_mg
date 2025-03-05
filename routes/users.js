const {User, validate} = require('../models/user');
const mongoose = require('mongoose'); //load mongoose to define the Schema.
const express = require('express'); //load the Express module.
const router = express.Router(); //to call express in this separate module.Here you work with a router object, instead of an app object. 

//Define a post request and its path, and create a new course object and push it on the array.
router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    //Check if the user is not already registered.
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already exists!');

    //Save the new user in the database.
    user = new User ({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    await user.save();
    
    res.send(user);
  });

  module.exports = router; 