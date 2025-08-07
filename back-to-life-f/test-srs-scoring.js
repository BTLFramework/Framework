// SRS Scoring Test Script
// Run this in the browser console to test the scoring algorithm

// Import the scoring function (you'll need to run this in the browser)
// const { computeBaselineSRS } = await import('./src/helpers/scoreLogic.js');

// Test Case 1: Perfect Score (9/9)
const perfectScoreData = {
  vas: 1,
  disabilityPercentage: 15,
  psfs: [{score: 8}, {score: 9}, {score: 8}],
  confidence: 9,
  tsk7: {1:1, 2:1, 3:1, 4:1, 5:1, 6:1, 7:1},
  formType: 'Intake'
};

// Test Case 2: Moderate Score (5/9)
const moderateScoreData = {
  vas: 4,
  disabilityPercentage: 25,
  psfs: [{score: 6}, {score: 5}, {score: 6}],
  confidence: 6,
  tsk7: {1:2, 2:2, 3:2, 4:2, 5:2, 6:2, 7:2},
  formType: 'Intake'
};

// Test Case 3: Low Score (2/9)
const lowScoreData = {
  vas: 7,
  disabilityPercentage: 45,
  psfs: [{score: 3}, {score: 2}, {score: 3}],
  confidence: 3,
  tsk7: {1:3, 2:3, 3:3, 4:3, 5:3, 6:3, 7:3},
  formType: 'Intake'
};

console.log('🧪 SRS Scoring Test Cases');
console.log('========================');

// Expected results
const expectedResults = {
  perfect: { score: 9, phase: 'REBUILD' },
  moderate: { score: 4, phase: 'EDUCATE' },
  low: { score: 2, phase: 'RESET' }
};

console.log('Expected Results:');
console.log('Perfect Score:', expectedResults.perfect);
console.log('Moderate Score:', expectedResults.moderate);
console.log('Low Score:', expectedResults.low);

// To run actual tests, you would need to:
// 1. Open the intake form in browser
// 2. Open browser console
// 3. Run: const result = computeBaselineSRS(perfectScoreData);
// 4. Check if result.score === 9 and result.phase === 'REBUILD'

console.log('\n📋 Manual Test Instructions:');
console.log('1. Open intake form in browser');
console.log('2. Fill out form with test data');
console.log('3. Submit and check console logs');
console.log('4. Verify SRS score and phase match expected'); 