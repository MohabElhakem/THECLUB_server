import jwt from "jsonwebtoken";
import type { signTokenInterface , decodeTokenInterface} from "./authInterface.js";
import "dotenv/config";
import err from "../error/index.js";

//-----------
// Generate JWT Token
//-----------   
export function generateToken(userId: number , role:string , email: string):signTokenInterface {
    console.log("Generating token...");
    const secretKey = process.env.JWT_SECRET_KEY as string;
    const expiresIn: string = process.env.JWT_EXPIRES_IN || "1d";
    if (!secretKey) {
        console.error("JWT secret key is not defined in environment variables");
        throw new err.InternalError("JWT secret key is not defined in environment variables");
    }
    const payload = { userId, role ,email};
    const token = jwt.sign(payload, secretKey, { expiresIn } as jwt.SignOptions);
    return {token , payload};
}
/*
* Purpose:
*   
*   _ to generate everu token with the pasic and most important information about the user
*   _ to be used later for authentication and authorization
* 
* Notes:
*   - uses jsonwebtoken package to sign the token
*   _ minimal might be changed later
*   _ secret key and expiration are taken from environment variables for security and configurability
*   _ throws an InternalError if the secret key is not defined
**/



//-----------
// Decode JWT Token 
//-----------   
export function decodeToken(token : string) : decodeTokenInterface {
    console.log("Verifying token...");
    const secretKey = process.env.JWT_SECRET_KEY as string;
    if (!secretKey) {
        console.error("JWT secret key is not defined in environment variables");
        throw new err.InternalError("JWT secret key is not defined in environment variables");
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded as decodeTokenInterface;
    } catch (error) {
        console.error("Token verification failed:", error);
        throw new err.Unauthorized("Invalid or expired token");
    }
}
/*
* Purpose:
*   _ to decode and verify the JWT token received from client
*   _ to extract user information from the token payload
* Notes:
*   - uses jsonwebtoken package to verify the token
*   _ secret key is taken from environment variables for security
*   _ throws an Unauthorized error if token is invalid or expired
*   _ throws an InternalError if the secret key is not defined
**/