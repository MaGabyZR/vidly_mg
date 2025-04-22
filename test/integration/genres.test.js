const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user'); 
const mongoose = require('mongoose');

let server;

describe('/api/genres', () => {
    beforeEach(() => { server = require('../../index'); })
    afterEach(async () => { 
        await server.close();
        await Genre.deleteMany({});
    });

    describe('GET /', () => {               //Get all genres.
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' },
            ]);

            const res = await request(server).get('/api/genres');

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {            //Test routes with parameters.
        it('should return a genre if valid id is passed', async () => {
            const genre = new Genre({ name: 'genre1'});
            await genre.save();

            const res = await request(server).get('/api/genres/' + genre._id);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server).get('/api/genres/1');

            expect(res.status).toBe(404);
        });
    });

    describe( ' POST /', () => {            //Test the route handler for creating a new genre. 

        let token;
        let name; 
        
        const execute = async () => {
            return await request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name });
        }

        beforeEach(() => {                      
            token = new User().generateAuthToken();     //Befor each test, we initialize the token to a valid JWT.
            name = 'genre1';
        })

        it('Should return a 401 if client is not logged in', async () => {
            token = '';             //it is set to an empty string, because in this test we do not have a token. 

            const res = await execute(); 
            
            expect(res.status).toBe(401);
        });

        it('Should return a 400 if genre is less than 5 characters', async () => {          //<5 characters is invalid, as per the schema in genre.js
            name = '1234'; 

            const res = await execute();
            
            expect(res.status).toBe(400);
        });

        it('Should return a 400 if genre is more than 50 characters', async () => {          //>50 characters is invalid, as per the schema in genre.js
            
            name = new Array(52).join('a');                                                 //generate a new array of 51 elements in JS to test. 
            
            const res = await execute();
            
            expect(res.status).toBe(400);
        });

        it('Should save the genre if it is valid', async () => {                        //make sure the valid genre is saved in the db.
            await execute();
            
            const genre = await Genre.find({ name: 'genre1'});                          //query the db.
            expect(genre).not.toBeNull();
        });

        it('Should return the genre if it is valid', async () => {                        //make sure the genre is the body of the response. 
            const res = await execute();
            
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });
});