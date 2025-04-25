// This script updates all import paths to use the @/ alias pattern
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);

// Function to recursively get all JS files
async function getJsFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.next') {
        files.push(...(await getJsFiles(fullPath)));
      }
    } else if (entry.name.endsWith('.js') || entry.name.endsWith('.jsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Function to update imports in a file
async function updateImports(filePath) {
  const content = await readFile(filePath, 'utf8');
  
  // Replace relative imports to lib with @/lib
  // This regex handles any number of ../ patterns
  const updatedContent = content.replace(
    /from ['"](\.\.\/?)+lib\/(.*?)['"]/g, 
    'from \'@/lib/$2\''
  );
  
  if (content !== updatedContent) {
    await writeFile(filePath, updatedContent, 'utf8');
    console.log(`Updated imports in ${filePath}`);
    return true;
  }
  
  return false;
}

// Main function
async function main() {
  const rootDir = process.cwd();
  const jsFiles = await getJsFiles(rootDir);
  
  let updatedCount = 0;
  
  for (const file of jsFiles) {
    const updated = await updateImports(file);
    if (updated) {
      updatedCount++;
    }
  }
  
  console.log(`Updated imports in ${updatedCount} files`);
}

main().catch(console.error);
