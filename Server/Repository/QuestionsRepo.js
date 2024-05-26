const Question = require("../Models/QuestionModel");
const Submission=require("../Models/SubmissionModel");
const { QuestionsSchema } = require("../Helper/ValidationSchema");

const {GenerateFile}=require("../Helper/GenerateFile");
const {ExecuteCode}=require("../Helper/ExecuteCode");
const {GenerateInputFile}=require("../Helper/GenerateInputFile");
const {ExecuteSubmitCode}=require("../Helper/ExecuteSubmitCode");
const User = require("../Models/UserModel");



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
                Topic:UserInputs.Topic,
                Solution:UserInputs.Solution
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
            if (error.error && error.details) {
                res.status(400).json({ error: error.error, details: error.details });
            } else {
                next(error);
            }
        }
    }

    async SubmitCode(req,res,next){
        try{
            const {qid}=req.params;

            const {language,code,email}=req.body;

            const question=await Question.findOne({_id:qid});
            const FilePath=await GenerateFile(language,code);
            const output=await ExecuteSubmitCode(FilePath,question.TestCase);
            console.log("Output",output);
            // const results = output.map((result, index) => {
            //     if (result.success) {
            //         return `Test case ${index + 1} passed for input: ${result.testcase.Input}`;
            //     } else {
            //         if (result.error) {
            //             return `Test case ${index + 1} failed for input: ${result.testcase.Input}. Error: ${result.error}`;
            //         } else {
            //             return `Test case ${index + 1} failed for input: ${result.testcase.Input}. Expected: ${result.expected}, Got: ${result.result}`;
            //         }
            //     }
            // });
            const results = output.map((result, index) => ({
                testCaseNumber: index + 1,
                input: result.testcase.Input,
                success: result.success,
                error: result.error ? result.error : null,
                expected: result.success ? null : result.expected,
                got: result.success ? null : result.result
            }));

            const AllTestCases=results.every(result=>result.success);
            const Status=AllTestCases ? 'Accepted' : 'Failed';

            const user=await User.findOne({email:email});
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const newSubmission = new Submission({
                QuestionId: qid,
                UserId: user._id,
                Status: Status,
                SubmittedAt: new Date(),
            });
    
            await newSubmission.save();

    
            res.status(200).json({ results });
            
        }
        catch(error){
            next(error);
        }
    }

    async GetSubmissionDetails(req, res, next) {
        try {
            const { uid, qid } = req.params;
            
            const submissionDetails = await Submission.find({
                UserId: uid,
                QuestionId: qid
            });
            if (!submissionDetails) {
                return res.status(404).send("Submission not found");
            }
    
            // Convert to a plain object to avoid circular structure issues
            // const submissionDetailsObject = submissionDetails.toObject();
    
            res.status(200).json(submissionDetails);
        } catch (error) {
            next(error);
        }
    }

    async GetSubmissionDetailsByQuestion(req, res, next) {
        const { questionId } = req.params;
        console.log(questionId);
        try{

            const submissions = await Submission.find({ QuestionId:questionId });
        // if (!submissions.length) {
        //     return res.status(404).send('No submissions found!');
        // }
        res.status(200).json(submissions);
        }   
        catch(error){
            next(error);
        }

    }





}

module.exports = { QuestionsRepository };