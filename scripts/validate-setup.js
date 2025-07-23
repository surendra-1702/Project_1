#!/usr/bin/env node

import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';

// Configure Neon
import { neonConfig } from '@neondatabase/serverless';
neonConfig.webSocketConstructor = ws;

console.log('🔍 Validating Sportzal Fitness setup...\n');

async function validateSetup() {
  const checks = [];
  
  // 1. Environment Variables
  console.log('📋 Checking environment variables...');
  const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
  const optionalEnvVars = ['DEEPSEEK_API_KEY'];
  
  requiredEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
      console.log(`✅ ${envVar} is set`);
      checks.push(true);
    } else {
      console.log(`❌ ${envVar} is missing`);
      checks.push(false);
    }
  });
  
  optionalEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
      console.log(`✅ ${envVar} is set (optional)`);
    } else {
      console.log(`⚠️  ${envVar} is not set (optional - fallback system will be used)`);
    }
  });

  // 2. Database Connection
  console.log('\n🗄️  Checking database connection...');
  try {
    if (!process.env.DATABASE_URL) {
      console.log('❌ Cannot test database - DATABASE_URL not set');
      checks.push(false);
    } else {
      const pool = new Pool({ connectionString: process.env.DATABASE_URL });
      const db = drizzle({ client: pool });
      
      // Test connection
      const result = await pool.query('SELECT NOW() as time, version() as version');
      console.log('✅ Database connection successful');
      console.log(`   Time: ${result.rows[0].time}`);
      console.log(`   Version: ${result.rows[0].version.split(' ')[0]}`);
      
      // Check tables exist
      const tables = ['users', 'workout_plans', 'workout_sessions', 'food_entries', 'weight_entries', 'sessions'];
      for (const table of tables) {
        try {
          await pool.query(`SELECT 1 FROM ${table} LIMIT 1`);
          console.log(`✅ Table '${table}' exists`);
        } catch (error) {
          console.log(`❌ Table '${table}' missing or inaccessible`);
          checks.push(false);
        }
      }
      
      await pool.end();
      checks.push(true);
    }
  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
    checks.push(false);
  }

  // 3. File Structure
  console.log('\n📁 Checking file structure...');
  const requiredDirs = [
    'client/src',
    'server', 
    'shared',
    'public'
  ];
  
  const requiredFiles = [
    'server/index.ts',
    'server/routes.ts',
    'server/auth.ts',
    'server/db.ts',
    'shared/schema.ts',
    'drizzle.config.ts',
    'vite.config.ts'
  ];

  requiredDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      console.log(`✅ Directory '${dir}' exists`);
      checks.push(true);
    } else {
      console.log(`❌ Directory '${dir}' missing`);
      checks.push(false);
    }
  });

  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ File '${file}' exists`);
      checks.push(true);
    } else {
      console.log(`❌ File '${file}' missing`);
      checks.push(false);
    }
  });

  // 4. Dependencies
  console.log('\n📦 Checking key dependencies...');
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const keyDeps = [
      'react', 'express', 'drizzle-orm', '@neondatabase/serverless',
      'vite', 'typescript', 'bcrypt', 'jsonwebtoken'
    ];
    
    keyDeps.forEach(dep => {
      if (packageJson.dependencies[dep] || packageJson.devDependencies?.[dep]) {
        console.log(`✅ ${dep} is installed`);
        checks.push(true);
      } else {
        console.log(`❌ ${dep} is missing`);
        checks.push(false);
      }
    });
  } catch (error) {
    console.log('❌ Cannot read package.json:', error.message);
    checks.push(false);
  }

  // 5. Exercise Assets
  console.log('\n🏃‍♂️ Checking exercise assets...');
  const exerciseDirs = [
    'public/exercises/chest',
    'public/exercises/back', 
    'public/exercises/shoulders',
    'public/exercises/legs',
    'public/exercises/abs'
  ];

  let assetCount = 0;
  exerciseDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir).filter(f => f.endsWith('.gif'));
      console.log(`✅ ${dir}: ${files.length} GIF files`);
      assetCount += files.length;
      checks.push(true);
    } else {
      console.log(`⚠️  ${dir}: directory missing`);
    }
  });

  console.log(`   Total exercise GIFs: ${assetCount}`);

  // Summary
  console.log('\n📊 Setup Validation Summary');
  console.log('================================');
  const passedChecks = checks.filter(c => c).length;
  const totalChecks = checks.length;
  const successRate = Math.round((passedChecks / totalChecks) * 100);
  
  console.log(`Passed: ${passedChecks}/${totalChecks} checks (${successRate}%)`);
  
  if (successRate >= 90) {
    console.log('🎉 Setup looks great! You should be ready to run the application.');
    console.log('\n🚀 To start the application:');
    console.log('   npm run dev');
  } else if (successRate >= 70) {
    console.log('⚠️  Setup is mostly complete but has some issues.');
    console.log('   The application may work but some features might be limited.');
  } else {
    console.log('❌ Setup has significant issues that need to be resolved.');
    console.log('   Please fix the failed checks before running the application.');
  }

  console.log('\n📚 For help:');
  console.log('   - Read README.md for detailed setup instructions');
  console.log('   - Check SETUP.md for troubleshooting guide');
  console.log('   - Ensure all environment variables are set in .env file');
}

validateSetup().catch(console.error);