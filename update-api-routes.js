// Script to update all API routes to use the simplified Prisma client
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

// Function to update a file to use the simplified Prisma client
async function updateFile(filePath) {
  try {
    // Read the file content
    const content = await readFileAsync(filePath, 'utf8');
    
    // Check if the file imports from dynamic-prisma
    if (content.includes('dynamic-prisma')) {
      console.log(`Updating ${filePath}`);
      
      // Replace dynamic import with simplified Prisma client
      let updatedContent = content
        .replace(/import\s+{\s*getPrismaClient\s*}\s+from\s+['"]@\/lib\/dynamic-prisma['"];?/g, 
                 `import { prisma } from '@/lib/prisma';`)
        .replace(/import\s+.*\s+from\s+['"]@\/lib\/dynamic-prisma['"];?/g, 
                 `import { prisma } from '@/lib/prisma';`);
      
      // Replace all instances of getPrismaClient() with prisma
      updatedContent = updatedContent
        .replace(/const\s+prisma\s+=\s+await\s+getPrismaClient\(\);?/g, 
                 `// Using simplified Prisma client singleton`)
        .replace(/await\s+getPrismaClient\(\)/g, 
                 `prisma`);
      
      // Write the updated content back to the file
      await writeFileAsync(filePath, updatedContent, 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
    return false;
  }
}

// Function to recursively find and update all API route files
async function updateApiRoutes(directory) {
  const files = fs.readdirSync(directory, { withFileTypes: true });
  let updatedCount = 0;
  
  for (const file of files) {
    const fullPath = path.join(directory, file.name);
    
    if (file.isDirectory()) {
      // Recursively process subdirectories
      updatedCount += await updateApiRoutes(fullPath);
    } else if (file.name.endsWith('.js') && file.name.includes('route')) {
      // Update API route files
      const updated = await updateFile(fullPath);
      if (updated) updatedCount++;
    }
  }
  
  return updatedCount;
}

// Main function
async function main() {
  console.log('Updating API routes to use simplified Prisma client...');
  const apiDirectory = path.join(__dirname, 'app', 'api');
  const updatedCount = await updateApiRoutes(apiDirectory);
  console.log(`Updated ${updatedCount} API route files.`);
}

main().catch(console.error);
