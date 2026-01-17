import AppError from "./AppError.js";

class Forbidden extends AppError {
    constructor (message = "Forbidden acced"){
        super(message , 403)
    }
}

export default Forbidden;