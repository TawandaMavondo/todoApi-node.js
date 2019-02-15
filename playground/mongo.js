// const MongoClient = require('mongodb').MongoClient;
// ES6 Object destructuring i.e destructuring the MongoClient Property from the mongodb Object

const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',{useNewUrlParser:true},(err,client)=>{
if(err){
    return console.log("Unable to connect to the database");
}
const db = client.db('TodoApp');
console.log("connected to MongoDB Server ");
// db.collection('todos').insertOne({
//     text:"doing something",
//     completed:false
// },(err,results)=>{
// if(err){
//     return console.log('Unable top insert data');
// }
// console.log(JSON.stringify(results.ops,undefined,2));
// });

db.collection('Users').insertOne({
    name:"Tawa M",
    age:20,
    location:"Marondera Zimbabwe"
},(err,results)=>{
    if(err){
        return console.log("Unable to insert data");
    }
    console.log(JSON.stringify(results.ops[0]._id.getTimestamp(),undefined,2))
})


    client.close();
});
