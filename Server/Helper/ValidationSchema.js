const Joi = require('joi')


const AuthLoginSchema=Joi.object({
    email:Joi.string().email().lowercase().required(),
    password:Joi.string().min(8).regex(/^[a-zA-Z0-9]{3,30}$/).required(),
})

const AuthRegisterSchema = Joi.object({
    fullname: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string()
        .min(8)
        .max(30)
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,30}$/)
        .required()
        .messages({
            'string.pattern.base': 'Password must contain at least one letter, one number, and one special character.',
        }),
    dob: Joi.date().required(),
});

const QuestionsSchema=Joi.object({
    Title:Joi.string().min(5).max(30).required(),
    Description:Joi.string().min(5).max(100).required(),
    Level: Joi.number().required(), 
    Constraints: Joi.string().required() ,
    Topic:Joi.number()
})

module.exports={
    AuthLoginSchema,
    AuthRegisterSchema,
    QuestionsSchema
}