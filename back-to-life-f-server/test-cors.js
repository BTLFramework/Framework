#!/usr/bin/env node

// CORS Test Script for Back to Life Server
// Run this to test CORS configuration

const https = require('https');

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'https://framework-production-92f5.up.railway.app'
];

const serverUrl = process.env.SERVER_URL || 'https://framework-production-92f5.up.railway.app';

console.log(`🧪 Testing CORS configuration for server: ${serverUrl}`);
console.log('=' .repeat(60));

allowedOrigins.forEach(origin => {
  console.log(`\n🔍 Testing origin: ${origin}`);
  
  const options = {
    hostname: new URL(serverUrl).hostname,
    port: 443,
    path: '/health',
    method: 'GET',
    headers: {
      'Origin': origin,
      'User-Agent': 'CORS-Test-Script'
    }
  };

  const req = https.request(options, (res) => {
    console.log(`   Status: ${res.statusCode}`);
    console.log(`   CORS Headers:`);
    console.log(`     Access-Control-Allow-Origin: ${res.headers['access-control-allow-origin'] || 'Not set'}`);
    console.log(`     Access-Control-Allow-Credentials: ${res.headers['access-control-allow-credentials'] || 'Not set'}`);
    
    if (res.statusCode === 200) {
      console.log(`   ✅ SUCCESS: Origin ${origin} is allowed`);
    } else {
      console.log(`   ❌ FAILED: Origin ${origin} is blocked`);
    }
  });

  req.on('error', (err) => {
    console.log(`   ❌ ERROR: ${err.message}`);
  });

  req.end();
});

console.log('\n🏁 CORS testing complete!');
console.log('\n💡 To enable debug mode, set DEBUG_CORS=true in your environment variables');
console.log('💡 This will allow all origins for troubleshooting');
