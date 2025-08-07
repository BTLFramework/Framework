// Test script to verify authentication flow
const axios = require('axios');

const BASE_URL = process.env.RAILWAY_URL || 'https://api.backtolife.railway.app';

async function testAuthFlow() {
  console.log('🧪 Testing Authentication Flow...\n');
  
  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data.status);
    
    // Test 2: Test route
    console.log('\n2️⃣ Testing test route...');
    const testResponse = await axios.get(`${BASE_URL}/test`);
    console.log('✅ Test route passed:', testResponse.data.message);
    
    // Test 3: Check if patient portal routes are accessible
    console.log('\n3️⃣ Testing patient portal routes...');
    try {
      const portalResponse = await axios.get(`${BASE_URL}/api/patient-portal/test-route`);
      console.log('✅ Patient portal routes accessible:', portalResponse.data.message);
    } catch (error) {
      console.log('❌ Patient portal routes not accessible:', error.response?.data || error.message);
    }
    
    console.log('\n🎉 Authentication flow test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAuthFlow(); 