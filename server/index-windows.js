// Windows-compatible server entry point
// This file bypasses ESM URL scheme issues by using CommonJS

const { createRequire } = require('module');
const path = require('path');
const fs = require('fs');

// Set environment
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

console.log('🚀 Starting Sportzal Fitness (Windows Compatible)...');
console.log('📁 Working directory:', process.cwd());
console.log('🔧 Environment:', process.env.NODE_ENV);

// Check for .env file
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  .env file not found');
  const envExamplePath = path.join(process.cwd(), '.env.example');
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('📝 Created .env from template');
  }
}

// Load environment variables
require('dotenv').config();

// Start the server using ts-node or tsx
async function startServer() {
  try {
    // Method 1: Try with ts-node
    try {
      require('ts-node/register');
      require('./index.ts');
      return;
    } catch (error) {
      console.log('ts-node not available, trying alternative...');
    }

    // Method 2: Use esbuild-register for TypeScript
    try {
      require('esbuild-register');
      require('./index.ts');
      return;
    } catch (error) {
      console.log('esbuild-register not available, trying compiled version...');
    }

    // Method 3: Check if compiled version exists
    const compiledPath = path.join(__dirname, '../dist/index.js');
    if (fs.existsSync(compiledPath)) {
      require(compiledPath);
      return;
    }

    // Method 4: Use child_process to run with tsx
    const { spawn } = require('child_process');
    console.log('Using tsx via child process...');
    
    const child = spawn('npx', ['tsx', path.join(__dirname, 'index.ts')], {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, NODE_ENV: 'development' }
    });

    child.on('error', (error) => {
      console.error('Failed to start server:', error);
      process.exit(1);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();