import joi from "joi";

const createUserSchema = joi.object({
    name: joi.string().alphanum().min(3).max(30).required(),
    password: joi.string().min(6).required(),
    email: joi.string().email().optional(),
    address: joi.string().min(10).max(200).required(),
    number: joi.string()
    .pattern(/^\+20\d{10}$/) // Egyptian phone number pattern
    .length(13)
    .required()
    .messages({
        "string.pattern.base": "Number must be a valid Egyptian phone number starting with +20 followed by 10 digits",
        "string.length": "Number must be exactly 13 characters long",
        "string.empty": "Number is required"
    }),
    role: joi.string().valid("ADMIN", "USER", "SELLER", "VENDOR").required(),
});

const LoginSchema = joi.object({
    number: joi.string()
    .pattern(/^\+20\d{10}$/) // Egyptian phone number pattern
    .length(13)
    .required()
    .messages({
        "string.pattern.base": "Number must be a valid Egyptian phone number starting with +20 followed by 10 digits",
        "string.length": "Number must be exactly 13 characters long",
        "string.empty": "Number is required"
    }),
    password: joi.string().min(6).required(),
})

const index = {
    createUserSchema,
    LoginSchema
}
export default index;