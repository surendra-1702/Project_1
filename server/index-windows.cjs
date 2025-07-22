// Windows-compatible server entry point using CommonJS
// This file bypasses ESM URL scheme issues completely

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

// Start the server using different methods
async function startServer() {
  try {
    // Method 1: Try with ts-node
    console.log('Method 1: Trying ts-node...');
    try {
      require('ts-node/register');
      require('./index.ts');
      return;
    } catch (error) {
      console.log('ts-node failed, trying next method...');
    }

    // Method 2: Use esbuild-register for TypeScript
    console.log('Method 2: Trying esbuild-register...');
    try {
      require('esbuild-register');
      require('./index.ts');
      return;
    } catch (error) {
      console.log('esbuild-register failed, trying next method...');
    }

    // Method 3: Build and run compiled version
    console.log('Method 3: Trying to build and run...');
    const { execSync } = require('child_process');
    try {
      execSync('npm run build', { stdio: 'inherit' });
      const compiledPath = path.join(__dirname, '../dist/index.js');
      if (fs.existsSync(compiledPath)) {
        require(compiledPath);
        return;
      }
    } catch (error) {
      console.log('Build method failed, trying final method...');
    }

    // Method 4: Use child_process to run with tsx
    console.log('Method 4: Using tsx via child process...');
    const { spawn } = require('child_process');
    
    const child = spawn('npx', ['tsx', path.join(__dirname, 'index.ts')], {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, NODE_ENV: 'development' }
    });

    child.on('error', (error) => {
      console.error('Failed to start server with all methods:', error);
      console.log('\n🆘 Try these alternatives:');
      console.log('1. npm run build && npm start');
      console.log('2. npx ts-node server/index.ts');
      console.log('3. Install tsx globally: npm install -g tsx');
      process.exit(1);
    });

    child.on('exit', (code) => {
      if (code !== 0) {
        console.log(`Server exited with code ${code}`);
      }
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();