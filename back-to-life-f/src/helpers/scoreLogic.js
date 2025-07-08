import { 
  intakeRules, 
  followUpRules, 
  phaseCutoffs, 
  getPhase, 
  scoreRanges 
} from '../config/srsConfig.js';

export function getPhaseByScore(score) {
  if (score <= 3) return { label: "RESET", color: "bg-green-400" };
  if (score <= 6) return { label: "EDUCATE", color: "bg-yellow-400" };
  return { label: "REBUILD", color: "bg-blue-400" };
}

/**
 * Calculate the Signature Recovery Score™ (SRS)
 * This algorithm matches the backend comprehensive scoring methodology
 * @param {Object} data - Assessment data
 * @returns {number} SRS score (0-11)
 */
export function calculateSRS(formData, previousData = null, clinicianData = {}) {
  if (formData.formType === 'Intake' || !previousData) {
    // Baseline (Intake) calculation
    return computeBaselineSRS(formData, clinicianData);
  } else {
    // Follow-up calculation
    return computeFollowUpSRS(previousData, formData, clinicianData);
  }
}

// Baseline (Intake) SRS Calculation - Range: 0-9 points
export function computeBaselineSRS(formData, clinicianData = {}) {
  console.log('🔢 Frontend: Starting Baseline SRS Calculation');
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
  const beliefs = Array.isArray(formData.beliefs) ? formData.beliefs : [];
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

  // Determine phase using centralized helper
  const phase = getPhase(points);

  console.log('📋 SRS Calculation Breakdown:');
  breakdown.forEach(item => console.log(`   ${item}`));
  console.log(`🎯 Final Baseline SRS Score: ${points}/${scoreRanges.baseline.max}`);
  console.log(`🔄 Determined Phase: ${phase}`);

  return {
    score: points,
    maxScore: scoreRanges.baseline.max,
    phase: phase,
    breakdown: breakdown,
    formattedScore: `${points}/${scoreRanges.baseline.max}`,
    calculationType: 'baseline'
  };
}

// Follow-up SRS Calculation - Range: 0-11 points
export function computeFollowUpSRS(baselineData, currentData, clinicianData = {}) {
  console.log('🔢 Frontend: Starting Follow-up SRS Calculation');
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
  const baselineNegBeliefs = Array.isArray(baselineData.beliefs) 
    ? baselineData.beliefs.filter(b => b && b !== "None of these apply").length 
    : 0;
  const currentNegBeliefs = Array.isArray(currentData.beliefs) 
    ? currentData.beliefs.filter(b => b && b !== "None of these apply").length 
    : 0;
  
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

  // Determine phase using centralized helper
  const phase = getPhase(points);

  console.log('📋 Follow-up SRS Calculation Breakdown:');
  breakdown.forEach(item => console.log(`   ${item}`));
  console.log(`🎯 Final Follow-up SRS Score: ${points}/${scoreRanges.followup.max}`);
  console.log(`🔄 Determined Phase: ${phase}`);

  return {
    score: points,
    maxScore: scoreRanges.followup.max,
    phase: phase,
    breakdown: breakdown,
    formattedScore: `${points}/${scoreRanges.followup.max}`,
    calculationType: 'followup'
  };
}

// Phase determination helper
export function phaseFromSRS(score) {
  if (score <= 3) return "RESET";
  if (score <= 7) return "EDUCATE";
  return "REBUILD"; // 8-11
}

// Calculate disability percentage from questionnaire responses
export function calculateDisabilityPercentage(ndi, odi, tdi, ulfi, lefs, region) {
  let totalScore = 0;
  let maxPossibleScore = 0;
  
  console.log(`🧮 Calculating disability for region: ${region}`);
  
  // Handle new region mapping
  const regionLower = region?.toLowerCase();
  
  // Check for specific region labels first
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
  } else if (regionLower === 'low back / si joint' || regionLower === 'back') {
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
    // Fallback to old logic for backward compatibility
    switch(regionLower) {
      case 'neck':
        if (ndi && ndi.length > 0) {
          totalScore = ndi.reduce((sum, score) => sum + (score || 0), 0);
          maxPossibleScore = ndi.length * 5;
        console.log(`   NDI: ${totalScore}/${maxPossibleScore}`);
      }
      break;
      
    case 'back':
      if (odi && odi.length > 0) {
        totalScore = odi.reduce((sum, score) => sum + (score || 0), 0);
          maxPossibleScore = odi.length * 5;
        console.log(`   ODI: ${totalScore}/${maxPossibleScore}`);
      }
      break;
      
    case 'upper limb':
      if (ulfi && ulfi.length > 0) {
        totalScore = ulfi.reduce((sum, score) => sum + (score || 0), 0);
          maxPossibleScore = ulfi.length * 4;
        console.log(`   ULFI: ${totalScore}/${maxPossibleScore}`);
      }
      break;
      
    case 'lower limb':
      if (lefs && lefs.length > 0) {
        totalScore = lefs.reduce((sum, score) => sum + (score || 0), 0);
          maxPossibleScore = lefs.length * 4;
        console.log(`   LEFS: ${totalScore}/${maxPossibleScore}`);
      }
      break;
      
    default:
      console.log(`   ⚠️ Unknown region: ${region}, defaulting to 0% disability`);
      return 0;
    }
  }
  
  if (maxPossibleScore === 0) {
    console.log(`   ⚠️ No valid questionnaire data found`);
    return 0;
  }
  
  const percentage = Math.round((totalScore / maxPossibleScore) * 100);
  console.log(`   📊 Disability: ${percentage}%`);
  
  return percentage;
}
