const express=require("express");

const router=express.Router();

const {AuthAccessToken}=require('../Middlerware/Auth')
const {AddQuestion,GetQuestion,GetAllQuestion,UpdateQuestion,DeleteQuestion,CompilerFile,SubmitCode,GetSubmissionDetails,GetSubmissionDetailsByQuestion}= require("../Controller/QuestionsController");


router.post('/addquestion',AuthAccessToken,AddQuestion,async(req,res,next)=>{

});

router.get('/getquestion/:QuestionId',AuthAccessToken,GetQuestion,async(req,res,next)=>{

});

router.put('/updatequestion/:QuestionId',AuthAccessToken,UpdateQuestion,async(req,res,next)=>{

});

router.delete('/deletequestion/:QuestionId',AuthAccessToken,DeleteQuestion,async(req,res,next)=>{

});

router.get('/getallquestion',AuthAccessToken,GetAllQuestion,async(req,res,next)=>{

});

router.post('/run',CompilerFile,async(req,res,next)=>{

});

router.post('/submit/:qid',SubmitCode,async(req,res,next)=>{

});

router.get('/getsubmissiondetils/:uid/:qid',GetSubmissionDetails,async(req,res,next)=>{

});

router.get('/getsubmissiondetils/:questionId',GetSubmissionDetailsByQuestion,async(req,res,next)=>{

});

module.exports=router;