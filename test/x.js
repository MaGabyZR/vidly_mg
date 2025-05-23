//Test cases for returning a rental.

// POST /api/returns {customerId, movieId}

//Error scenarios:
    //1. Return 401 if client is not logged in. Testing Authorization. 
    //2. Return 400 if customerId is not provided.
    //3. Return 400 if movieId is not provided.
    //4. Return 404 if no rental is found for this customer or movie.
    //5. Return 400 if the rental has already been processed, the customer already returned the movie.
//Sucess scenarios:
    //6. Return 200 if it is a valid request.
    //7. Set the return date.
    //8. Calculate the rental fee.
    //9. Increase the stock, when a movie is back.
    //10. Finally, return the summary of the rental. 