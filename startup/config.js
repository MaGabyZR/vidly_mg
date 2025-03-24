const config = require('config');

//Verify that the environment variable is set when the app starts. Exit the process in case of an error.
module.exports = function(){
    if (!config.get('jwtPrivateKey')){
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined!');
    } 
}