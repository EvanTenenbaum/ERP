// Direct Prisma client initialization for API routes
// This approach avoids the global singleton pattern which can cause issues during build

import { PrismaClient } from '@prisma/client';

// Create a new PrismaClient instance directly for this API route
// This ensures each route has its own properly initialized client
const prismaClient = new PrismaClient({
  // Disable logging in production for better performance
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
});

export default prismaClient;
