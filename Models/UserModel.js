const mongoose=require('mongoose');

const User=new mongoose.Schema({
    fullname:{
        type:String,

    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    },
    dob:{
        type:Date,
        required:true
    }

})

module.exports=mongoose.model('User',User);