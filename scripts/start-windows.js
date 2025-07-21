#!/usr/bin/env node

// Windows-compatible startup script for Sportzal Fitness
// This fixes ESM URL scheme issues on Windows

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set environment variables
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Resolve the server file path properly for Windows
const serverPath = path.resolve(__dirname, '../server/index.ts');

console.log('🚀 Starting Sportzal Fitness on Windows...');
console.log('📁 Server path:', serverPath);
console.log('🔧 Environment:', process.env.NODE_ENV);

// Start the server with tsx
const child = spawn('npx', ['tsx', serverPath], {
  stdio: 'inherit',
  shell: true,
  cwd: path.resolve(__dirname, '..')
});

child.on('error', (error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

child.on('exit', (code) => {
  console.log(`Server exited with code ${code}`);
  process.exit(code || 0);
});