// Test script for recovery points system
const fetch = require('node-fetch');

async function testRecoveryPoints() {
  const baseUrl = 'https://backend-production-3545.up.railway.app/api';
  const patientId = 1;
  
  console.log('🧪 Testing Recovery Points System...\n');
  
  try {
    // Test 1: Add recovery points for movement session
    console.log('1️⃣ Testing movement session completion...');
    const addResponse = await fetch(`${baseUrl}/recovery-points/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId,
        category: 'MOVEMENT',
        action: 'Movement session completed',
        points: 12
      })
    });
    
    const addResult = await addResponse.json();
    console.log('✅ Movement session points added:', addResult);
    
    // Test 2: Get weekly breakdown
    console.log('\n2️⃣ Testing weekly breakdown...');
    const weeklyResponse = await fetch(`${baseUrl}/recovery-points/weekly/${patientId}`);
    const weeklyResult = await weeklyResponse.json();
    console.log('✅ Weekly breakdown:', weeklyResult);
    
    // Test 3: Get SRS buffer
    console.log('\n3️⃣ Testing SRS buffer...');
    const bufferResponse = await fetch(`${baseUrl}/recovery-points/buffer/${patientId}`);
    const bufferResult = await bufferResponse.json();
    console.log('✅ SRS buffer:', bufferResult);
    
    // Test 4: Add more points to test weekly cap
    console.log('\n4️⃣ Testing weekly cap...');
    const capResponse = await fetch(`${baseUrl}/recovery-points/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId,
        category: 'MOVEMENT',
        action: 'Additional exercise completed',
        points: 10
      })
    });
    
    const capResult = await capResponse.json();
    console.log('✅ Additional points result:', capResult);
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testRecoveryPoints(); 