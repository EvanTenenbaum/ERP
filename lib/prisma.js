/**
 * Direct Prisma client export for Vercel deployment
 * 
 * This approach avoids using global objects which can be problematic
 * during the Next.js build process on Vercel.
 */

import { PrismaClient } from '@prisma/client';

// Create a new PrismaClient instance directly
const prisma = new PrismaClient();

export { prisma };
export default prisma;
