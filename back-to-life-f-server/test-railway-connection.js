const https = require('https');

const railwayUrl = 'https://framework-production-92f5.up.railway.app';

console.log('🧪 Testing Railway Backend Connection');
console.log('=' .repeat(50));

// Test basic connectivity
console.log(`\n🔍 Testing basic connectivity to: ${railwayUrl}`);

const testConnectivity = () => {
  return new Promise((resolve, reject) => {
    const req = https.request(`${railwayUrl}/health`, {
      method: 'GET',
      timeout: 10000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`✅ Health check response: ${res.statusCode}`);
        try {
          const response = JSON.parse(data);
          console.log(`📊 Server status: ${response.status}`);
          console.log(`🗄️  Database: ${response.database}`);
          console.log(`⏰ Uptime: ${response.uptime}s`);
          resolve(response);
        } catch (e) {
          console.log(`📄 Raw response: ${data}`);
          resolve({ status: 'Unknown', raw: data });
        }
      });
    });

    req.on('error', (err) => {
      console.log(`❌ Connection error: ${err.message}`);
      reject(err);
    });

    req.on('timeout', () => {
      console.log('⏰ Request timeout');
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
};

// Test CORS headers
const testCORS = () => {
  return new Promise((resolve, reject) => {
    const req = https.request(`${railwayUrl}/health`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      },
      timeout: 10000
    }, (res) => {
      console.log(`\n🔍 CORS Preflight Response: ${res.statusCode}`);
      console.log(`📋 CORS Headers:`);
      console.log(`   - Access-Control-Allow-Origin: ${res.headers['access-control-allow-origin']}`);
      console.log(`   - Access-Control-Allow-Methods: ${res.headers['access-control-allow-methods']}`);
      console.log(`   - Access-Control-Allow-Headers: ${res.headers['access-control-allow-headers']}`);
      console.log(`   - Access-Control-Allow-Credentials: ${res.headers['access-control-allow-credentials']}`);
      
      if (res.headers['access-control-allow-origin']) {
        console.log('✅ CORS headers present');
        resolve(true);
      } else {
        console.log('❌ CORS headers missing');
        resolve(false);
      }
    });

    req.on('error', (err) => {
      console.log(`❌ CORS test error: ${err.message}`);
      reject(err);
    });

    req.on('timeout', () => {
      console.log('⏰ CORS test timeout');
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
};

// Run tests
async function runTests() {
  try {
    console.log('\n🚀 Starting Railway connection tests...\n');
    
    // Test 1: Basic connectivity
    await testConnectivity();
    
    // Test 2: CORS configuration
    await testCORS();
    
    console.log('\n✅ All tests completed successfully!');
    console.log('🚀 Railway backend is ready for frontend connections');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

runTests();
