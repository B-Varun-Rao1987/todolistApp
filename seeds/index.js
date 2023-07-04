const mongoose=require('mongoose');

const Todolist=require('../models/todolist');

const dbURL=process.env.DB_URL;

mongoose.connect(dbURL);

const db=mongoose.connection;

db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database Connected!");
});


const seeDB=async ()=>{
    await Todolist.deleteMany({});
    for(let i=0;i<2;i++){
        const task=new Todolist({
            title:`Task ${i+1}!`
         })
        await task.save();
    } 
}


seeDB().then(()=>{
    mongoose.connection.close();
})