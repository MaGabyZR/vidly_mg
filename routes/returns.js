const express = require('express'); //load the Express module.
const router = express.Router();

router.post('/', async (req, res) => {
    if (!req.body.customerId) return res.status(400).send('CustomerId not provided.');

    res.status(401).send('Unauthorized');
});


module.exports = router; 