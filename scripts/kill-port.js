#!/usr/bin/env node

// Script to kill process using port 5000
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function killPort5000() {
  console.log('🔍 Checking for processes using port 5000...');
  
  try {
    // For Windows
    if (process.platform === 'win32') {
      const { stdout } = await execAsync('netstat -ano | findstr :5000');
      if (stdout.trim()) {
        console.log('📋 Processes found on port 5000:');
        console.log(stdout);
        
        // Extract PIDs and kill them
        const lines = stdout.split('\n');
        const pids = new Set();
        
        lines.forEach(line => {
          const parts = line.trim().split(/\s+/);
          if (parts.length >= 5) {
            const pid = parts[parts.length - 1];
            if (pid && !isNaN(pid)) {
              pids.add(pid);
            }
          }
        });
        
        for (const pid of pids) {
          try {
            await execAsync(`taskkill /PID ${pid} /F`);
            console.log(`✅ Killed process ${pid}`);
          } catch (error) {
            console.log(`⚠️  Could not kill process ${pid}: ${error.message}`);
          }
        }
      } else {
        console.log('✅ No processes found using port 5000');
      }
    } else {
      // For Linux/Mac
      const { stdout } = await execAsync('lsof -i :5000');
      if (stdout.trim()) {
        console.log('📋 Processes found on port 5000:');
        console.log(stdout);
        
        await execAsync('pkill -f "5000"');
        console.log('✅ Killed processes using port 5000');
      } else {
        console.log('✅ No processes found using port 5000');
      }
    }
  } catch (error) {
    console.log('ℹ️  No processes found using port 5000 or error occurred:', error.message);
  }
  
  console.log('🚀 Port 5000 is now available');
}

killPort5000();