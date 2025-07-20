#!/usr/bin/env node

import http from 'http';
import 'dotenv/config';

console.log('🏥 Checking application health...');

const PORT = process.env.PORT || 5000;
const HOST = 'localhost';

function checkEndpoint(path, description) {
  return new Promise((resolve) => {
    const options = {
      hostname: HOST,
      port: PORT,
      path: path,
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`✅ ${description}: ${res.statusCode} ${res.statusMessage}`);
          resolve(true);
        } else {
          console.log(`❌ ${description}: ${res.statusCode} ${res.statusMessage}`);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${description}: ${error.message}`);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log(`⏰ ${description}: Request timeout`);
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

async function healthCheck() {
  console.log(`Checking server at http://${HOST}:${PORT}\n`);

  const checks = [
    { path: '/', description: 'Frontend (Root page)' },
    { path: '/api/health', description: 'API Health endpoint' },
    { path: '/api/exercises', description: 'Exercise API' },
  ];

  let passed = 0;
  const total = checks.length;

  for (const check of checks) {
    const result = await checkEndpoint(check.path, check.description);
    if (result) passed++;
    
    // Small delay between checks
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n📊 Health Check Summary');
  console.log('=======================');
  console.log(`Passed: ${passed}/${total} checks`);
  
  if (passed === total) {
    console.log('🎉 All health checks passed! Application is running correctly.');
  } else if (passed > 0) {
    console.log('⚠️  Some checks failed. Application may have limited functionality.');
  } else {
    console.log('❌ All checks failed. Application is not running or not accessible.');
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the server is running: npm run dev');
    console.log(`2. Check if port ${PORT} is accessible`);
    console.log('3. Look for error messages in the server logs');
  }
}

// Check if server is accessible first
const testReq = http.request({
  hostname: HOST,
  port: PORT,
  path: '/',
  method: 'HEAD',
  timeout: 2000
}, () => {
  healthCheck();
});

testReq.on('error', () => {
  console.log(`❌ Server is not running on http://${HOST}:${PORT}`);
  console.log('\n🚀 To start the server:');
  console.log('   npm run dev');
  console.log('\n⚠️  If the server is running on a different port, set PORT environment variable');
});

testReq.on('timeout', () => {
  console.log(`⏰ Server connection timeout on http://${HOST}:${PORT}`);
  testReq.destroy();
});

testReq.end();