import AppError from "./AppError.js";

class Conflict extends AppError{

    constructor(message = "Duplicated email"){
        super(message , 409)
    }
}

export default Conflict;