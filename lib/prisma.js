// Simplified Prisma client initialization for Next.js API routes
// This approach ensures Prisma is properly initialized during build and runtime

import { PrismaClient } from '@prisma/client';

// Create a wrapper function that safely initializes Prisma
// This prevents errors during build time when database isn't available
function createPrismaClient() {
  // Check if we're in a Node.js environment (not during static build)
  if (typeof window === 'undefined') {
    try {
      // Create a new PrismaClient instance with appropriate logging
      return new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      });
    } catch (e) {
      // If initialization fails (likely during build), return a mock client
      console.warn('Prisma initialization failed, using mock client');
      return createMockPrismaClient();
    }
  }
  
  // For client-side, return a mock client
  return createMockPrismaClient();
}

// Create a mock Prisma client for build time and client-side
function createMockPrismaClient() {
  return {
    $connect: async () => {},
    $disconnect: async () => {},
    $transaction: async (fn) => await fn({}),
    user: {
      findUnique: async () => null,
      findFirst: async () => null,
      findMany: async () => [],
      create: async () => ({}),
      update: async () => ({}),
    },
    customer: {
      findUnique: async () => null,
      findFirst: async () => null,
      findMany: async () => [],
    },
    // Add other models as needed
  };
}

// Use a global singleton pattern to avoid multiple instances
const globalForPrisma = global;
export const prisma = globalForPrisma.prisma || createPrismaClient();

// Only set the global variable in non-production environments
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
