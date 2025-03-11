const bcrypt = require('bcrypt');

async function run(){
    //const salt = await bcrypt.genSalt(10);        //pasted to hash the password in users.js
    //const hashed = await bcrypt.hash('1234', salt);
    console.log(salt);
    console.log(hashed);
}

run();