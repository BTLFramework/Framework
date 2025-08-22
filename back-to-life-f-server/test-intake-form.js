async function testIntakeForm() {
  console.log('🧪 Testing Intake Form Submission...\n');
  
  const testData = {
    patientName: "Test Patient",
    email: "test@example.com",
    dob: "1990-01-01",
    region: "Back",
    vas: 6,
    confidence: 7,
    psfs: [
      { activity: 'Computer work', score: 5 },
      { activity: 'Driving', score: 4 },
      { activity: 'Sleeping', score: 6 },
      { activity: 'Standing', score: 3 },
      { activity: 'Walking', score: 4 }
    ],
    beliefs: ["I'm afraid to move because it might make my pain worse"],
    formType: 'Intake',
    date: new Date().toISOString()
  };

  try {
    console.log('📤 Sending test data to patient portal...');
    const response = await fetch('http://localhost:3001/patients/submit-intake', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Intake form submission successful!');
      console.log('📊 Response data:');
      console.log(`   - Patient: ${result.data.patient?.name || 'N/A'}`);
      console.log(`   - SRS Score: ${result.data.srsScore}/11`);
      console.log(`   - Phase: ${result.data.phase}`);
      console.log(`   - Disability: ${result.data.disabilityPercentage}%`);
      console.log(`   - Message: ${result.message}`);
    } else {
      console.log('❌ Intake form submission failed:');
      console.log(`   - Error: ${result.error}`);
      console.log(`   - Message: ${result.message}`);
    }
  } catch (error) {
    console.log('❌ Test failed with error:', error.message);
  }
}

// Run the test
testIntakeForm(); 