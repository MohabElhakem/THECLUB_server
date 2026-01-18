import { Router } from "express";
import  userCtrl from "./userControl.js";
import authService from "../../authentications/index.js";
import validation from "../../validation/joiMiddleware.js"; 
import joiSchemas from "../../validation/userJoiValidation.js"
const router = Router();

//------------------------------
// User Signup Route
//------------------------------
router.post(
    "/signup",
    validation(joiSchemas.createUserSchema),
    authService.authenticateMiddleware("ADMIN"),
    userCtrl.createUser_CTRL
)
/*
* POST /signup:
*  - Route to handle user signup requests.
*  - Validates incoming user data using Joi schema before passing to controller.
*  - Calls createUser_CTRL to process the signup.
*  
*  Notes: 
*  - This route is typically accessed by an admin to create new users.
*  
*  Needs:
*   _name 
*   _number: start with +20 followed by 10 digits
*   _password
*   _role
*   _address
*   _email (optional)
**/

//------------------------------
// User Login Route
//------------------------------
router.post(
    "/login",
    validation(joiSchemas.LoginSchema),
    userCtrl.loginUser_CTRL
)
/*
* POST /login:
*  - Route to handle user login requests.
*  - Validates incoming login data using Joi schema before passing to controller.
*  - Calls loginUser_CTRL to process the login.
*  
*  Notes: 
*  - This route is accessed by users to log into their accounts.
*  
*  Needs:
*   _number: start with +20 followed by 10 digits
*   _password
**/




export default router;