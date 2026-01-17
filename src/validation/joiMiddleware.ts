import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { ObjectSchema } from "joi";

const validate = (schema: ObjectSchema, property: "body" | "query" | "params" = "body"): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error, value } = schema.validate(req[property], {
            abortEarly: false, // show all errors, not just first
            stripUnknown: true // remove unknown fields
        });

        if (error) {
            return res.status(400).json({
                message: "Validation error",
                errors: error.details.map(detail => detail.message)
            });
        }

        // Assign the validated value back to req[property]
        req[property] = value;
        next();
    };
};

export default validate