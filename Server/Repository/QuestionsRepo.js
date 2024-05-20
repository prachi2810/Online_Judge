const Question = require("../Models/QuestionModel");
const { QuestionsSchema } = require("../Helper/ValidationSchema");

const {GenerateFile}=require("../Helper/GenerateFile");
const {ExecuteCode}=require("../Helper/ExecuteCode");
const {GenerateInputFile}=require("../Helper/GenerateInputFile");
const {ExecuteSubmitCode}=require("../Helper/ExecuteSubmitCode");



class QuestionsRepository {


    async AddQuestion(req, res, next) {

        try {
            // const { Title, Description, Level, TestCase, Constraints } = req.body;

            // const UserInputs = await QuestionsSchema.validateAsync(req.body);
            const UserInputs=req.body;

            if(!UserInputs){
                return res.status(400).json({message:`${UserInputs}`});
            }
            
            const question = await new Question({
                Title: UserInputs.Title,
                Description: UserInputs.Description,
                Level: UserInputs.Level,
                TestCase: UserInputs.TestCase,
                Constraints: UserInputs.Constraints,
                Topic:UserInputs.Topic
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

            const UserInputs = req.body;

            const UpdateQuestion = await Question.findOneAndUpdate({

                _id: QuestionId},
                UserInputs,
                { new: true }
                
                );

            if (!UpdateQuestion) {
                return res.status(404).json({ message: "Question not found" });
            }
            res.status(201).json({ message: "Question updated", UpdateQuestion });
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
       
        try{
            const {language,code,input}=req.body;
            console.log(`Request received - Language: ${language}, Code: ${code}, Input: ${input}`); // Log request

            if(code==undefined){
             res.status(400).json({message:"Empty code body"});
            }
           const FilePath=await GenerateFile(language,code);
           const InputPath=await GenerateInputFile(input);
           const output=await ExecuteCode(language,FilePath,InputPath);
           res.status(200).json({FilePath,output});


        }
        catch(error){
            next(error);
        }
    }

    async SubmitCode(req,res,next){
        try{
            const {qid}=req.params;

            const {language,code}=req.body;

            const question=await Question.findOne({_id:qid});
            const FilePath=await GenerateFile(language,code);
            const output=await ExecuteSubmitCode(FilePath,question.TestCase);
            console.log("Output",output);
            const results = output.map((result, index) => {
                if (result.success) {
                    return `Test case ${index + 1} passed for input: ${result.testcase.Input}`;
                } else {
                    if (result.error) {
                        return `Test case ${index + 1} failed for input: ${result.testcase.Input}. Error: ${result.error}`;
                    } else {
                        return `Test case ${index + 1} failed for input: ${result.testcase.Input}. Expected: ${result.expected}, Got: ${result.result}`;
                    }
                }
            }).join('\n');
    
            res.status(200).send(results);
            
        }
        catch(error){
            next(error);
        }
    }



}

module.exports = { QuestionsRepository };