import AppError from "./AppError.js";

class Unauthorized extends AppError{
    constructor(message = "Unauthorized acces"){
        super(message , 401);
    }
}

export default Unauthorized;