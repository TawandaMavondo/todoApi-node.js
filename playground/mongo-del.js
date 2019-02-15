const {MongoClient,ObjectID} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp',{useNewUrlParser:true},(err,client)=>{
    if(err){
        return console.log("Unable to connect to the database");
    }
    const db = client.db('TodoApp');
    const UsersColection = db.collection('Users');
    console.log("connected to MongoDB Server ");
    // UsersColection.insertOne({
    //     name:"Tawanda M",
    //     age:20,
    //     init:"Computer Science"
    // },(err,res)=>{

    //     if(err){
    //         return console.log('An error Occured')
    //     }
    //     console.log(JSON.stringify(res,undefined,2));

    // })



    UsersColection.deleteMany({name:"Tawanda M"}).then((res)=>{
        console.log(JSON.stringify(res,undefined,2));
    },(err)=>{
        console.log(err);
    })    
    
        client.close();
    });