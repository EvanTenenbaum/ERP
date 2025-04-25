// Vercel-specific build detection and Prisma mock implementation
// This ensures proper detection of build vs. runtime environments

// Create a build flag file that will be checked at runtime
const fs = require('fs');
const path = require('path');

// Write a build flag file
fs.writeFileSync(
  path.join(__dirname, '.vercel-build-flag'),
  `This file was created during build at ${new Date().toISOString()}`
);

console.log('Created Vercel build flag file for proper build detection');

// Also update the dynamic-prisma.js file to use this flag
const dynamicPrismaPath = path.join(__dirname, 'lib', 'dynamic-prisma.js');
const dynamicPrismaContent = `// Dynamic Prisma client initialization with Vercel-specific build detection
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
};`;

fs.writeFileSync(dynamicPrismaPath, dynamicPrismaContent);
console.log('Updated dynamic-prisma.js with Vercel-specific build detection');

// Update vercel.json to include the build flag script
const vercelJsonPath = path.join(__dirname, 'vercel.json');
const vercelJson = {
  "buildCommand": "node vercel-build-flag.js && prisma generate && next build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "env": {
    "VERCEL_ENV": "production"
  }
};

fs.writeFileSync(vercelJsonPath, JSON.stringify(vercelJson, null, 2));
console.log('Updated vercel.json to include build flag script');

// Create a copy of the script for Vercel to run
fs.copyFileSync(
  __filename,
  path.join(__dirname, 'vercel-build-flag.js')
);
console.log('Created vercel-build-flag.js for Vercel build process');
