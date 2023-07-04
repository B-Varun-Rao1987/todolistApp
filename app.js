if(process.env.NODE_ENV !="production"){
    require("dotenv").config();
}

const express=require('express');

const mongoose=require('mongoose');

const app=express();

const path=require('path');

const methodOverride=require('method-override');

const Todolist=require('./models/todolist');

const todolist = require('./models/todolist');

const dbUrl=process.env.DB_URL || 3000;
// const dbUrl='mongodb://127.0.0.1:27017/todo-list';

const fs=require("fs");
// const BASE_URL=process.env.BASE_URL;

// const {MongoStore}=require('connect-mongo');

const PORT=process.env.PORT;

const session=require('express-session');
const MongoStore=require('connect-mongo');

// mongodb+srv://our-first-user:<password>@cluster0.r1tflsb.mongodb.net/?retryWrites=true&w=majority
//mongodb://127.0.0.1:27017/todo-list

mongoose.connect(dbUrl);
// mongoose.connect('mongodb://127.0.0.1:27017/todo-list');

mongoose.set('strictQuery', true);

const db=mongoose.connection;

db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database Connected!");
});

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));

app.use(methodOverride('_method'));

app.get('/',(req,res)=>{
    res.send("Hello!!,Welcome to My todolist :)");
})

const store=MongoStore.create({
    mongoUrl:dbUrl,
    touchAfter:24*60*60,
    crypto:{
        secret:'thishouldbetterbesecret'
    }
});

store.on("error",function(e){
    console.log("SESSION STORE ERROR!!",e);
});

const sessionConfig={
    store,
    name:'session',
    secret:'thishouldbetterbesecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}

app.use(session(sessionConfig));

app.get('/todolist',async (req,res)=>{
    const todolists=await Todolist.find({});
    // for(let i=0;i<campgrounds.length;i++)
    //     console.log(campgrounds[i]);
    res.render('index',{todolists});
});

app.get('/todolist/:id/edit',async (req,res)=>{
    const {id}=req.params;
    const todolist=await Todolist.findById(id);
    res.render('edit',{todolist});
});

app.post('/todolist',async (req,res)=>{
    const todolist=new Todolist(req.body.todolist);
    await todolist.save();
    // console.log(req.body);
    res.redirect('/todolist');
})

app.put('/todolist/:id',async (req,res)=>{
    const {id}=req.params;
    console.log("EDIT TASK");
    const campground=await Todolist.findByIdAndUpdate(id,req.body.todolist,{runValidators:true,new:true});
    res.redirect(`/todolist`);
});

app.delete('/todolist/:id',async (req,res)=>{
    const {id}=req.params;
    await Todolist.findByIdAndDelete(id);
    res.redirect('/todolist');
})

app.listen(PORT,()=>{
    console.log(`LISTENING AT PORT ${PORT}!!`);
});
