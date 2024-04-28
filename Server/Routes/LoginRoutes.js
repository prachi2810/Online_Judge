const express=require("express");
const router=express.Router();

const {register,login,RefreshToken} = require("../Controller/LoginController");

const {AuthAccessToken}=require("../Middlerware/Auth");

router.post('/register',register,async(req,res,next)=>{

});

router.post('/login',login,async(req,res,next)=>{

});

router.post('/refresh-token',RefreshToken,async(req,res,next)=>{

});

module.exports = router;
