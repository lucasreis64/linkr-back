import Joi from "joi";

export const signUpSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "br"] } })
        .required(),
    password: Joi.string().min(5).required(),
    confirmPassword: Joi.ref("password"),
});