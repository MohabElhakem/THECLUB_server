 /* ==========================================
 * Main Server File
 * ==========================================
 *
 * Purpose:
 *  - Initialize Express server
 *  - Connect to PostgreSQL via Prisma
 *  - Start listening on a port
 *
 * Notes:
 *  - We use a singleton Prisma client from src/lib/prisma.ts
 *  - All routes and middlewares are added in app.ts
 *  - Errors during DB connection or server startup will stop the process
 */

import "dotenv/config";  // loads .env automatically
import app from "./app.js";  // Express app with routes & middleware
import prisma from "./lib/prisma.js"; // Prisma client
import { signInAdmin_DB } from "./modules/user/userService.js";

const PORT = process.env.PORT || 3000;

console.log("Initializing server...");

const startServer = async () => {
  try {
    // Test DB connection
    await prisma.$connect();
    console.log("✅ Database connected");
    // Ensure admin user exists
    await signInAdmin_DB(); 
    console.log("✅ Admin user check complete");
    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start the server:", error);
    process.exit(1);
  }
};

startServer();