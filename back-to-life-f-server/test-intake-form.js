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
    const response = await fetch('https://backend-production-3545.up.railway.app/patients/submit-intake', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    console.log('📊 Full response data:');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('✅ Intake form submission successful!');
      console.log('📊 Response data:');
      console.log(`   - Patient: ${result.data?.patient?.name || result.patient?.name || 'N/A'}`);
      console.log(`   - SRS Score: ${result.data?.srsScore || result.srsScore || 'N/A'}/11`);
      console.log(`   - Phase: ${result.data?.phase || result.phase || 'N/A'}`);
      console.log(`   - Disability: ${result.data?.disabilityPercentage || result.disabilityPercentage || 'N/A'}%`);
      console.log(`   - Message: ${result.message || 'N/A'}`);
    } else {
      console.log('❌ Intake form submission failed:');
      console.log(`   - Error: ${result.error || 'Unknown error'}`);
      console.log(`   - Message: ${result.message || 'No message'}`);
    }
  } catch (error) {
    console.log('❌ Test failed with error:', error.message);
  }
}

// Run the test
testIntakeForm(); 