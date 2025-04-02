const { PrismaClient } = require("@prisma/client");

const globalForPrisma = globalThis; // Ensures a single instance in dev

const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"], // Enable logging for debugging
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

// Graceful error handling
async function checkDatabaseConnection() {
  try {
    await db.$connect();
    console.log("✅ Database connected successfully.");
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1); // Exit to prevent running in a broken state
  }
}

// Check database connection on startup
checkDatabaseConnection();

module.exports = { db };
