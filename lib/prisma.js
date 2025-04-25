/**
 * Prisma client singleton for Vercel deployment
 * 
 * This approach ensures Prisma is properly initialized before use
 * and handles the Next.js development server's hot reloading.
 * 
 * This file re-exports the TypeScript implementation for JavaScript files.
 */

import { prisma } from './prisma-client';

export { prisma };
export default prisma;
