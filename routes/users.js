const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User, validate} = require('../models/user');
const mongoose = require('mongoose'); //load mongoose to define the Schema.
const express = require('express'); //load the Express module.
const router = express.Router(); //to call express in this separate module.Here you work with a router object, instead of an app object.

//Get information about a currently logged user, get it from the JWT.
//This API endpoint should only be called by an authenticated user, call auth middleware function.
router.get('/me', auth, async(req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
})

//Define a post request and its path, and create a new user. 
router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    //Check if the user is not already registered.
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already exists!'); 


 /* //Save the new user in the database.First approach
    user = new User ({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }); */

    //Second approach to save the new user with lodash, and hash the password.
    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    //save the user
    await user.save();
   
/*  //First approach to limit our response to the user adn return to the client.
    res.send({
        name: user.name,
        email: user.email
    }); */


    //Second approach using lodash to return the user object to the client and return the jwt in a header.Call user.js for the token. 
   const token = user.generateAuthToken();
   res.header('x-auth-token', token).send( _.pick(user, ['_id', 'name', 'email']));
});

  module.exports = router; 