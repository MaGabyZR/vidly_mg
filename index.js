const Joi = require('joi'); //load de joi module, for input validation, it returns a class.
const express = require('express'); //load the express module
const app = express(); //by default we store the result in a constant called app, to represent our application. 

app.use(express.json()); //to enable parsing of json objects in the body of a post request. 

//Define the genres array.
const genres = [
    { id: 1, name: 'Action' },  
    { id: 2, name: 'Horror' },  
    { id: 3, name: 'Romance' },  
  ];

//Define a route.
app.get('/api/genres', (req, res) => {
    res.send(genres);
  });

//Define a post request and its path, and create a new course object and push it on the array.
app.post('/api/genres', (req, res) => {
    const { error } = validateGenre(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    const genre = {
      id: genres.length + 1,
      name: req.body.name
    };
    genres.push(genre);
    res.send(genre);
  });

//To update a genre, add a new route handler.1.Look up the genre and if it doesn´t exist return 404. 
// Validate it or return 400 and if valid update it and return it.
app.put('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  
    const { error } = validateGenre(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    
    genre.name = req.body.name; 
    res.send(genre);
  });
  
//1.look up the genre, if it doesn´t exist return 404.Than delete it and return the same course.
app.delete('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  
    const index = genres.indexOf(genre);
    genres.splice(index, 1);
  
    res.send(genre);
  });
  
//GET Request. To GET a specific genre, use a route parameter and in this case we use id as the parameter. 
//And return a 404 error if the course is not find.
app.get('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
    res.send(genre);
  });

//Function to reuse validation.This is the new updated code for Joi v16.
// The validate() method is now used directly on the schema object, rather than being called as a static method on Joi.
function validateGenre(genre) {
    const schema = Joi.object({
      name: Joi.string().min(3).required(),
    });
  
    return schema.validate(genre); 
  }

//Add an environment variable, so you can listen to the port dinamically. On the terminal set PORT=5000 
const port = process.env.PORT || 3000;
app.listen(port, () => console.log (`Listening on port ${port}...`));