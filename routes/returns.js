const moment = require('moment');
const {Rental} = require('../models/rental');
const auth = require('../middleware/auth');
const express = require('express'); //load the Express module.
const router = express.Router();

router.post('/', auth, async (req, res) => {
    if (!req.body.customerId) return res.status(400).send('CustomerId not provided.');
    if (!req.body.movieId) return res.status(400).send('MovieId not provided.');

    const rental = await Rental.findOne({
        'customer._id': req.body.customerId,
        'movie._id': req.body.movieId
    });
    if (!rental) return res.status(404).send('No rental is found for this customer or movie.');

    if (rental.dateReturned) return res.status(400).send('Rental has already been processed, the customer already returned the movie.');

    rental.dateReturned = new Date();

    const rentalDays = moment().diff(rental.dateOut, 'days');
    rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;

    await rental.save();

    return res.status(200).send();
});


module.exports = router; 