const mongoose=require('mongoose');

const User=new mongoose.Schema({

    email:{
        type:String,
        required:true,
        unique:true
    },
    Password:{
        type:Password,
        required:true,
        unique:true
    },
    fullname:{
        type:String,

    },
    dob:{
        type:Date,
        required:true
    }

})

module.exports=mongoose.model('User',User);