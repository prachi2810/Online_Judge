
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
            console.log(AuthRegisterSchema.describe());
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
            const RefreshToken = jwt.sign({ id: user._id, email: UserInputs.email,role:user.role  }, process.env.SECRET_KEY_2, { expiresIn: "7d", });
            
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
                res.status(401).json({message:error})
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

            const token = jwt.sign({ id: user._id, email: UserInputs.email,role:user.role  }, process.env.SECRET_KEY, { expiresIn: "1d", });
            const RefreshToken = jwt.sign({ id: user._id, email: UserInputs.email,role:user.role  }, process.env.SECRET_KEY_2, { expiresIn: "7d", });

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
                res.status(401).json({message:error})
            }
        }
    }

    async RefreshToken(req, res, next) {
 

        try {
           const cookies=req.cookies;
           console.log(cookies);
           if(!cookies?.refreshtoken) return res.status(401).json({message:"Unauthorized"});
        //    console.log(req.body);
           const RefreshToken=cookies.refreshtoken;
        //    const {RefreshToken} =req.body;
            console.lo
           if(!RefreshToken){
            res.status(404).send("Refresh token not found!");
           }
           console.log(await AuthRefreshToken(RefreshToken));
           const { email, id,role } = await AuthRefreshToken(RefreshToken);
           console.log(email);
           if(!email || !id){
            return res.status(401).json({message:"Refresh Token expired"})
           }

           console.log({ email, id });
           const AccessToken= jwt.sign({ id, email: email,role:role }, process.env.SECRET_KEY, { expiresIn: "1d", });
           const RefToken= jwt.sign({ id, email: email,role:role }, process.env.SECRET_KEY, { expiresIn: "7d", });

           res.send({AccessToken,refreshtoken:RefToken});
        }
        catch (error) {
            next(error);
            res.status(401).json({message:error})
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
            console.log("clearing"); 
           const ClearToken=await res.clearCookie('token', { httpOnly: true });
           const ClearRefreshToken=await res.clearCookie('refreshtoken', { httpOnly: true });
           

           res.status(200).json({message:"Logout Sucessfully"});
        }
        catch(error){
            next(error);
            res.status(401).json({message:error})
        }
    }

    async VerifyUser(req,res,next){
        try{
            const token=req.cookies.token;
            if(!token){
                res.status(401).send("Access Denied...");

            }
            else{
                const decoded = jwt.verify(token, process.env.SECRET_KEY);
                res.status(200).send(decoded);
            }

        }
        catch(error){
            next(error);
            res.status(400).json({message:error});
        }
    }

    


}

module.exports = { LoginRepository };