
const {LoginRepository} =require("../Repository/LoginRepo")

class LoginService{

    constructor(){
        this.repository=new LoginRepository();
    }

    async register(req,res,next){

        try{
           const RegisterUser=await this.repository.register(req,res,next);
           return RegisterUser;
        }
        catch(error){
            next(error);
        }
    }

    async login(req,res,next){

        try{
           const LoginUser=await this.repository.login(req,res,next);
           return LoginUser;
        }
        catch(error){
            next(error);
        }
    }

    async RefreshToken(req,res,next){

        try{
           const LoginUser=await this.repository.RefreshToken(req,res,next);
           return LoginUser;
        }
        catch(error){
          next(error);
        }
    }

    async ForgotPassword(req,res,next){
        try{
            const LoginUser=await this.repository.ForgotPassword(req,res,next);
            return LoginUser;
         }
         catch(error){
           next(error);
         }
    }
}

module.exports = LoginService;