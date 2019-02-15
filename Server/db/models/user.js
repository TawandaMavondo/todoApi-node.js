const mongoose = require('mongoose');
const  validator = require('validator');
const jwt = require('jsonwebtoken')
const _ = require('lodash');
const bcrypt = require('bcryptjs');
var UserSchema = new mongoose.Schema({
    email:{
        type:String,
        trim:true,
        minlength:1,
        required:true,
        unique:true,
        validate:{
            validator: function(value){
                return validator.isEmail(value);
            },
            message:'{VALUE} is is not an email'
        }
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    tokens:[{
        access:{
            type:String,
            required:true
        },
        token:{
            type:String,
            required:true
        }
    }]
});

UserSchema.methods.toJSON = function(){
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject,['_id','email']);
}

UserSchema.methods.generateAuthToken = function(){
    var user = this;
    var access = "auth"
    var token = jwt.sign({_id:user._id.toHexString(),access},'salt').toString();
    user.tokens.push({access,token});
// user.tokens = user.tokens.concat([access,token]); if the above doesnt work
// returns a promise which is used in the server.js file to set the header x-auth value 
return user.save().then(()=>{
    return token;
}).catch((err)=>{
  return Promise.reject(err);
});

};

UserSchema.methods.removeToken = function(token){
    var user = this;

   return user.updateOne({
        $pull:{
            tokens:{token:token}
        }
    })
}


UserSchema.statics.findByToken = function(token){
    var User = this;
    var decoded;
    try{
        decoded = jwt.verify(token,'salt')
    } catch(e){
        // We can use a short version new Promise.reject()
        return new Promise((resolve,reject)=>{
            reject(e);
        })
    }

    return User.findOne({
        _id:decoded._id,
        'tokens.token':token,
        'tokens.access':"auth"
    });

};

UserSchema.pre('save',function(next){
    var user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                user.password = hash;
                next();
            });
        });
       
    }else{
        next();
    }


});

UserSchema.statics.findByCredentials = function(email,password){
    var User = this;

    return User.findOne({email}).then((user)=> {
        if(!user){
            console.log('err')
        return Promise.reject()
        }
    
        return new Promise((resolve,reject)=>{
            bcrypt.compare(password,user.password,(err,result)=>{
                if(result){
                    resolve(user);
                }else{
                    reject("err");
                }
                
            });
        });
    });

    
}


var User = mongoose.model('Users',UserSchema);
module.exports ={User};