const mongoose= require('mongoose');
 const TodoSchema = mongoose.Schema({
username:{
type:String,
required:true
},
todo: [{
type: String,
required:true
}]
 });

const Todo= module.exports= mongoose.model('Todo',TodoSchema);