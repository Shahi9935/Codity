const mongoose= require('mongoose');
 const UserSchema = mongoose.Schema({
name:{
type:String,
required:true
},
username:{
type:String,
required:true
},
spojhandle:{
type:String,
required:false
},
codechefhandle:{
type:String,
required:false
},
codeforceshandle:{
type:String,
required:false
},
password:{
type:String,
required:true
},
following: [{
    type: String,
    required:true
    }]
 });

const User= module.exports= mongoose.model('User',UserSchema);