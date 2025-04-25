/**
 * Prisma client initialization helper
 * 
 * This file ensures that all API routes use the same Prisma client instance
 * and that it's properly initialized before use.
 */

import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

// Use a namespace to avoid conflicts with other global variables
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Check if we already have a PrismaClient instance, if not create one
export const prisma = globalForPrisma.prisma || 
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// If we're not in production, attach the PrismaClient instance to the global object
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
