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

module.exports = {register,login};

// }