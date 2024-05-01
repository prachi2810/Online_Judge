const Joi = require('joi')


const AuthLoginSchema=Joi.object({
    email:Joi.string().email().lowercase().required(),
    password:Joi.string().min(8).regex(/^[a-zA-Z0-9]{3,30}$/).required(),
})

const AuthRegisterSchema=Joi.object({
    fullname:Joi.string().min(5).max(30).required(),
    email:Joi.string().email().min(5).max(30).lowercase().required(),
    password:Joi.string().min(8).regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    dob:Joi.date().required()
})

const QuestionsSchema=Joi.object({
    Title:Joi.string().min(5).max(30).required(),
    Description:Joi.string().min(5).max(100).required(),
    Level: Joi.number().required(), 
    TestCase: Joi.array().items(Joi.object({
        Input: Joi.string().required(),
        Output: Joi.string().required()
    })).required(),
    Constraints: Joi.string().required() ,
    Topic:Joi.number()
})

module.exports={
    AuthLoginSchema,
    AuthRegisterSchema,
    QuestionsSchema
}