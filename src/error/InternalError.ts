import AppError from "./AppError.js";

class InternalError extends AppError {
    constructor(message = "Something Bad with the code or server see the console log"){
        super(message , 500)
    }
}

export default InternalError;