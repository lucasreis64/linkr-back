import Joi from "joi";

export const signUpSchema = Joi.object({
    
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "br"] } })
        .required(),
    password: Joi.string().min(5).required(),
    username: Joi.string().min(3).max(15).required(),
    url: Joi.string().uri().required()
});