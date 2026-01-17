import AppError from "./AppError.js";

class BadRequest extends AppError {
    constructor(message = "Bad Request"){
        super(message , 400)
    }
}

export default BadRequest;