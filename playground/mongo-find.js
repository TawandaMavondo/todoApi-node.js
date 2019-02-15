// const MongoClient = require('mongodb').MongoClient;
// ES6 Object destructuring i.e destructuring the MongoClient Property from the mongodb Object
const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',{useNewUrlParser:true},(err,client)=>{
if(err){
    return console.log("Unable to connect to the database");
}
const db = client.db('TodoApp');
const UsersColection = db.collection('Users');
console.log("connected to MongoDB Server ");

UsersColection.find().toArray().then((docs)=>{
console.log(JSON.stringify(docs,undefined,2));
},(err)=>{
console.log("Unable to fetch Data from the Database",err);
});


    client.close();
});
