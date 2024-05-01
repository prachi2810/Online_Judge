const express=require("express");

const router=express.Router();


const {AddQuestion,GetQuestion,GetAllQuestion,UpdateQuestion,DeleteQuestion}= require("../Controller/QuestionsController");


router.post('/addquestion',AddQuestion,async(req,res,next)=>{

});

router.get('/getquestion/:QuestionId',GetQuestion,async(req,res,next)=>{

});

router.put('/updatequestion/:QuestionId',UpdateQuestion,async(req,res,next)=>{

});

router.delete('/deletequestion/:QuestionId',DeleteQuestion,async(req,res,next)=>{

});

router.get('/getallquestion',GetAllQuestion,async(req,res,next)=>{

});

module.exports=router;