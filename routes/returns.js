const {Rental} = require('../models/rental');
const express = require('express'); //load the Express module.
const router = express.Router();

router.post('/', async (req, res) => {
    if (!req.body.customerId) return res.status(400).send('CustomerId not provided.');
    if (!req.body.movieId) return res.status(400).send('MovieId not provided.');

    const rental = await Rental.findOne({
        'customer._id': req.body.customerId,
        'movie._id': req.body.movieId
    });
    if (!rental) return res.status(404).send('No rental is found for this customer or movie.')


    res.status(401).send('Unauthorized');
});


module.exports = router; 