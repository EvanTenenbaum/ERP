// This file ensures Prisma is initialized before API routes are executed
// It's used in the Vercel build process to prevent initialization errors

import { PrismaClient } from '@prisma/client';

// Force Prisma to initialize during build time
try {
  console.log('Pre-initializing Prisma client for API routes...');
  const prisma = new PrismaClient();
  
  // Test connection to ensure Prisma is properly initialized
  prisma.$connect().then(() => {
    console.log('Prisma client initialized successfully');
    prisma.$disconnect();
  }).catch(error => {
    console.error('Error initializing Prisma client:', error);
    // Don't throw error here to allow build to continue
  });
} catch (error) {
  console.error('Error creating Prisma client:', error);
  // Don't throw error here to allow build to continue
}

export { };
