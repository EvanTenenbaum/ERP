// Script to update all API routes to use dynamic Prisma imports
// This will be executed on all API route files

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get all API route files
const apiDir = path.join(__dirname, 'app', 'api');
const routeFiles = execSync(`find ${apiDir} -name "*.js"`).toString().split('\n').filter(Boolean);

console.log(`Found ${routeFiles.length} API route files to update`);

// Counter for modified files
let modifiedCount = 0;

// Process each file
routeFiles.forEach(filePath => {
  try {
    // Read file content
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file imports prisma
    if (content.includes('import prisma from') || content.includes('import { prisma }')) {
      // Replace static imports with dynamic imports
      let modified = content;
      
      // Replace direct prisma imports
      modified = modified.replace(
        /import\s+(\{\s*)?prisma(\s*\})?\s+from\s+['"]@\/lib\/prisma.*?['"]/g, 
        "import { getPrismaClient } from '@/lib/dynamic-prisma'"
      );
      
      modified = modified.replace(
        /import\s+prisma\s+from\s+['"]@\/lib\/.*?['"]/g, 
        "import { getPrismaClient } from '@/lib/dynamic-prisma'"
      );
      
      // If the content was modified, we need to also update prisma usage
      if (modified !== content) {
        // Find all prisma usages and replace with await getPrismaClient()
        // This is a simplified approach and might need manual review
        modified = modified.replace(/(\s|^)prisma\./g, function(match, p1) {
          // Don't replace if it's already in an await getPrismaClient() context
          const prevChars = modified.substring(Math.max(0, modified.indexOf(match) - 30), modified.indexOf(match));
          if (prevChars.includes('await getPrismaClient()')) {
            return match;
          }
          return `${p1}(await getPrismaClient()).`;
        });
        
        // Write the modified content back
        fs.writeFileSync(filePath, modified, 'utf8');
        modifiedCount++;
        console.log(`Updated: ${filePath}`);
      }
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
});

console.log(`Updated ${modifiedCount} API route files to use dynamic Prisma imports`);
