const express=require("express");
const LoginService=require("../Services/LoginService");

const app=express();
const router=express.Router();

// module.exports=()=>{
const service = new LoginService();

const register=async(req,res,next)=>{
    try{
        const register=await service.register(req,res,next);
        console.log(register);
    }
    catch(error){
       next(error);
    }
};

const login=async(req,res,next)=>{
    try{
        const login=await service.login(req,res,next);

        res.status(200).json({ message: "Login Successfully", result: login });
    }
    catch(error){
       next(error);
    }
};

const RefreshToken=async(req,res,next)=>{
    try{
        const token=await service.RefreshToken(req,res,next);

        res.status(200).json({token});
    }
    catch(error){
       next(error);
    }
};

const ForgotPassword=async(req,res,next)=>{
    try{
        const user=await service.ForgotPassword(req,res,next);

        res.status(200).json({user});
    }
    catch(error){
       next(error);
    }
};

const Logout=async(req,res,next)=>{
    try{
        const user=await service.Logout(req,res,next);

        res.status(200).json({message:"Logout Successfully!"});
    }
    catch(error){
       next(error);
    }
};


const VerifyUser=async(req,res,next)=>{
    try{
        const user=await service.VerifyUser(req,res,next);

        res.status(200).json(user);
    }
    catch(error){
       next(error);
    }
};

module.exports = {register,login,RefreshToken,ForgotPassword,Logout,VerifyUser};

// }