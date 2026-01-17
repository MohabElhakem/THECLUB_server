class AppError extends Error {
    // start by declaring the new vlalues or thr extended values
    // its a must 
    statusCode : number;
    isOpertaional: boolean;

    constructor(message:string , statusCode : number){ 
        super(message); // call the built in error constructor 
        this.statusCode = statusCode;
        this.isOpertaional = true;

        // for the prototype chain(required for extending the error in typeclass )
        Object.setPrototypeOf(this, new.target.prototype);
        //set the error name to the class name
        this.name = this.constructor.name;
        // makes the stack trace start from the oint the error was thrown
        Error.captureStackTrace(this, this.constructor); 
    }

}

export default AppError;