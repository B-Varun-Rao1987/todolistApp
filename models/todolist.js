const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const toDoListSchema=new Schema({title:String});

module.exports=mongoose.model('Todolist',toDoListSchema);