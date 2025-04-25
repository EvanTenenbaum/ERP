// This file configures the initialization of Prisma for the Vercel build process
// It ensures Prisma is properly generated before any imports

const { execSync } = require('child_process');

try {
  // Run prisma generate explicitly before any imports
  console.log('Running prisma generate before build...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Prisma client generated successfully');
} catch (error) {
  console.error('Error generating Prisma client:', error);
  process.exit(1);
}
