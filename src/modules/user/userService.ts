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
    FetechedUserData_input,
    FetechedUserData_return,
} from "./userInterface.js";

//------------------------------
// Signing in the Admin user once
//------------------------------
export async function signInAdmin_DB ( ) : Promise < void > {
    console.log("Signing in the Admin user...\n");
    const adminNumber = process.env.ADMIN_NUMBER;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if(!adminNumber || !adminPassword){
        console.warn("⚠️ ADMIN_NUMBER or ADMIN_PASSWORD not set. Skipping admin creation.");
        return;
    }

    const existingAdmin = await prisma.user.findUnique({
        where: { number: adminNumber },
    });

    if (existingAdmin) {
        console.log("Admin user already exists. No action taken.\n");
        return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await prisma.user.upsert({
    where: { number: adminNumber }, // lookup by number now
    update: {}, // do nothing if admin exists
    create: {
        id: "ADMIN-1",
        name: "Admin",
        email: null,
        password: hashedPassword,
        role: "ADMIN",
        address: "Admin Address",
        number: adminNumber,
    },
    });

    console.log("Admin user created successfully.\n");
}
/*
* signInAdmin_DB:
*  - Ensures the existence of an Admin user in the database.
*  - Uses environment variables ADMIN_NUMBER and ADMIN_PASSWORD for credentials.
*  - If the Admin user does not exist, it creates one with default values.
**/

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
/*
* addUser_DB:
*  - Creates a new user in the database.
*  - Accepts user data as input and hashes the password before storing.
*  - Returns the ID of the newly created user.
**/

//------------------------------
// Fetching user by number or id from DB
//------------------------------
export async function fetchUser_DB ( input : FetechedUserData_input ) : Promise < FetechedUserData_return | false> {
    console.log(`Fetching user by ${input.field} from the database...\n`);
    // Validate input is there
    if(!input || !input.field || !input.value){
        console.log("Invalid input data for fetching user.\n");
        throw new err.InternalError("Invalid input data for fetching user");
    }

    // Fetch user based on field type
    const user = await prisma.user.findUnique({
        where: input.field === "id"
            ? { id: input.value }
            : { number: input.value },
        select: {
            id:true,
            number:true,
            name:true,
            email:true,
            password:true,
            role:true,
            address:true,
            avatarUrl:true,
            avatarPuplicId:true,
            isActive:true,
        }
    })

    if (!user) {
        console.log(`User not found with ${input.field}: ${input.value}\n`);
        return false;
    }
    return user;
}
/*
* fetchUser_DB:
*  - Retrieves a user from the database based on either ID or number.
*  - Accepts an input object specifying the field and value to search by.
*  - Returns the user data if found; throws an error if not found.
**/



