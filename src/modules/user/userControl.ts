import type { Request, Response } from "express";
import * as userService from "./userService.js";
import err from "../../error/index.js";
import asyncHandler from "../../lib/asyncHandler.js";   
import bcrypt from "bcryptjs";
import authService from "../../authentications/index.js";
import type { 
    userData_DB,
    loginRoute_input,
    FetechedUserData_return,
} from "./userInterface.js";



//------------------------------
// Create User Controller Signup    
//------------------------------
const createUser_CTRL = asyncHandler( 
    async (
        req: Request<{},{}, userData_DB>,
        res: Response
    ) => {
        console.log("Received user signup request");
        // Extract user data from request body
        const userData: userData_DB = req.body;
        if (!userData) {
            throw new err.BadRequest("User data is required");
        }
        //check if the user number already exists
        const existingUser = await userService.fetchUser_DB(
            {
                field : "number",
                value : userData.number,
            }
        );
        if(existingUser) {
            console.log("User with number already exists:", userData.number);
            throw new err.Conflict("User with this number already exists");
        }
        // Call service layer to add user to the database
        const newUser = await userService.addUser_DB(userData);
        if (!newUser) {
            throw new err.InternalError("Failed to create user");
        }
        console.log("User created successfully with ID:", newUser.id);
        // Respond with success message and new user ID
        res.status(201).json({
            message: "User created successfully",
            id : newUser
        });

    }
);
/* 
* createUser_CTRL:
*  - Controller to handle user signup requests.
*  - Validates incoming user data and calls the service layer to create a new user.
*  - Responds with success message and new user ID upon successful creation.
*  - Uses asyncHandler to manage asynchronous errors.
*  - dont set the cookie or give token
*  - it will interfere with the admin token 
*  - the user will have to login after signup to get his token
*  
*  Notes: 
*  - The admin is the one using this route so dont give him the token he just creates users 
**/

//------------------------------
// login Controller
//------------------------------
const loginUser_CTRL = asyncHandler(
    async(
        req : Request<{},{}, loginRoute_input>,
        res : Response
    ) => {
        console.log("Received user login request");
        // take the login data from the body
        const loginData = req.body;
        if(!loginData || !loginData.number || !loginData.password) {
            console.log("Invalid login data:", loginData);
            throw new err.BadRequest("Number and password are required for login");
        }

        // first fetch the user from the database
        const fetchUser : FetechedUserData_return | false = await userService.fetchUser_DB(
            {
                field : "number",
                value : loginData.number,
            }
        );
        // if user not found
        if(fetchUser === false) {
            console.log("User not found with number:", loginData.number);
            throw new err.Unauthorized("Invalid number or password");
        }
        
        // now verify the password
        const isPasswordValid = await bcrypt.compare(loginData.password, fetchUser.password);
        if(!isPasswordValid) {
            console.log("Invalid password for user number:", loginData.number);
            throw new err.Unauthorized("Invalid number or password");
        }

        // every thing is valied now generate the token
        const token = authService.generateToken(
            fetchUser.id,
            fetchUser.role,
            fetchUser.number
        )
        if(!token || !token.token) {
            console.log("Failed to generate token for user id:", fetchUser.id);
            throw new err.InternalError("Failed to generate authentication token");
        }
        // save it to the cookies
        authService.setTokenToCookies(res, token.token);
        console.log("User logged in successfully, token set in cookies for user id:", fetchUser.id);
        // respond with success message
        res.status(200).json({
            message: "User logged in successfully",
            action: "take him to the dashboard",
        });

    }
)
/*
* loginUser_CTRL:
*  - Controller to handle user login requests.
*  - Validates incoming login data and calls the service layer to authenticate the user.
*  - Responds with appropriate messages based on authentication outcome.
*  - Uses asyncHandler to manage asynchronous errors.
**/





const index = {
    createUser_CTRL,
    loginUser_CTRL,
}
export default index;