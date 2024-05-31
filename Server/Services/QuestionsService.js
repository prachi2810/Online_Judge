const {QuestionsRepository} =require("../Repository/QuestionsRepo");


class QuestionsService{

    constructor(){
        this.repository=new QuestionsRepository();
    }

    async AddQuestion(req,res,next){
        try{

            const Question=await this.repository.AddQuestion(req,res,next);
            return Question;

        }
        catch(error){
            next(error);
        }

    } 

    async GetQuestion(req,res,next){
        try{

            const Question=await this.repository.GetQuestion(req,res,next);
            return Question;

        }
        catch(error){
            next(error);
        }

    } 

    async GetAllQuestion(req,res,next){
        try{

            const Question=await this.repository.GetAllQuestion(req,res,next);
            return Question;

        }
        catch(error){
            next(error);
        }

    } 

    async UpdateQuestion(req,res,next){
        try{

            const Question=await this.repository.UpdateQuestion(req,res,next);
            return Question;

        }
        catch(error){
            next(error);
        }

    } 

    async DeleteQuestion(req,res,next){
        try{

            const Question=await this.repository.DeleteQuestion(req,res,next);
            return Question;

        }
        catch(error){
            next(error);
        }

    } 

    async CompilerFile(req,res,next){
        try{

            const Question=await this.repository.CompilerFile(req,res,next);
            return Question;

        }
        catch(error){
            next(error);
        }

    } 

    async SubmitCode(req,res,next){

        try{

            const Question=await this.repository.SubmitCode(req,res,next);
            return Question;

        }
        catch(error){
            next(error);
        }

    }

    async GetSubmissionDetails(req,res,next){
        try{

            const Question=await this.repository.GetSubmissionDetails(req,res,next);
            return Question;

        }
        catch(error){
            next(error);
        }

    }

    async GetSubmissionDetailsByQuestion(req, res, next) {
        try{

            const Question=await this.repository.GetSubmissionDetailsByQuestion(req,res,next);
            return Question;

        }
        catch(error){
            next(error);
        }

    }
    async GetAllSubmissionDetails(req, res, next) {
        try{

            const Question=await this.repository.GetAllSubmissionDetails(req,res,next);
            return Question;

        }
        catch(error){
            next(error);
        }

    }





}

module.exports=QuestionsService;