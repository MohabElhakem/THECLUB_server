/**
 * ==========================================
 * Express App Configuration
 * ==========================================
 *
 * Purpose:
 *  - Initialize the Express application
 *  - Configure global middlewares (e.g., JSON parser, logging, etc.)
 *  - Set up all routes and route groups
 *  - Set up a global error handler
 *
 * Notes:
 *  1. This file does NOT start the server — server.ts handles that.
 *  2. All route modules should be imported and mounted here.
 *     Example: app.use('/task', taskRouter);
 *  3. Global middlewares like express.json(), CORS, helmet, etc.,
 *     should be added before mounting routes.
 *  4. The ErrorHandler middleware should always be the **last middleware**
 *     to catch errors from any route.
 *  5. Keep this file clean — no business logic or database queries here.
 *
 * Folder structure suggestion:
 *  - src/app.ts             <-- this file
 *  - src/server.ts          <-- server startup
 *  - src/modules/routes/    <-- all route modules
 *  - src/lib/               <-- reusable helpers (Prisma client, async handler, etc.)
 *  - src/error/ErrorHandler.ts <-- centralized error handling
 */

import express from 'express';
const app = express();
import ErrorHandler from './error/ErrorHandler.js';
import cookieParser from "cookie-parser";
import userRouter from './modules/user/userRoutes.js';
// for parsing cookies from requests

//import router from './modules/routes/appRoutes.js';



// ------------------------------
// Global Middleware
// ------------------------------
// Parse incoming JSON requests
app.use(express.json());
app.use(cookieParser()); 

// ------------------------------
// Routes
// ------------------------------
// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the club ');
});

// Mount main router
app.use('/user', userRouter);

// ------------------------------
// Global Error Handler
// ------------------------------
app.use(ErrorHandler);

export default app;
