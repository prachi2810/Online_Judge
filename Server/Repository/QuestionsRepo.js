const Question = require("../Models/QuestionModel");
const { QuestionsSchema } = require("../Helper/ValidationSchema");

const {GenerateFile}=require("../Helper/GenerateFile");
const {ExecuteCpp}=require("../Helper/ExecuteCpp");



class QuestionsRepository {


    async AddQuestion(req, res, next) {

        try {
            // const { Title, Description, Level, TestCase, Constraints } = req.body;

            const UserInputs = await QuestionsSchema.validateAsync(req.body);

            if(!UserInputs){
                return res.status(400).json({message:`${UserInputs}`});
            }
            
            const question = await new Question({
                Title: UserInputs.Title,
                Description: UserInputs.Description,
                Level: UserInputs.Level,
                TestCase: UserInputs.TestCase,
                Constraints: UserInputs.Constraints
            });

            await question.save();
            res.status(201).json({ message: "Question Created!", question });

        }
        catch (error) {
            next(error);
        }

    }

    async GetQuestion(req, res, next) {

        try {
            // const { Title, Description, Level, TestCase, Constraints } = req.body;

            const { QuestionId } = req.params;

            console.log(QuestionId);

            const question = await Question.findOne({ _id: QuestionId });

            if (!question) {
                res.status(404).json({ message: "Question not found" });
            }


            res.status(201).json({ message: "Question Found!", question });

        }
        catch (error) {
            next(error);
        }

    }

    async GetAllQuestion(req, res, next) {

        try {
            // const { Title, Description, Level, TestCase, Constraints } = req.body;

            // if(req.headers.token)

            // const token = req.cookies.token;

            // Check if the token exists
            // if (!token) {
            //     return res.status(401).json({ message: "Unauthorized: No token provided" });
            // }
             
            const questions = await Question.find();

            if (questions.length<=0) {
                res.status(404).json({ message: "Question not found" });
            }


            res.status(201).json({ message: "Question Found!", questions });

        }
        catch (error) {
            next(error);
        }

    }

    async UpdateQuestion(req, res, next) {

        try {
            const { QuestionId } = req.params;

            const UserInputs = await QuestionsSchema.validateAsync(req.body);

            const UpdateQuestion = await Question.findOneAndUpdate({

                _id: QuestionId},
                UserInputs,
                { new: true }
                
                );

            if (!UpdateQuestion) {
                return res.status(404).json({ message: "Question not found" });
            }
            res.status(200).json({ message: "Question updated", UpdateQuestion });
        }
        catch (error) {
            next(error);
        }



    }

    async DeleteQuestion(req,res,next){
        try{

            const {QuestionId}=req.params;

            const question=await Question.findOneAndDelete({_id:QuestionId});

            if(!question){
                return res.status(404).json({message:"Question Not Found!"});
            }

            res.status(200).json({message:"Question Deleted!"});


        }
        catch(error){
            next(error);
        }
    }
    async CompilerFile(req,res,next){
        const {language="cpp",code}=req.body;
           
           if(code==undefined){
            res.status(400).json({message:"Empty code body"});
           }
        try{
           const FilePath=await GenerateFile(language,code);
           const output=await ExecuteCpp(FilePath);
           res.status(200).json({FilePath,output});


        }
        catch(error){
            // res.status(400).json({message:""});
            next(error);
        }
    }



}

module.exports = { QuestionsRepository };