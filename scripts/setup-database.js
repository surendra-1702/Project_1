#!/usr/bin/env node

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq } from 'drizzle-orm';
import ws from 'ws';
import bcrypt from 'bcrypt';
import 'dotenv/config';

// Configure Neon
neonConfig.webSocketConstructor = ws;

console.log('🚀 Setting up Sportzal Fitness database...');

async function setupDatabase() {
  try {
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL environment variable is required');
      console.log('Please set DATABASE_URL in your .env file');
      process.exit(1);
    }

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    // Define schema tables inline to avoid import issues
    const usersTable = {
      id: 'string',
      username: 'string',
      email: 'string',
      password: 'string',
      firstName: 'string',
      lastName: 'string',
      age: 'number',
      height: 'number',
      weight: 'number',
      gender: 'string',
      fitnessGoal: 'string',
      activityLevel: 'string',
      role: 'string'
    };
    
    const db = drizzle({ client: pool });

    console.log('✅ Database connection established');

    // Test the connection
    const result = await pool.query('SELECT NOW() as current_time');
    console.log('✅ Database test query successful:', result.rows[0].current_time);

    // Check if admin user already exists
    try {
      const existingAdmin = await pool.query(`
        SELECT email FROM users WHERE email = 'admin@sportzalfitness.com' LIMIT 1
      `);
      
      if (existingAdmin.rows.length === 0) {
        // Create default admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        await pool.query(`
          INSERT INTO users (
            id, username, email, password, "firstName", "lastName", 
            age, height, weight, gender, "fitnessGoal", "activityLevel", role, "createdAt"
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        `, [
          `admin_${Date.now()}`,
          'admin',
          'admin@sportzalfitness.com',
          hashedPassword,
          'Admin',
          'User',
          30,
          175,
          70,
          'male',
          'general fitness',
          'moderate',
          'admin',
          new Date()
        ]);

        console.log('✅ Default admin user created: admin@sportzalfitness.com');
      } else {
        console.log('✅ Admin user already exists');
      }
    } catch (userError) {
      console.log('⚠️  Could not create admin user (tables may not exist yet)');
      console.log('   Run: npm run db:push to create tables first');
    }

    await pool.end();
    console.log('🎉 Database setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Open: http://localhost:5000');
    console.log('3. Login with: admin@sportzalfitness.com / admin123');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your DATABASE_URL in .env file');
    console.log('2. Ensure PostgreSQL is running');
    console.log('3. Verify database exists and is accessible');
    process.exit(1);
  }
}

setupDatabase();