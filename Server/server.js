// library inports
const express = require('express');
const {mongoose} = require('mongoose');
const {ObjectID} = require('mongodb');
const bodyParser = require('body-parser');
const _ = require('lodash');
// Local imports 
const {Todo} = require('./db/models/todo');
const {User} = require ('./db/models/user');
const {mongoose_config} = require('./db/mongoose-config');
const {authenticate}= require('./middleware/authenticate');
var app = express();
app.use(bodyParser.json());
app.post('/todos',(req,res)=>{
    var newTodo = new Todo({
        text:req.body.text,
        completed:req.body.completed,
        completedAt:req.body.completedAt
    });
newTodo.save().then((newTodoDoc)=>{
    res.send(newTodoDoc);


},(e)=>{
    res.status(400).send(e);
})
});
app.get('/todos',(req,res)=>{
    Todo.find().then((todos)=>{
            res.send({todos});
    },(err)=>{
        res.status(400).send(err)
    });

});

app.get('/todos/:id',(req,res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(400).send('Invalid ID')
    }

    Todo.findById(id).then((todoDoc)=>{
        if(todoDoc){
        res.status(200).send(todoDoc);
        }
        res.status(404).send();
        
    },(err)=>{
        res.status(400).send();
    }).catch((err)=>{
        res.status(400).send();
    });
});

app.delete('/todos/:id',(req,res)=>{
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    };
    Todo.findByIdAndRemove(id).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        };
        res.send(todo);
    },(e)=>{
        res.status(400).send()
    });
});

// Patch Route not working needs refactoring old code //
app.patch('/todos/:id',(req,res)=>{
    var id = req.body.id;
    var body = _.pick(req.body,['text','completed']);
    
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completed=false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({_id:id},{
        $set:body,
        new:true
    }).then((doc)=>{
        if(doc){
            return res.send(doc);
        };

    }).catch((err)=>{
        res.status(400).send(err);
    });
  
});

app.post('/users',(req,res)=>{
    var body =_.pick(req.body,['email','password']);

    var newUser = new User(body);

    newUser.save().then(()=>{
        // res.send(doc);
        return newUser.generateAuthToken();

    }).then((token)=>{
        res.header('x-auth',token).send(newUser);
    }).catch((err)=>{
        res.status(400).header("x-Error-code",err.code).send(err);
    })
});


// private route 

app.get('/users/me',authenticate,(req,res)=>{
   res.send(req.user);
})
// Loging in route

app.post('/users/login',(req,res)=>{
    var body = _.pick(req.body,['email','password']);
    
    User.findByCredentials(body.email,body.password).then((user)=>{
      return  user.generateAuthToken().then((token)=>{
            res.header('x-auth',token).send(user);
        });
        res.send(user);
    }).catch((e)=>{
        res.status(400).send(e);
    })
});
// logout
app.delete('/users/me/token',authenticate,(req,res)=>{
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send();
    },()=>{
        res.status(400).send();
    });

});


app.listen(3000,()=>{
    console.log('Server started on port 3000');
});


module.exports ={app};