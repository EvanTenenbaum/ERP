import { PrismaClient } from '@prisma/client';

/**
 * PrismaClient is attached to the `global` object in development to prevent
 * exhausting your database connection limit.
 * Learn more: https://pris.ly/d/help/next-js-best-practices
 * 
 * This implementation uses a more robust approach to ensure the client
 * is properly initialized during both development and production builds.
 */

// Define a more reliable global object that works in all environments
const globalForPrisma = global;

// Ensure the prismaClient object exists on the global object
globalForPrisma.prismaClient = globalForPrisma.prismaClient || {};

// Initialize PrismaClient if it doesn't exist yet
if (!globalForPrisma.prismaClient.instance) {
  globalForPrisma.prismaClient.instance = new PrismaClient();
}

// Export the singleton instance
export const prisma = globalForPrisma.prismaClient.instance;

export default prisma;
