/**
 * Prisma client singleton for Next.js
 * 
 * This follows the official Prisma best practices for Next.js applications
 * to ensure proper initialization and connection pooling.
 * 
 * Reference: https://www.prisma.io/docs/guides/nextjs
 */

import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global;

// Check if we already have a PrismaClient instance, if not create one
export const prisma = globalForPrisma.prisma || 
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// If we're not in production, attach the PrismaClient instance to the global object
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
