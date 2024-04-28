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

module.exports={
    AuthLoginSchema,
    AuthRegisterSchema
}