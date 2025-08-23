#!/usr/bin/env node

/**
 * Back to Life - Complete Integration Test
 * 
 * This script tests the complete integration flow:
 * 1. Patient submits intake form (simulated)
 * 2. Data flows through Patient Portal API
 * 3. Backend processes and stores data
 * 4. Clinician Dashboard fetches and displays data
 */

const fetch = require('node-fetch');

// Test configuration
const config = {
  patientPortal: 'http://localhost:3000',
      backendServer: 'https://framework-production-92f5.up.railway.app',
  clinicianDashboard: 'http://localhost:5178'
};

// Sample comprehensive intake form data
const sampleIntakeData = {
  // Patient Information
  patientName: "Sarah Johnson",
  email: "sarah.johnson.test@email.com",
  date: new Date().toISOString(),
  formType: "Intake",
  region: "Lower Back",
  
  // Disability Index Arrays (ODI for Lower Back)
  odi: [3, 2, 4, 3, 2, 3, 4, 2, 3, 2], // Total: 28/50 = 56% disability
  
  // Pain and Function Assessment
  vas: 7, // High pain level
  psfs: [
    { activity: "Lifting groceries", score: 3 },
    { activity: "Sitting at desk", score: 4 },
    { activity: "Playing with children", score: 2 }
  ],
  
  // Cognitive Assessment
  beliefs: [
    "I worry my body is damaged or fragile",
    "I avoid movement because I fear it will make things worse"
  ],
  confidence: 4, // Low confidence
  
  // Follow-up specific (N/A for intake)
  groc: 0
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n${step} ${message}`, 'cyan');
  log('─'.repeat(60), 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Test functions
async function testBackendHealth() {
  logStep('🔧', 'Testing Backend Server Health');
  
  try {
    const response = await fetch(`${config.backendServer}/test`);
    const data = await response.json();
    
    if (response.ok) {
      logSuccess(`Backend server is running: ${data.message}`);
      return true;
    } else {
      logError(`Backend server health check failed: ${response.status}`);
      return false;
    }
  } catch (error) {
    logError(`Cannot connect to backend server: ${error.message}`);
    logInfo(`Make sure backend server is running on ${config.backendServer}`);
    return false;
  }
}

async function testIntakeSubmission() {
  logStep('📝', 'Testing Intake Form Submission');
  
  try {
    logInfo(`Submitting sample intake data for: ${sampleIntakeData.patientName}`);
    
    // Submit to patient portal API (which forwards to backend)
    const response = await fetch(`${config.patientPortal}/api/intake`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sampleIntakeData)
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      logSuccess('Intake form submitted successfully');
      logInfo(`Patient created: ${result.data.patient.name} (ID: ${result.data.patient.id})`);
      logInfo(`SRS Score: ${result.data.srsScore}`);
      logInfo(`Recovery Phase: ${result.data.phase}`);
      logInfo(`Disability Percentage: ${result.data.disabilityPercentage}%`);
      logInfo(`Belief Status: ${result.data.beliefStatus}`);
      
      return {
        success: true,
        patientId: result.data.patient.id,
        patientEmail: result.data.patient.email,
        data: result.data
      };
    } else {
      logError(`Intake submission failed: ${result.error || 'Unknown error'}`);
      return { success: false };
    }
  } catch (error) {
    logError(`Intake submission error: ${error.message}`);
    return { success: false };
  }
}

async function testClinicianDashboardData() {
  logStep('👩‍⚕️', 'Testing Clinician Dashboard Data Retrieval');
  
  try {
    const response = await fetch(`${config.backendServer}/patients`);
    const patients = await response.json();
    
    if (response.ok && Array.isArray(patients)) {
      logSuccess(`Retrieved ${patients.length} patients from database`);
      
      // Find our test patient
      const testPatient = patients.find(p => p.email === sampleIntakeData.email);
      
      if (testPatient) {
        logSuccess('Test patient found in clinician dashboard data');
        logInfo(`Patient: ${testPatient.name}`);
        logInfo(`SRS Score: ${testPatient.srs}`);
        logInfo(`Phase: ${testPatient.phase}`);
        logInfo(`Region: ${testPatient.region}`);
        logInfo(`Disability Index: ${testPatient.disabilityIndex}%`);
        logInfo(`Pain Score: ${testPatient.painScore}`);
        logInfo(`Confidence: ${testPatient.confidence}`);
        logInfo(`PSFS Activities: ${testPatient.psfs.length}`);
        logInfo(`Beliefs: ${testPatient.beliefs.length} selected`);
        logInfo(`Belief Status: ${testPatient.beliefStatus}`);
        
        return { success: true, patient: testPatient };
      } else {
        logError('Test patient not found in clinician dashboard data');
        return { success: false };
      }
    } else {
      logError(`Failed to retrieve patients: ${response.status}`);
      return { success: false };
    }
  } catch (error) {
    logError(`Clinician dashboard data retrieval error: ${error.message}`);
    return { success: false };
  }
}

async function testDataIntegrity(submissionResult, dashboardResult) {
  logStep('🔍', 'Testing Data Integrity Across Systems');
  
  if (!submissionResult.success || !dashboardResult.success) {
    logError('Cannot test data integrity - previous tests failed');
    return false;
  }
  
  const submitted = submissionResult.data;
  const retrieved = dashboardResult.patient;
  
  // Test key data points
  const tests = [
    {
      name: 'Patient Name',
      submitted: submitted.patient.name,
      retrieved: retrieved.name,
      match: submitted.patient.name === retrieved.name
    },
    {
      name: 'Email',
      submitted: submitted.patient.email,
      retrieved: retrieved.email,
      match: submitted.patient.email === retrieved.email
    },
    {
      name: 'Recovery Phase',
      submitted: submitted.phase,
      retrieved: retrieved.phase,
      match: submitted.phase === retrieved.phase
    },
    {
      name: 'Region',
      submitted: sampleIntakeData.region,
      retrieved: retrieved.region,
      match: sampleIntakeData.region === retrieved.region
    },
    {
      name: 'Pain Score (VAS)',
      submitted: sampleIntakeData.vas,
      retrieved: retrieved.painScore,
      match: sampleIntakeData.vas === retrieved.painScore
    },
    {
      name: 'Confidence Level',
      submitted: sampleIntakeData.confidence,
      retrieved: retrieved.confidence,
      match: sampleIntakeData.confidence === retrieved.confidence
    },
    {
      name: 'PSFS Activities Count',
      submitted: sampleIntakeData.psfs.length,
      retrieved: retrieved.psfs.length,
      match: sampleIntakeData.psfs.length === retrieved.psfs.length
    },
    {
      name: 'Beliefs Count',
      submitted: sampleIntakeData.beliefs.length,
      retrieved: retrieved.beliefs.length,
      match: sampleIntakeData.beliefs.length === retrieved.beliefs.length
    }
  ];
  
  let passedTests = 0;
  let totalTests = tests.length;
  
  tests.forEach(test => {
    if (test.match) {
      logSuccess(`${test.name}: ✓ (${test.submitted} = ${test.retrieved})`);
      passedTests++;
    } else {
      logError(`${test.name}: ✗ (${test.submitted} ≠ ${test.retrieved})`);
    }
  });
  
  const successRate = (passedTests / totalTests) * 100;
  
  if (successRate === 100) {
    logSuccess(`Data integrity test PASSED: ${passedTests}/${totalTests} tests passed`);
    return true;
  } else {
    logError(`Data integrity test FAILED: ${passedTests}/${totalTests} tests passed (${successRate.toFixed(1)}%)`);
    return false;
  }
}

async function cleanupTestData() {
  logStep('🧹', 'Cleaning Up Test Data');
  
  try {
    // Get all patients to find our test patient
    const response = await fetch(`${config.backendServer}/patients`);
    const patients = await response.json();
    
    const testPatient = patients.find(p => p.email === sampleIntakeData.email);
    
    if (testPatient) {
      // Delete test patient
      const deleteResponse = await fetch(`${config.backendServer}/patients/${testPatient.id}`, {
        method: 'DELETE'
      });
      
      if (deleteResponse.ok) {
        logSuccess('Test patient data cleaned up successfully');
      } else {
        logError('Failed to clean up test patient data');
      }
    } else {
      logInfo('No test patient found to clean up');
    }
  } catch (error) {
    logError(`Cleanup error: ${error.message}`);
  }
}

// Main test execution
async function runIntegrationTests() {
  log('🚀 Back to Life - Complete Integration Test', 'bright');
  log('═'.repeat(60), 'cyan');
  
  const startTime = Date.now();
  let testsPassed = 0;
  let totalTests = 4;
  
  try {
    // Test 1: Backend Health
    const healthCheck = await testBackendHealth();
    if (healthCheck) testsPassed++;
    
    if (!healthCheck) {
      log('\n❌ Backend server is not available. Integration tests cannot proceed.', 'red');
      process.exit(1);
    }
    
    // Test 2: Intake Submission
    const submissionResult = await testIntakeSubmission();
    if (submissionResult.success) testsPassed++;
    
    // Test 3: Clinician Dashboard Data
    const dashboardResult = await testClinicianDashboardData();
    if (dashboardResult.success) testsPassed++;
    
    // Test 4: Data Integrity
    const integrityResult = await testDataIntegrity(submissionResult, dashboardResult);
    if (integrityResult) testsPassed++;
    
    // Cleanup
    await cleanupTestData();
    
  } catch (error) {
    logError(`Integration test failed with error: ${error.message}`);
  }
  
  // Final results
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  logStep('📊', 'Integration Test Results');
  
  if (testsPassed === totalTests) {
    logSuccess(`All integration tests PASSED! (${testsPassed}/${totalTests})`);
    log(`🎉 Complete integration is working perfectly!`, 'green');
  } else {
    logError(`Integration tests FAILED: ${testsPassed}/${totalTests} tests passed`);
  }
  
  logInfo(`Test duration: ${duration} seconds`);
  
  log('\n' + '═'.repeat(60), 'cyan');
  log('Integration test complete!', 'bright');
}

// Run the tests
if (require.main === module) {
  runIntegrationTests().catch(console.error);
}

module.exports = {
  runIntegrationTests,
  sampleIntakeData,
  config
}; 