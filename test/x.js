//Test cases for returning a rental.

// POST /api/returns {customerId, movieId}

//Error scenarios:
    //1. Return 401 if client is not logged in. Testing Authorization. 
    //2. Return 400 if customerId is not provided.
    //3. Return 400 if movieId is not provided.
    //4. Return 404 if no rental is found for this customer or movie.
    //Return 400 if the rental has already been processed, the customer already returned the movie.
//Sucess scenarios:
    //Return 200 if it is a velid request.
    //Set the return date.
    //Calculate the rental fee.
    //Increase the stock, when a movie is back.
    //Finally, return the summary of the rental. 