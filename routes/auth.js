const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require ('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User} = require('../models/user');
const mongoose = require('mongoose'); //load mongoose to define the Schema.
const express = require('express'); //load the Express module.
const router = express.Router(); //to call express in this separate module.Here you work with a router object, instead of an app object. 

//Define a post request and its path, and create a new course object and push it on the array.
router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    //Check if the user is not already registered.
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password!');

    //validate the password with BCrypt, first the plain text one in req and than the hashed one in user, this includes the salt.
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password!');

    //Create a JWT and pass the payload, the secret or private key (do not hard code it) call config and return the token to the client.
    const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'));
    res.send(token);
});


//Function to reuse validation.This is the new updated code for Joi v16.
// The validate() method is now used directly on the schema object, rather than being called as a static method on Joi.
function validate(req) {
    const schema = Joi.object({
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required()
    });
  
    return schema.validate(req); 
  };

  module.exports = router;