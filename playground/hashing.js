const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var data = {
    id:10,
    name:"tawa"
};
var password = "tawanda"
var hashval ='$2a$10$rFCR2zgTlCeppzViYDBL.OdAtgIrha20LCn2Y94PYjNumpwPxIlma';
bcrypt.genSalt(10,(err,salt)=>{
bcrypt.hash(password,salt,function(err,hash){
  
})
});

bcrypt.compare(password,hashval,(err,res)=>{
    console.log(res);
})

// var hash = jwt.sign(data,"mavondo");
// console.log('The hash',hash);

// var payload =jwt.verify(hash,"mavondo");
// console.log(payload);