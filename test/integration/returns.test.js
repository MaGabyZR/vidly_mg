const moment = require('moment');
const request = require('supertest');
const {Rental} = require('../../models/rental');
const {Movie} = require('../../models/movie');
const {User} = require('../../models/user'); 
const mongoose = require('mongoose');

describe('/api/returns', () => {
    let server;
    let customerId;
    let movieId;
    let rental;
    let movie;
    let token;

    //Define a constant execute and send a request to the server. 
    const exec = () => {
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({ customerId, movieId });
    };
      
    beforeEach(async () => { 
        server = require('../../index');

        customerId = new mongoose.Types.ObjectId();
        movieId = new mongoose.Types.ObjectId();
        token = new User().generateAuthToken();

        movie = new Movie({
            _id: movieId,
            title: '12345',
            dailyRentalRate: 2,
            genre: { name: '12345'},
            numberInStock: 10
        });
        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name:'12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2
            }
        });
        await rental.save();                              //Save it to the DB. 
     });

     afterEach(async () => { 
        await server.close();
        await Rental.deleteMany({}); 
    });

    //1. TDD 
    it('should return 401 if client is not logged in', async () => {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);
    });

    //2. TDD 
    it('should return 400 if customerId is not provided.', async () => {
        customerId = '';
        
        const res = await exec();

        expect(res.status).toBe(400);
    });

    //3. TDD 
    it('should return 400 if movieId is not provided.', async () => {
        movieId = '';

        const res = await exec();
        
        expect(res.status).toBe(400);
    });

    //4. TDD
    it('should return 404 if no rental is found for this customer or movie.', async () => {
        await Rental.deleteMany({});

        const res = await exec();

        expect(res.status).toBe(404);
    });

    //5. TDD
    it('should return 400 if the rental has already been processed, the customer already returned the movie.', async () => {
        rental.dateReturned = new Date();
        await rental.save(); 

        const res = await exec();

        expect(res.status).toBe(400);
    });

    //6. TDD
    it('should return 200 if it is a valid request.', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    });

    //7. TDD
    it('should set the return date if input is valid.', async () => {
        const res = await exec();

        const rentalInDB = await Rental.findById(rental._id);
        const difference = new Date() - rentalInDB.dateReturned;
        expect(difference).toBeLessThan(10 * 1000);                         //<10 seconds. 
    });

    //8. TDD
    it('should calculate the rental fee.', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate();     //7days of rental.
        await rental.save();

        const res = await exec();

        const rentalInDB = await Rental.findById(rental._id);
        expect(rentalInDB.rentalFee).toBe(14);                  //the movie was rented for 7 days at USD 2 daily = 14    
    });

    //9. TDD
    it('should increase the stock, when a movie is back.', async () => {
        const res = await exec();

        const movieInDB = await Movie.findById(movieId);
        expect(movieInDB.numberInStock).toBe(movie.numberInStock + 1);                     
    });
});