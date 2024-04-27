
const User=require("../Models/UserModel");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const dotenv=require('dotenv');
const cookieParser = require("cookie-parser");
const { AuthLoginSchema,AuthRegisterSchema } = require("../Helper/ValidationSchema");

dotenv.config();

class LoginRepository{


    async register(req,res,next){
        try{
            // const {email,password,fullname,dob}=req.body;
            
            // if(!email || !password || !fullname || !dob){
            //     return res.status(400).send("Please enter all information");
                
            // }
           const UserInputs=await AuthRegisterSchema.validateAsync(req.body);

            const ExistingUser=await User.findOne({email : UserInputs.email});


            if(ExistingUser){
                    res.status(200).send(`${UserInputs.email} User Already Existed`);
            }

            const hashPassword=await bcrypt.hash(UserInputs.password,10);

            const user=await User.create({
                fullname:UserInputs.fullname,
                email:UserInputs.email,
                dob:UserInputs.dob,
                password:hashPassword
            });

            const token=jwt.sign({id:user._id,email:UserInputs.email},process.env.SECRET_KEY,{ expiresIn: "1d"});
            user.token=token;
            user.password=undefined;
            
            res.status(200).json({message:"Registered successfully!",user});
        }
        catch(error){
            if (error.isJoi) {
                // Handle Joi validation errors
                const errorMessage = error.details.map(detail => detail.message).join(', ');
                return res.status(400).json({ error: errorMessage });
            } else {
                next(error);
            }
        }
    }

    async login(req,res,next){
        try{
            // const {email,password}=req.body;

            // if (!(email && password)) {
            //     return res.status(400).send("Please enter all the information");
            // }
            const UserInputs=await AuthLoginSchema.validateAsync(req.body);


            const user=await User.findOne({email: UserInputs.email});

            if(!user){
                return res.status(404).send(`${UserInputs.email} Not Found!`);
            }

            const EnteredPassword=await bcrypt.compare(UserInputs.password,user.password);

            if (!EnteredPassword) {
                return res.status(401).send("Password is incorrect");
            }

            const token=jwt.sign({id:user._id,email:UserInputs.email},process.env.SECRET_KEY,{expiresIn: "1d",});
            user.token = token;
            user.password = undefined;

            res.status(200).cookie("token",token,{expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                httpOnly: true}).json({
                    message:`Successfully Logged in for ${UserInputs.email}!!`,
                    success:true,
                    token
                });
        }
        catch(error){
            if (error.isJoi) {
                // Handle Joi validation errors
                const errorMessage = error.details.map(detail => detail.message).join(', ');
                return res.status(400).json({ error: errorMessage });
            } else {
                next(error);
            }
        }
    }


}

module.exports = {LoginRepository};