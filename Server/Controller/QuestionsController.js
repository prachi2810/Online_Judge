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

const SubmitCode=async(req,res,next)=>{
    try{
         const Question=await service.SubmitCode(req,res,next);

         return Question;
    }
    catch(error)
    {
       next(error);
    }
}

const GetSubmissionDetails=async(req,res,next)=>{
    try{
         const Question=await service.GetSubmissionDetails(req,res,next);

         return Question;
    }
    catch(error)
    {
       next(error);
    }
}

const GetSubmissionDetailsByQuestion=async(req,res,next)=>{
    try{
         const Question=await service.GetSubmissionDetailsByQuestion(req,res,next);

         return Question;
    }
    catch(error)
    {
       next(error);
    }
}

const GetAllSubmissionDetails=async(req,res,next)=>{
    try{
         const Question=await service.GetAllSubmissionDetails(req,res,next);

         return Question;
    }
    catch(error)
    {
       next(error);
    }
}

module.exports={AddQuestion,GetQuestion,GetAllQuestion,UpdateQuestion,DeleteQuestion,CompilerFile,SubmitCode,GetSubmissionDetails,
    GetSubmissionDetailsByQuestion,GetAllSubmissionDetails};