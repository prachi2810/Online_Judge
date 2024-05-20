const express=require("express");
const router=express.Router();

const {register,login,RefreshToken,ForgotPassword,Logout,VerifyUser} = require("../Controller/LoginController");

const {AuthAccessToken}=require("../Middlerware/Auth");

router.post('/register',register,async(req,res,next)=>{

});

router.post('/login',login,async(req,res,next)=>{

});

router.get('/refresh-token',RefreshToken,async(req,res,next)=>{

});

router.put('/forgot-password',ForgotPassword,async(req,res,next)=>{

});

router.delete('/logout',Logout,async(req,res,next)=>{

});

router.get('/isLoggedIn',VerifyUser,async(req,res,next)=>{

});

module.exports = router;
