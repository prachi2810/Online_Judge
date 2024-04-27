
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
          
        }
    }

    async login(req,res,next){

        try{
           const LoginUser=await this.repository.login(req,res,next);
           return LoginUser;
        }
        catch(error){
          
        }
    }
}

module.exports = LoginService;