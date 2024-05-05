const express=require("express");
const QuestionsService=require("../Services/QuestionsService");


const service=new QuestionsService();


const AddQuestion=async(req,res,next)=>{
    try{
         const Question=await service.AddQuestion(req,res,next);

         return Question;
    }
    catch(error)
    {
       next(error);
    }
}

const GetQuestion=async(req,res,next)=>{
    try{
         const Question=await service.GetQuestion(req,res,next);

         return Question;
    }
    catch(error)
    {
       next(error);
    }
}

const GetAllQuestion=async(req,res,next)=>{
    try{
         const Question=await service.GetAllQuestion(req,res,next);

         return Question;
    }
    catch(error)
    {
       next(error);
    }
}

const UpdateQuestion=async(req,res,next)=>{
    try{
         const Question=await service.UpdateQuestion(req,res,next);

         return Question;
    }
    catch(error)
    {
       next(error);
    }
}

const DeleteQuestion=async(req,res,next)=>{
    try{
         const Question=await service.DeleteQuestion(req,res,next);

         return Question;
    }
    catch(error)
    {
       next(error);
    }
} 

const CompilerFile=async(req,res,next)=>{
    try{
         const Question=await service.CompilerFile(req,res,next);

         return Question;
    }
    catch(error)
    {
       next(error);
    }
}

module.exports={AddQuestion,GetQuestion,GetAllQuestion,UpdateQuestion,DeleteQuestion,CompilerFile};