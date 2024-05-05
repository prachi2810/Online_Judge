
const User = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");
const {AuthRefreshToken} =require("../Middlerware/Auth");
const { AuthLoginSchema, AuthRegisterSchema } = require("../Helper/ValidationSchema");

dotenv.config();

class LoginRepository {


    async register(req, res, next) {
        try {
            // const {email,password,fullname,dob}=req.body;

            // if(!email || !password || !fullname || !dob){
            //     return res.status(400).send("Please enter all information");

            // }
            const UserInputs = await AuthRegisterSchema.validateAsync(req.body);

            const ExistingUser = await User.findOne({ email: UserInputs.email });


            if (ExistingUser) {
                res.status(200).send(`${UserInputs.email} User Already Existed`);
            }

            const hashPassword = await bcrypt.hash(UserInputs.password, 10);

            const user = await User.create({
                fullname: UserInputs.fullname,
                email: UserInputs.email,
                dob: UserInputs.dob,
                password: hashPassword,
                role:"user"
            });

            const token = jwt.sign({ id: user._id, email: UserInputs.email,role:user.role }, process.env.SECRET_KEY, { expiresIn: "1d" });
            const RefreshToken = jwt.sign({ id: user._id, email: UserInputs.email,role:user.role  }, process.env.SECRET_KEY_2, { expiresIn: "1y", });
            
            user.token = token;
            user.password = undefined;

            res.status(200).json({ message: "Registered successfully!", user });
        }
        catch (error) {
            if (error.isJoi) {
                // Handle Joi validation errors
                const errorMessage = error.details.map(detail => detail.message).join(', ');
                return res.status(400).json({ error: errorMessage });
            } else {
                next(error);
            }
        }
    }

    async login(req, res, next) {
        try {
            // const {email,password}=req.body;

            // if (!(email && password)) {
            //     return res.status(400).send("Please enter all the information");
            // }
            const UserInputs = await AuthLoginSchema.validateAsync(req.body);


            const user = await User.findOne({ email: UserInputs.email });

            if (!user) {
                return res.status(404).send(`${UserInputs.email} Not Found!`);
            }

            const EnteredPassword = await bcrypt.compare(UserInputs.password, user.password);

            if (!EnteredPassword) {
                return res.status(401).send("Password is incorrect");
            }

            const token = jwt.sign({ id: user._id, email: UserInputs.email,role:user.role  }, process.env.SECRET_KEY, { expiresIn: "30s", });
            const RefreshToken = jwt.sign({ id: user._id, email: UserInputs.email,role:user.role  }, process.env.SECRET_KEY_2, { expiresIn: "120s", });

            user.token = token;
            user.password = undefined;

            res.status(200)
                .cookie("token", token, {
                    expiresIn: new Date(Date.now() + 30 * 1000),
                    httpOnly: true
                })
                .cookie("refreshtoken",RefreshToken,{
                    expiresIn:new Date(Date.now() +  120 * 1000),
                    httpOnly: true
                })
                .json({
                    message: `Successfully Logged in for ${UserInputs.email}!!`,
                    success: true,
                    token,
                    RefreshToken
                });
        }
        catch (error) {
            if (error.isJoi) {
                // Handle Joi validation errors
                const errorMessage = error.details.map(detail => detail.message).join(', ');
                return res.status(400).json({ error: errorMessage });
            } else {
                next(error);
            }
        }
    }

    async RefreshToken(req, res, next) {
 

        try {
           console.log(req.body);
           const {RefreshToken} =req.body;

           if(!RefreshToken){
            res.status(404).send("Refresh token not found!");
           }
           
           const { email, id: userid } = await AuthRefreshToken(RefreshToken);
           console.log({ email, id: userid });
           const AccessToken= jwt.sign({ id: userid, email: email }, process.env.SECRET_KEY, { expiresIn: "30s", });
           const RefToken= jwt.sign({ id: userid, email: email }, process.env.SECRET_KEY, { expiresIn: "60s", });

           res.send({AccessToken,refreshtoken:RefToken});
        }
        catch (error) {
            next(error);
        }

    }

    async ForgotPassword(req,res,next){
        try{
            const UserInputs = await AuthLoginSchema.validateAsync(req.body);
            const userdata= await User.findOne({email:UserInputs.email});

            if(!userdata){
                res.status(404).json({message:"User Not Found!"});
            }

            const EnteredPassword = await bcrypt.compare(UserInputs.password,userdata.password);
            console.log(EnteredPassword);
            if(EnteredPassword){
                res.status(201).json({message:"Password is same as previous!"});
            }

            const hashPassword = await bcrypt.hash(UserInputs.password, 10);

            const user = await User.updateOne({email:UserInputs.email},{password:hashPassword});


            res.status(201).json({message:"Password Updated!"});

        }
        catch(error){
            next(error);
        }
    }

    async Logout(req,res,next){
        try{
           const ClearToken=await res.clearcookie('token');
           const ClearRefreshToken=await res.clearcookie('refreshtoken');

           res.status(200).json({message:"Logout Sucessfully"});
        }
        catch(error){
            next(error);

        }
    }

    


}

module.exports = { LoginRepository };