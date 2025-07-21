// Windows-compatible server starter
// This fixes the ESM URL scheme error on Windows

import { createRequire } from 'module';
import { pathToFileURL } from 'url';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set environment
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

console.log('🚀 Starting Sportzal Fitness server...');
console.log('📁 Working directory:', process.cwd());
console.log('🔧 Environment:', process.env.NODE_ENV);

// Import and start the server
try {
  const serverPath = path.resolve(__dirname, 'index.ts');
  const serverUrl = pathToFileURL(serverPath).href;
  
  console.log('📂 Server file:', serverPath);
  console.log('🔗 Server URL:', serverUrl);
  
  // Dynamic import with proper file URL
  const { default: startServer } = await import(serverUrl);
  
  if (typeof startServer === 'function') {
    await startServer();
  } else {
    console.log('✅ Server module loaded successfully');
  }
} catch (error) {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
}