/**
 * Global Error Handling Middleware
 * 
 * Purpose:
 *  - Catches all errors thrown in the application (both operational and unexpected).
 *  - Sends a consistent JSON response to the client with the correct HTTP status code.
 *  - Logs unexpected errors for debugging without exposing sensitive details to the client.
 * 
 * How it works:
 *  1. Checks if the error is an instance of `AppError`:
 *      - If yes → uses its defined status code and message (operational error)
 *      - If no → treats it as an unexpected error, logs it, and converts it to a 500 Internal Server Error
 *  2. Logs the error details for debugging purposes
 *  3. Sends a structured JSON response:
 *      - `status`: "fail" for client errors (4xx), "error" for server errors (5xx)
 *      - `message`: user-friendly error message
 * 
 * Usage:
 *  - Place at the **end of all route definitions** in Express (`app.use(globalErrorHandler);`)
 *  - All errors thrown with `throw new AppError(...)` or its subclasses are automatically handled
 *  - Works seamlessly with `asyncHandler` for async routes
 * 
 * Example response for a 404 Not Found:
 *  {
 *    "status": "fail",
 *    "message": "Project not found"
 *  }
 * 
 * Example response for a 500 Internal Server Error:
 *  {
 *    "status": "error",
 *    "message": "Internal Server Error"
 *  }
 */
import AppError from './AppError.js';
import type { Request , Response ,NextFunction } from "express";
import Err from "./index.js";

const globalErrorHandler = (
        err :unknown,
        req: Request ,
        res: Response,
        next: NextFunction
    )=>{
            console.log (err);
            let error : AppError;
            if(err instanceof Err.AppError){
                error = err
            }else{
                console.log("\nUnexpected Error\n", err);
                error = new Err.AppError("Internal server error", 500);
            }
            
            // log the error details for debugging
            console.log("Error Occurred", error);
            
            // send the structured error response
            return res.status(error.statusCode).json({
                message : error.message,
                status: error.statusCode >= 500 ? 'error' : 'fail' 
            })
    

        }

export default globalErrorHandler