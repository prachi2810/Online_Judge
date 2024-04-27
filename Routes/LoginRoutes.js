const express=require("express");
const router=express.Router();

const {register,login} = require("../Controller/LoginController");

router.post('/register',register,async(req,res,next)=>{

});

router.post('/login',login,async(req,res,next)=>{

});

module.exports = router;
