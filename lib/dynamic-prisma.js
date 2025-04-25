// Dynamic Prisma client initialization with Vercel-specific build detection
// This approach uses dynamic imports to avoid initialization during build time

import fs from 'fs';
import path from 'path';

// More reliable build detection
const isBuildTime = () => {
  // Check for Vercel build environment variables
  if (process.env.VERCEL_ENV === 'production' && process.env.NODE_ENV === 'production') {
    return true;
  }
  
  // Check for build flag file (created during build process)
  try {
    const flagPath = path.join(process.cwd(), '.vercel-build-flag');
    return fs.existsSync(flagPath);
  } catch (e) {
    // If there's an error checking, assume we're in build time to be safe
    return true;
  }
};

// Helper function to get Prisma client
let prisma;

export async function getPrismaClient() {
  if (prisma) {
    return prisma;
  }
  
  // Use mock client during build time
  if (isBuildTime()) {
    try {
      // Try to load the mock client
      const mockClientPath = path.join(process.cwd(), 'prisma', 'mock-client.js');
      const mockClient = require(mockClientPath);
      prisma = new mockClient.PrismaClient();
      return prisma;
    } catch (e) {
      // Fallback mock if loading fails
      return {
        $connect: async () => {},
        $disconnect: async () => {},
        user: { findUnique: async () => null },
        customer: { findUnique: async () => null },
        // Add other models as needed
      };
    }
  }
  
  try {
    // Dynamically import PrismaClient only when needed at runtime
    const { PrismaClient } = await import('@prisma/client');
    
    // Create a new instance
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' 
        ? ['query', 'error', 'warn'] 
        : ['error'],
    });
    
    return prisma;
  } catch (e) {
    console.error('Error initializing Prisma client:', e);
    // Return a dummy client as fallback
    return {
      $connect: async () => {},
      $disconnect: async () => {},
      // Add other methods as needed
    };
  }
}

// Export a dummy client for type checking
// This won't be used at runtime but helps with TypeScript
export const dummyPrismaClient = {
  $connect: async () => {},
  $disconnect: async () => {},
  // Add other common methods as needed
};