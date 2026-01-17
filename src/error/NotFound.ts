import AppError from "./AppError.js";

class NotFound extends AppError{
    constructor (message = "URL not found"){
        super(message, 404)
    }
}

export default NotFound ;
