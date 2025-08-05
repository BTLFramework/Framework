/**
 * Continuous SRS Calculation (0-100 scale)
 * Used for progress tracking, Risk Band calculation, and analytics
 * 
 * This is separate from the 0-11 intake SRS used for phase determination
 */

/**
 * Calculate continuous SRS score (0-100)
 * @param {Object} data - Assessment data
 * @param {number} data.vas - Pain intensity (0-10)
 * @param {number} data.function - Function score (0-100)
 * @param {number} data.stress - Stress level (0-10)
 * @param {number} data.pcs4 - PCS-4 score (0-16)
 * @param {Object} data.tsk11 - TSK-11 responses
 * @returns {Object} SRS domains and composite score
 */
export function calculateContinuousSRS(data) {
  console.log('🔢 Calculating Continuous SRS (0-100)');
  console.log('📊 Input data:', data);
  
  const domains = {};
  
  // 1. Pain Intensity Domain (25%)
  // VAS 0-10 → 0-100 (×10)
  domains.pain = (data.vas || 0) * 10;
  
  // 2. Function Domain (25%)
  // Function score already 0-100, or calculate from PSFS
  if (data.function !== undefined) {
    domains.function = data.function;
  } else if (data.psfs && data.psfs.length > 0) {
    // Calculate function from PSFS average
    const avgPSFS = data.psfs.reduce((sum, item) => sum + (item.score || 0), 0) / data.psfs.length;
    domains.function = avgPSFS * 10; // PSFS 0-10 → 0-100
  } else {
    domains.function = 0;
  }
  
  // 3. Psychological Load Domain (25%)
  // Stress (0-10) + PCS-4 (0-16) → 0-100
  const stressScaled = (data.stress || 0) * 10; // 0-10 → 0-100
  const pcsScaled = data.pcs4 ? (data.pcs4 / 16) * 100 : 0; // 0-16 → 0-100
  domains.psychLoad = (stressScaled + pcsScaled) / 2; // Average of stress and PCS
  
  // 4. Fear-Avoidance Domain (25%) - NEW
  // TSK-7 raw score (7-28) → 0-100
  domains.fa = calculateTSK7Score(data.tsk7);
  
  // Calculate composite SRS (equal weights: 25% each)
  const composite = (
    domains.pain * 0.25 +
    domains.function * 0.25 +
    domains.psychLoad * 0.25 +
    domains.fa * 0.25
  );
  
  console.log('📊 SRS Domains:', domains);
  console.log(`🎯 Composite SRS: ${composite.toFixed(1)}/100`);
  
  return {
    domains,
    composite: Math.round(composite * 10) / 10, // Round to 1 decimal
    calculationType: 'continuous'
  };
}

/**
 * Calculate TSK-7 score from responses
 * @param {Object} tsk7Data - TSK-7 responses {1: 1-4, 2: 1-4, ...}
 * @returns {number} Normalized score 0-100
 */
function calculateTSK7Score(tsk7Data) {
  if (!tsk7Data || typeof tsk7Data !== 'object') {
    return 0; // Default to 0 if no data
  }
  
  let rawScore = 0;
  let answeredCount = 0;
  
  // TSK-7 items with reverse-scored items (2, 6, 7)
  const reverseScoredItems = [2, 6, 7];
  
  for (let i = 1; i <= 7; i++) {
    const response = tsk7Data[i];
    if (response && response >= 1 && response <= 4) {
      answeredCount++;
      if (reverseScoredItems.includes(i)) {
        rawScore += (5 - response); // Reverse score: 1→4, 2→3, 3→2, 4→1
      } else {
        rawScore += response;
      }
    }
  }
  
  // Only calculate if all 7 items are answered
  if (answeredCount === 7) {
    // Normalize: (raw - 7) / 21 * 100
    // 7 → 0%, 28 → 100%
    return Math.round(((rawScore - 7) / 21) * 100);
  }
  
  return 0; // Incomplete data
}

/**
 * Calculate Risk Band using continuous SRS domains
 * @param {Object} data - Assessment data
 * @returns {Object} Risk band and index
 */
export function calculateRiskBand(data) {
  const srs = calculateContinuousSRS(data);
  
  // Risk Index formula: 0.3 × Stress + 0.4 × PCS + 0.3 × FA
  const stressScaled = (data.stress || 0) * 10;
  const pcsScaled = data.pcs4 ? (data.pcs4 / 16) * 100 : 0;
  const faScaled = srs.domains.fa;
  
  const riskIndex = (
    stressScaled * 0.3 +
    pcsScaled * 0.4 +
    faScaled * 0.3
  );
  
  // Determine risk band
  let riskBand;
  if (riskIndex < 40) {
    riskBand = 'low';
  } else if (riskIndex < 65) {
    riskBand = 'medium';
  } else {
    riskBand = 'high';
  }
  
  console.log(`⚠️ Risk Index: ${riskIndex.toFixed(1)} (${riskBand})`);
  
  return {
    riskIndex: Math.round(riskIndex * 10) / 10,
    riskBand,
    components: {
      stress: stressScaled,
      pcs: pcsScaled,
      fa: faScaled
    }
  };
}

/**
 * Get domain descriptions for UI display
 */
export const domainDescriptions = {
  pain: {
    name: 'Pain Intensity',
    description: 'Current pain level on 0-10 scale',
    unit: '/10'
  },
  function: {
    name: 'Function',
    description: 'Ability to perform daily activities',
    unit: '/100'
  },
  psychLoad: {
    name: 'Psychological Load',
    description: 'Stress and pain catastrophizing',
    unit: '/100'
  },
  fa: {
    name: 'Fear-Avoidance',
    description: 'Fear of movement and reinjury',
    unit: '/100'
  }
};

/**
 * Get SRS interpretation
 */
export function getSRSInterpretation(composite) {
  if (composite >= 80) {
    return {
      level: 'Excellent',
      color: 'text-green-600',
      description: 'Strong recovery indicators across all domains'
    };
  } else if (composite >= 60) {
    return {
      level: 'Good',
      color: 'text-blue-600',
      description: 'Positive recovery trajectory with room for improvement'
    };
  } else if (composite >= 40) {
    return {
      level: 'Moderate',
      color: 'text-yellow-600',
      description: 'Mixed indicators - some areas need attention'
    };
  } else {
    return {
      level: 'Needs Support',
      color: 'text-red-600',
      description: 'Multiple domains require intervention'
    };
  }
} 