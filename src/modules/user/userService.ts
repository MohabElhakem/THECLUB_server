/*
* User Service File
* Purpose:
*  - Contains business logic related to user operations.
*  - Interacts with the database through Prisma Client.
*  - Provides functions for user creation, retrieval, updating, and deletion.
* 
*  Notes: 
*  - Ensure to handle errors and edge cases in actual implementations.
*  - This file should be imported by controllers or route handlers to perform user-related operations.
*  - Keep this file focused on business logic; avoid direct request/response handling.
*  - No need to import the user model directly; use Prisma Client for database interactions.
* 
**/



import prisma from "../../lib/prisma.js";
import type { Role } from "../../generated/prisma/client.js";
import err from "../../error/index.js";
import bcrypt from "bcryptjs";
import type {
    userData_DB,
    userData_return,
} from "./userInterface.js";




//------------------------------
// Signing new user to DB
//------------------------------
export async function addUser_DB ( input : userData_DB ) : Promise < userData_return > {
    console.log("Creating a new user in the database...\n");
    if(!input){
        console.log("Invalid input data for creating a new user.\n");
        throw new err.InternalError("Invalid input data for the new user");
    }
    // Hash the password before storing
    const hasshedPassword = await bcrypt.hash(input.password, 10);
    const newUser = await prisma.user.create({
        data: {
            name: input.name,
            email: input.email || null,
            password: hasshedPassword,
            role: input.role as Role,
            address: input.address,
            number: input.number,
        },
        select: {
            id: true,
        }
    });

    return newUser;
} 

