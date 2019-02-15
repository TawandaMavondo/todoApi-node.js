const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    name:"Tawanda Mavondo",
    age:30
}

var token = jwt.sign(data,'salt');
console.log(token);

var decodedData = jwt.verify(token,'salt');
console.log(decodedData);


