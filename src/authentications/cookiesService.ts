import type { Response } from "express";
import "dotenv/config";

//-----------
// Set token to the Cookies
//-----------   
export function setTokenToCookies(res : Response, token: string): void {
    console.log("Setting token to cookies...");
    const days = process.env.COOKIES_EXPIRES_IN_DAYS ?
     Number(process.env.COOKIES_EXPIRES_IN_DAYS)
     : 1 ; // Default to 1 day if not specified
    const cookieOptions ={
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        maxAge: days * 24 * 60 * 60 * 1000, // Convert days to milliseconds
    }

    res.cookie("authToken", token, cookieOptions);
}
/*
* Purpose:
*   _ to set the JWT token in the HTTP-only cookies for secure storage on client side
*   _ to enhance security by preventing client-side scripts from accessing the token
* Notes:
*   - uses express response object to set cookies
*   _ cookie options are configured for security and expiration
**/

