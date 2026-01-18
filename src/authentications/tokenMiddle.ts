import type { Request,Response,NextFunction } from "express";
import { decodeToken , generateToken } from "./tokenService.js";
import err from "../error/index.js";

//-----------
// Authenticate Middleware from the cookies
//-----------   
export function authenticateMiddleware(role : string) {   

    return ( req: Request, res: Response, next: NextFunction ,) =>{
        console.log("Authenticating from cookies...\n");
        const token = req.cookies.authToken;
        if (!token) {
            console.log("No token found in cookies");
            return next(new err.Unauthorized("No token provided in cookies"));
        }
        try {
            const decoded = decodeToken(token);
            if (role && decoded.role !== role) {
                console.log(`User role ${decoded.role} does not have access. Required role: ${role}`);
                return next(new err.Forbidden("You do not have permission to access this resource"));
            }
            // Attach user info to request object for downstream use
            req.user = {
                id: decoded.id,
                number: decoded.number,
                role: decoded.role
            };
            next();
        } catch (error) {
            console.log("Token verification failed:\n");
            return next(new err.Unauthorized("Invalid or expired token in cookies"));
        }
    }
 }

