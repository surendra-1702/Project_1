#!/usr/bin/env node

// Ultimate Windows ESM fix for Sportzal Fitness
// This script bypasses all Windows ESM URL scheme issues

import { spawn } from 'child_process';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting Sportzal Fitness (Windows Compatible)...');

// Set environment variables
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Check if .env exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  const envExamplePath = path.join(__dirname, '.env.example');
  if (fs.existsSync(envExamplePath)) {
    console.log('📝 Creating .env from template...');
    fs.copyFileSync(envExamplePath, envPath);
    console.log('⚠️  Please edit .env file with your database credentials');
  } else {
    console.error('❌ No .env or .env.example found');
    process.exit(1);
  }
}

// Check Node modules
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies...');
  const installProcess = spawn('npm', ['install'], {
    stdio: 'inherit',
    shell: true,
    cwd: __dirname
  });
  
  installProcess.on('exit', (code) => {
    if (code === 0) {
      startServer();
    } else {
      console.error('❌ Failed to install dependencies');
      process.exit(1);
    }
  });
} else {
  startServer();
}

function startServer() {
  console.log('🏃 Starting development server...');
  console.log('🌐 Server will be available at: http://localhost:5000');
  console.log('👤 Admin login: admin@sportzalfitness.com / admin123');
  console.log('');

  // Try different methods to start the server
  const methods = [
    // Method 1: Use node with tsx loader
    ['node', ['--loader', 'tsx/esm', 'server/index.ts']],
    // Method 2: Use npx tsx directly
    ['npx', ['tsx', 'server/index.ts']],
    // Method 3: Use cross-env with tsx
    ['npx', ['cross-env', 'NODE_ENV=development', 'tsx', 'server/index.ts']],
  ];

  let methodIndex = 0;

  function tryMethod() {
    if (methodIndex >= methods.length) {
      console.error('❌ All startup methods failed. Check TROUBLESHOOTING.md');
      process.exit(1);
    }

    const [command, args] = methods[methodIndex];
    console.log(`🔄 Trying method ${methodIndex + 1}: ${command} ${args.join(' ')}`);

    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      cwd: __dirname,
      env: {
        ...process.env,
        NODE_ENV: 'development'
      }
    });

    child.on('error', (error) => {
      console.error(`Method ${methodIndex + 1} failed:`, error.message);
      methodIndex++;
      setTimeout(tryMethod, 1000);
    });

    child.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Method ${methodIndex + 1} exited with code ${code}`);
        methodIndex++;
        setTimeout(tryMethod, 1000);
      }
    });
  }

  tryMethod();
}