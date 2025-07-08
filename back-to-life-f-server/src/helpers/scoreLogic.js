/**
 * Signature Recovery Score™ (SRS) Calculation Logic
 * 
 * This module contains the comprehensive algorithm for calculating
 * the SRS based on multiple assessment factors.
 */

/**
 * Calculate the Signature Recovery Score™ (SRS)
 * @param {Object} data - Assessment data
 * @param {number} data.disabilityPercentage - Disability index percentage (0-100)
 * @param {number} data.vas - Visual Analog Scale pain score (0-10)
 * @param {Array} data.psfs - Patient Specific Functional Scale activities
 * @param {Array} data.beliefs - Negative beliefs array
 * @param {number} data.confidence - Confidence level (0-10)
 * @param {number} data.groc - Global Rating of Change (-5 to +5)
 * @returns {number} SRS score (0-11)
 */
function calculateSRS({ disabilityPercentage, vas, psfs, beliefs, confidence, groc }) {
  let srsScore = 11; // Start with perfect score

  // 1. Disability Index Impact (0-3 point reduction)
  if (disabilityPercentage >= 80) {
    srsScore -= 3; // Severe disability
  } else if (disabilityPercentage >= 60) {
    srsScore -= 2; // Moderate disability
  } else if (disabilityPercentage >= 40) {
    srsScore -= 1; // Mild disability
  }
  // No reduction for <40% disability

  // 2. Pain Level Impact (0-3 point reduction)
  if (vas >= 8) {
    srsScore -= 3; // Severe pain
  } else if (vas >= 6) {
    srsScore -= 2; // Moderate pain
  } else if (vas >= 4) {
    srsScore -= 1; // Mild pain
  }
  // No reduction for <4 pain

  // 3. Functional Capacity Impact (0-2 point reduction)
  if (psfs && psfs.length > 0) {
    const avgPSFS = psfs.reduce((sum, item) => sum + (item.score || 0), 0) / psfs.length;
    if (avgPSFS <= 3) {
      srsScore -= 2; // Poor function
    } else if (avgPSFS <= 6) {
      srsScore -= 1; // Moderate function
    }
    // No reduction for >6 average function
  }

  // 4. Confidence Impact (0-2 point reduction)
  if (confidence <= 3) {
    srsScore -= 2; // Very low confidence
  } else if (confidence <= 6) {
    srsScore -= 1; // Low confidence
  }
  // No reduction for >6 confidence

  // 5. Negative Beliefs Impact (0-1 point reduction)
  if (beliefs && beliefs.length >= 2) {
    srsScore -= 1; // Multiple negative beliefs
  }

  // 6. Global Rating of Change (Follow-up assessments only)
  if (groc !== undefined && groc !== null && groc !== 0) {
    if (groc <= -3) {
      srsScore -= 2; // Much worse
    } else if (groc <= -1) {
      srsScore -= 1; // Somewhat worse
    } else if (groc >= 3) {
      srsScore += 1; // Much better (bonus point)
    }
    // No change for slight improvements or no change
  }

  // Ensure score stays within bounds (0-11)
  srsScore = Math.max(0, Math.min(11, srsScore));

  return srsScore;
}

/**
 * Get phase classification based on SRS score
 * @param {number} srsScore - SRS score (0-11)
 * @returns {Object} Phase information
 */
function getPhaseByScore(srsScore) {
  if (srsScore >= 8) {
    return { 
      label: "REBUILD", 
      color: "green",
      description: "Focus on building strength and returning to activities"
    };
  }
  if (srsScore >= 5) {
    return { 
      label: "EDUCATE", 
      color: "yellow",
      description: "Learn about pain science and movement strategies"
    };
  }
  return { 
    label: "RESET", 
    color: "red",
    description: "Address pain, fear, and basic movement patterns"
  };
}

/**
 * Calculate disability percentage from disability index scores
 * @param {Array} scores - Array of disability index scores
 * @param {string} indexType - Type of disability index (NDI, ODI, ULFI, LEFS)
 * @returns {number} Disability percentage (0-100)
 */
function calculateDisabilityPercentage(scores, indexType) {
  if (!scores || !Array.isArray(scores) || scores.length === 0) {
    return 0;
  }

  const total = scores.reduce((sum, score) => sum + (score || 0), 0);
  
  // Maximum scores for each index type
  const maxScores = {
    'NDI': 50,   // Neck Disability Index
    'ODI': 50,   // Oswestry Disability Index
    'ULFI': 120, // Upper Limb Functional Index
    'LEFS': 80   // Lower Extremity Functional Scale
  };

  const maxScore = maxScores[indexType] || 50; // Default to 50
  return Math.round((total / maxScore) * 100);
}

/**
 * Validate assessment data for SRS calculation
 * @param {Object} data - Assessment data to validate
 * @returns {Object} Validation result with isValid and errors
 */
function validateAssessmentData(data) {
  const errors = [];
  
  if (data.vas === undefined || data.vas < 0 || data.vas > 10) {
    errors.push('VAS score must be between 0 and 10');
  }
  
  if (data.confidence === undefined || data.confidence < 0 || data.confidence > 10) {
    errors.push('Confidence score must be between 0 and 10');
  }
  
  if (data.disabilityPercentage === undefined || data.disabilityPercentage < 0 || data.disabilityPercentage > 100) {
    errors.push('Disability percentage must be between 0 and 100');
  }
  
  if (data.groc !== undefined && (data.groc < -5 || data.groc > 5)) {
    errors.push('GROC score must be between -5 and +5');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// SRS Calculation Logic - Backend Version
// Uses centralized configuration from srsConfig.js

const { 
  intakeRules, 
  followUpRules, 
  phaseCutoffs, 
  getPhase, 
  scoreRanges 
} = require('../config/srsConfig.js');

// Baseline (Intake) SRS Calculation - Range: 0-9 points
function computeBaselineSRS(formData, clinicianData = {}) {
  console.log('🔢 Backend: Starting Baseline SRS Calculation');
  console.log('📊 Form data:', formData);
  
  let points = 0;
  const breakdown = [];

  // 1. Pain Assessment
  const vas = parseInt(formData.vas) || 0;
  if (vas <= intakeRules.pain.threshold) {
    points += intakeRules.pain.points;
    breakdown.push(`✅ ${intakeRules.pain.description} (${vas}): +${intakeRules.pain.points} point`);
  } else {
    breakdown.push(`❌ Pain (VAS ${vas} > ${intakeRules.pain.threshold}): +0 points`);
  }

  // 2. Disability Assessment
  const disabilityPercentage = formData.disabilityPercentage || 0;
  if (disabilityPercentage <= intakeRules.disability.threshold) {
    points += intakeRules.disability.points;
    breakdown.push(`✅ ${intakeRules.disability.description} (${disabilityPercentage}%): +${intakeRules.disability.points} point`);
  } else {
    breakdown.push(`❌ Disability (${disabilityPercentage}% > ${intakeRules.disability.threshold}%): +0 points`);
  }

  // 3. Task Function (PSFS)
  if (formData.psfs && formData.psfs.length > 0) {
    const psfaScores = formData.psfs.map(item => item.score || 0);
    const avgPSFS = psfaScores.reduce((sum, score) => sum + score, 0) / psfaScores.length;
    
    if (avgPSFS >= intakeRules.function.excellent.threshold) {
      points += intakeRules.function.excellent.points;
      breakdown.push(`✅ ${intakeRules.function.description} (avg ${avgPSFS.toFixed(1)} ≥ ${intakeRules.function.excellent.threshold}): +${intakeRules.function.excellent.points} points`);
    } else if (avgPSFS >= intakeRules.function.good.threshold) {
      points += intakeRules.function.good.points;
      breakdown.push(`✅ ${intakeRules.function.description} (avg ${avgPSFS.toFixed(1)} ≥ ${intakeRules.function.good.threshold}): +${intakeRules.function.good.points} point`);
    } else {
      breakdown.push(`❌ ${intakeRules.function.description} (avg ${avgPSFS.toFixed(1)} < ${intakeRules.function.good.threshold}): +0 points`);
    }
  } else {
    breakdown.push(`❌ ${intakeRules.function.description} (no data): +0 points`);
  }

  // 4. Confidence Assessment
  const confidence = parseInt(formData.confidence) || 0;
  if (confidence >= intakeRules.confidence.high.threshold) {
    points += intakeRules.confidence.high.points;
    breakdown.push(`✅ ${intakeRules.confidence.description} (${confidence} ≥ ${intakeRules.confidence.high.threshold}): +${intakeRules.confidence.high.points} points`);
  } else if (confidence >= intakeRules.confidence.moderate.threshold) {
    points += intakeRules.confidence.moderate.points;
    breakdown.push(`✅ ${intakeRules.confidence.description} (${confidence} ≥ ${intakeRules.confidence.moderate.threshold}): +${intakeRules.confidence.moderate.points} point`);
  } else {
    breakdown.push(`❌ ${intakeRules.confidence.description} (${confidence} < ${intakeRules.confidence.moderate.threshold}): +0 points`);
  }

  // 5. Belief Assessment
  const beliefs = Array.isArray(formData.beliefs) ? formData.beliefs : 
                  (formData.beliefs ? [formData.beliefs] : []);
  const hasNegativeBeliefs = beliefs.some(belief => 
    belief && belief.trim() !== "" && belief !== "None of these apply"
  );
  
  if (!hasNegativeBeliefs || beliefs.length === 0) {
    points += intakeRules.beliefs.points;
    breakdown.push(`✅ ${intakeRules.beliefs.description}: +${intakeRules.beliefs.points} point`);
  } else {
    breakdown.push(`❌ Beliefs (negative beliefs present): +0 points`);
    breakdown.push(`   Negative beliefs: ${beliefs.join(', ')}`);
  }

  // 6. Clinician Assessments
  if (clinicianData.milestoneMet) {
    points += intakeRules.clinician.milestone.points;
    breakdown.push(`✅ ${intakeRules.clinician.milestone.description}: +${intakeRules.clinician.milestone.points} point`);
  } else {
    breakdown.push(`❌ ${intakeRules.clinician.milestone.description} (not met): +0 points`);
  }

  if (clinicianData.objectiveProgress) {
    points += intakeRules.clinician.progress.points;
    breakdown.push(`✅ ${intakeRules.clinician.progress.description}: +${intakeRules.clinician.progress.points} point`);
  } else {
    breakdown.push(`❌ ${intakeRules.clinician.progress.description} (not met): +0 points`);
  }

  console.log('📋 Backend SRS Calculation Breakdown:');
  breakdown.forEach(item => console.log(`   ${item}`));
  console.log(`🎯 Final Baseline SRS Score: ${points}/${scoreRanges.baseline.max}`);

  return {
    score: points,
    maxScore: scoreRanges.baseline.max,
    breakdown: breakdown,
    calculationType: 'baseline'
  };
}

// Follow-up SRS Calculation - Range: 0-11 points
function computeFollowUpSRS(baselineData, currentData, clinicianData = {}) {
  console.log('🔢 Backend: Starting Follow-up SRS Calculation');
  console.log('📊 Baseline data:', baselineData);
  console.log('📊 Current data:', currentData);
  
  let points = 0;
  const breakdown = [];

  // 1. Pain Improvement
  const vasImprovement = baselineData.vas - currentData.vas;
  if (vasImprovement >= followUpRules.pain.improvement) {
    points += followUpRules.pain.points;
    breakdown.push(`✅ ${followUpRules.pain.description} (${baselineData.vas} → ${currentData.vas}): +${followUpRules.pain.points} point`);
  } else {
    breakdown.push(`❌ Pain (change ${vasImprovement < 0 ? '+' : ''}${Math.abs(vasImprovement)}): +0 points`);
  }

  // 2. Function Improvement
  const baselinePSFS = baselineData.psfs ? baselineData.psfs.reduce((sum, item) => sum + item.score, 0) / baselineData.psfs.length : 0;
  const currentPSFS = currentData.psfs ? currentData.psfs.reduce((sum, item) => sum + item.score, 0) / currentData.psfs.length : 0;
  const psfsImprovement = currentPSFS - baselinePSFS;
  
  if (psfsImprovement >= followUpRules.function.improvement) {
    points += followUpRules.function.points;
    breakdown.push(`✅ ${followUpRules.function.description} (${baselinePSFS.toFixed(1)} → ${currentPSFS.toFixed(1)}): +${followUpRules.function.points} points`);
  } else {
    breakdown.push(`❌ Function (change +${psfsImprovement.toFixed(1)}): +0 points`);
  }

  // 3. Disability Improvement
  const disabilityImprovement = baselineData.disabilityPercentage - currentData.disabilityPercentage;
  if (disabilityImprovement >= followUpRules.disability.improvement) {
    points += followUpRules.disability.points;
    breakdown.push(`✅ ${followUpRules.disability.description} (${baselineData.disabilityPercentage}% → ${currentData.disabilityPercentage}%): +${followUpRules.disability.points} point`);
  } else {
    breakdown.push(`❌ Disability (change ${disabilityImprovement < 0 ? '+' : '-'}${Math.abs(disabilityImprovement)}%): +0 points`);
  }

  // 4. Confidence Improvement
  const confidenceImprovement = currentData.confidence - baselineData.confidence;
  if (confidenceImprovement >= followUpRules.confidence.improvement) {
    points += followUpRules.confidence.points;
    breakdown.push(`✅ ${followUpRules.confidence.description} (${baselineData.confidence} → ${currentData.confidence}): +${followUpRules.confidence.points} points`);
  } else {
    breakdown.push(`❌ Confidence (change +${confidenceImprovement}): +0 points`);
  }

  // 5. Beliefs Improvement
  const baselineNegBeliefs = baselineData.beliefs ? baselineData.beliefs.filter(b => b && b !== "None of these apply").length : 0;
  const currentNegBeliefs = currentData.beliefs ? currentData.beliefs.filter(b => b && b !== "None of these apply").length : 0;
  
  if (baselineNegBeliefs > 0 && currentNegBeliefs === 0) {
    points += followUpRules.beliefs.points;
    breakdown.push(`✅ ${followUpRules.beliefs.description} (${baselineNegBeliefs} → 0): +${followUpRules.beliefs.points} point`);
  } else {
    breakdown.push(`❌ Beliefs (${baselineNegBeliefs} → ${currentNegBeliefs}): +0 points`);
  }

  // 6. GROC Assessment
  const groc = currentData.groc || 0;
  if (groc >= followUpRules.groc.threshold) {
    points += followUpRules.groc.points;
    breakdown.push(`✅ ${followUpRules.groc.description} (${groc}): +${followUpRules.groc.points} point`);
  } else {
    breakdown.push(`❌ GROC (${groc} < +${followUpRules.groc.threshold}): +0 points`);
  }

  // 7. Clinician Assessments
  if (clinicianData.milestoneMet) {
    points += followUpRules.clinician.milestone.points;
    breakdown.push(`✅ ${followUpRules.clinician.milestone.description}: +${followUpRules.clinician.milestone.points} point`);
  } else {
    breakdown.push(`❌ ${followUpRules.clinician.milestone.description} (not met): +0 points`);
  }

  if (clinicianData.objectiveProgress) {
    points += followUpRules.clinician.progress.points;
    breakdown.push(`✅ ${followUpRules.clinician.progress.description}: +${followUpRules.clinician.progress.points} point`);
  } else {
    breakdown.push(`❌ ${followUpRules.clinician.progress.description} (not met): +0 points`);
  }

  console.log('📋 Backend Follow-up SRS Calculation Breakdown:');
  breakdown.forEach(item => console.log(`   ${item}`));
  console.log(`🎯 Final Follow-up SRS Score: ${points}/${scoreRanges.followup.max}`);

  return {
    score: points,
    maxScore: scoreRanges.followup.max,
    breakdown: breakdown,
    calculationType: 'followup'
  };
}

// Main calculation function - determines whether to use baseline or follow-up logic
function calculateSRS(data, previousData = null, clinicianData = {}) {
  if (data.formType === 'Intake' || !previousData) {
    // Baseline (Intake) calculation
    const result = computeBaselineSRS(data, clinicianData);
    const phase = getPhase(result.score);
    
    return {
      ...result,
      phase: phase,
      formattedScore: `${result.score}/${scoreRanges.baseline.max}`
    };
  } else {
    // Follow-up calculation
    const result = computeFollowUpSRS(previousData, data, clinicianData);
    const phase = getPhase(result.score);
    
    return {
      ...result,
      phase: phase,
      formattedScore: `${result.score}/${scoreRanges.followup.max}`
    };
  }
}

// Calculate disability percentage from questionnaire responses
function calculateDisabilityPercentage(ndi, odi, tdi, ulfi, lefs, region) {
  let totalScore = 0;
  let maxPossibleScore = 0;
  
  console.log(`🧮 Calculating disability for region: ${region}`);
  
  const regionLower = region?.toLowerCase();
  
  // Handle new region mapping
  if (regionLower === 'neck') {
      if (ndi && ndi.length > 0) {
        totalScore = ndi.reduce((sum, score) => sum + (score || 0), 0);
        maxPossibleScore = ndi.length * 5; // Each NDI question max is 5
        console.log(`   NDI: ${totalScore}/${maxPossibleScore}`);
      }
  } else if (regionLower === 'mid-back / thoracic' || regionLower === 'thoracic') {
    if (tdi && tdi.length > 0) {
      totalScore = tdi.reduce((sum, score) => sum + (score || 0), 0);
      maxPossibleScore = tdi.length * 5; // Each TDI question max is 5
      console.log(`   TDI: ${totalScore}/${maxPossibleScore}`);
    }
  } else if (regionLower === 'low back / si joint' || regionLower === 'low back') {
      if (odi && odi.length > 0) {
        totalScore = odi.reduce((sum, score) => sum + (score || 0), 0);
        maxPossibleScore = odi.length * 5; // Each ODI question max is 5
        console.log(`   ODI: ${totalScore}/${maxPossibleScore}`);
      }
  } else if (regionLower.includes('shoulder') || regionLower.includes('elbow') || regionLower.includes('wrist') || regionLower.includes('hand') || regionLower === 'upper limb') {
      if (ulfi && ulfi.length > 0) {
        totalScore = ulfi.reduce((sum, score) => sum + (score || 0), 0);
        maxPossibleScore = ulfi.length * 4; // Each ULFI question max is 4
        console.log(`   ULFI: ${totalScore}/${maxPossibleScore}`);
      }
  } else if (regionLower.includes('hip') || regionLower.includes('knee') || regionLower.includes('ankle') || regionLower.includes('foot') || regionLower === 'lower limb') {
      if (lefs && lefs.length > 0) {
        totalScore = lefs.reduce((sum, score) => sum + (score || 0), 0);
        maxPossibleScore = lefs.length * 4; // Each LEFS question max is 4
        console.log(`   LEFS: ${totalScore}/${maxPossibleScore}`);
      }
  } else {
      console.log(`   ⚠️ Unknown region: ${region}, defaulting to 0% disability`);
      return 0;
  }
  
  if (maxPossibleScore === 0) {
    console.log(`   ⚠️ No valid questionnaire data found`);
    return 0;
  }
  
  const percentage = Math.round((totalScore / maxPossibleScore) * 100);
  console.log(`   📊 Disability: ${percentage}%`);
  
  return percentage;
}

// Validate assessment data
function validateAssessmentData(data) {
  const errors = [];
  
  if (!data.vas || data.vas < 0 || data.vas > 10) {
    errors.push('VAS must be between 0 and 10');
  }
  
  if (!data.confidence || data.confidence < 0 || data.confidence > 10) {
    errors.push('Confidence must be between 0 and 10');
  }
  
  if (!data.psfs || !Array.isArray(data.psfs) || data.psfs.length === 0) {
    errors.push('PSFS activities are required');
  }
  
  return errors;
}

module.exports = {
  calculateSRS,
  computeBaselineSRS,
  computeFollowUpSRS,
  getPhase,
  calculateDisabilityPercentage,
  validateAssessmentData
}; 