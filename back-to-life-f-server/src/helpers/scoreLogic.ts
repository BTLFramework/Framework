import { intakeRules, followUpRules, phaseCutoffs, getPhase, scoreRanges } from '../config/srsConfig';

// Baseline (Intake) SRS Calculation - Range: 0-9 points
export function computeBaselineSRS(formData: any, clinicianData: any = {}) {
  console.log('🔢 Backend: Starting Baseline SRS Calculation');
  console.log('📊 Form data:', formData);
  
  let points = 0;
  const breakdown: string[] = [];

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
    const psfaScores = formData.psfs.map((item: any) => item.score || 0);
    const avgPSFS = psfaScores.reduce((sum: number, score: number) => sum + score, 0) / psfaScores.length;
    
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

  // 5. Fear-Avoidance Assessment (TSK-11)
  const calculateTSK11Score = (tsk11Data: any) => {
    if (!tsk11Data || typeof tsk11Data !== 'object') return null;
    
    let rawScore = 0;
    let answeredCount = 0;
    
    // TSK-11 items with reverse-scored items (4, 8, 9)
    const reverseScoredItems = [4, 8, 9];
    
    for (let i = 1; i <= 11; i++) {
      const response = tsk11Data[i];
      if (response && response >= 1 && response <= 4) {
        answeredCount++;
        if (reverseScoredItems.includes(i)) {
          rawScore += (5 - response); // Reverse score: 1→4, 2→3, 3→2, 4→1
        } else {
          rawScore += response;
        }
      }
    }
    
    return answeredCount === 11 ? rawScore : null;
  };
  
  const tsk11RawScore = calculateTSK11Score(formData.tsk11);
  
  if (tsk11RawScore !== null) {
    if (tsk11RawScore <= intakeRules.fearAvoidance.threshold) {
      points += intakeRules.fearAvoidance.points;
      breakdown.push(`✅ ${intakeRules.fearAvoidance.description} (${tsk11RawScore}): +${intakeRules.fearAvoidance.points} point`);
    } else {
      breakdown.push(`❌ Fear-Avoidance (TSK-11 ${tsk11RawScore} > ${intakeRules.fearAvoidance.threshold}): +0 points`);
    }
  } else {
    breakdown.push(`❌ Fear-Avoidance (TSK-11 incomplete): +0 points`);
  }

  // 6. Pain Catastrophizing Assessment (PCS-4)
  const calculatePCS4Score = (pcs4Data: any) => {
    if (!pcs4Data || typeof pcs4Data !== 'object') return null;
    
    let totalScore = 0;
    let answeredCount = 0;
    
    for (let i = 1; i <= 4; i++) {
      const response = pcs4Data[i];
      if (response && response >= 0 && response <= 4) {
        answeredCount++;
        totalScore += response;
      }
    }
    
    return answeredCount === 4 ? totalScore : null;
  };
  
  const pcs4TotalScore = calculatePCS4Score(formData.pcs4);
  
  if (pcs4TotalScore !== null) {
    if (pcs4TotalScore <= intakeRules.painBeliefs.threshold) {
      points += intakeRules.painBeliefs.points;
      breakdown.push(`✅ ${intakeRules.painBeliefs.description} (${pcs4TotalScore}): +${intakeRules.painBeliefs.points} point`);
    } else {
      breakdown.push(`❌ Pain Catastrophizing (PCS-4 ${pcs4TotalScore} > ${intakeRules.painBeliefs.threshold}): +0 points`);
    }
  } else {
    breakdown.push(`❌ Pain Catastrophizing (PCS-4 incomplete): +0 points`);
  }

  // 7. Clinician Assessment (if provided)
  if (clinicianData.milestone) {
    points += intakeRules.clinician.milestone.points;
    breakdown.push(`✅ ${intakeRules.clinician.milestone.description}: +${intakeRules.clinician.milestone.points} point`);
  }
  
  if (clinicianData.progress) {
    points += intakeRules.clinician.progress.points;
    breakdown.push(`✅ ${intakeRules.clinician.progress.description}: +${intakeRules.clinician.progress.points} point`);
  }

  const phase = getPhase(points);
  
  console.log('📊 Baseline SRS Calculation Complete:');
  console.log(`🎯 Total Points: ${points}/${scoreRanges.baseline.max}`);
  console.log(`📋 Phase: ${phase}`);
  console.log('📝 Breakdown:', breakdown);

  return {
    score: points,
    phase: phase,
    breakdown: breakdown,
    maxScore: scoreRanges.baseline.max
  };
}

// Follow-up SRS Calculation - Range: 0-11 points
export function computeFollowUpSRS(baselineData: any, currentData: any, clinicianData: any = {}) {
  console.log('🔢 Backend: Starting Follow-up SRS Calculation');
  console.log('📊 Baseline data:', baselineData);
  console.log('📊 Current data:', currentData);
  
  let points = 0;
  const breakdown: string[] = [];

  // 1. Pain Improvement
  const baselineVAS = parseInt(baselineData.vas) || 0;
  const currentVAS = parseInt(currentData.vas) || 0;
  const painImprovement = baselineVAS - currentVAS;
  
  if (painImprovement >= followUpRules.pain.improvement) {
    points += followUpRules.pain.points;
    breakdown.push(`✅ ${followUpRules.pain.description} (${painImprovement}): +${followUpRules.pain.points} point`);
  } else {
    breakdown.push(`❌ Pain improvement (${painImprovement} < ${followUpRules.pain.improvement}): +0 points`);
  }

  // 2. Function Improvement (PSFS)
  if (baselineData.psfs && currentData.psfs && baselineData.psfs.length > 0 && currentData.psfs.length > 0) {
    const baselinePSFS = baselineData.psfs.map((item: any) => item.score || 0);
    const currentPSFS = currentData.psfs.map((item: any) => item.score || 0);
    const baselineAvg = baselinePSFS.reduce((sum: number, score: number) => sum + score, 0) / baselinePSFS.length;
    const currentAvg = currentPSFS.reduce((sum: number, score: number) => sum + score, 0) / currentPSFS.length;
    const functionImprovement = currentAvg - baselineAvg;
    
    if (functionImprovement >= followUpRules.function.improvement) {
      points += followUpRules.function.points;
      breakdown.push(`✅ ${followUpRules.function.description} (${functionImprovement.toFixed(1)}): +${followUpRules.function.points} points`);
    } else {
      breakdown.push(`❌ Function improvement (${functionImprovement.toFixed(1)} < ${followUpRules.function.improvement}): +0 points`);
    }
  } else {
    breakdown.push(`❌ Function improvement (incomplete data): +0 points`);
  }

  // 3. Disability Improvement
  const baselineDisability = baselineData.disabilityPercentage || 0;
  const currentDisability = currentData.disabilityPercentage || 0;
  const disabilityImprovement = baselineDisability - currentDisability;
  
  if (disabilityImprovement >= followUpRules.disability.improvement) {
    points += followUpRules.disability.points;
    breakdown.push(`✅ ${followUpRules.disability.description} (${disabilityImprovement}%): +${followUpRules.disability.points} point`);
  } else {
    breakdown.push(`❌ Disability improvement (${disabilityImprovement}% < ${followUpRules.disability.improvement}%): +0 points`);
  }

  // 4. Confidence Improvement
  const baselineConfidence = parseInt(baselineData.confidence) || 0;
  const currentConfidence = parseInt(currentData.confidence) || 0;
  const confidenceImprovement = currentConfidence - baselineConfidence;
  
  if (confidenceImprovement >= followUpRules.confidence.improvement) {
    points += followUpRules.confidence.points;
    breakdown.push(`✅ ${followUpRules.confidence.description} (${confidenceImprovement}): +${followUpRules.confidence.points} points`);
  } else {
    breakdown.push(`❌ Confidence improvement (${confidenceImprovement} < ${followUpRules.confidence.improvement}): +0 points`);
  }

  // 5. Beliefs Cleared
  const baselineBeliefs = baselineData.beliefs || {};
  const currentBeliefs = currentData.beliefs || {};
  const allNegativeBeliefsCleared = Object.keys(baselineBeliefs).every(key => 
    !currentBeliefs[key] || currentBeliefs[key] === false
  );
  
  if (allNegativeBeliefsCleared) {
    points += followUpRules.beliefs.points;
    breakdown.push(`✅ ${followUpRules.beliefs.description}: +${followUpRules.beliefs.points} point`);
  } else {
    breakdown.push(`❌ Negative beliefs not all cleared: +0 points`);
  }

  // 6. GROC Assessment
  const groc = parseInt(currentData.groc) || 0;
  if (groc >= followUpRules.groc.threshold) {
    points += followUpRules.groc.points;
    breakdown.push(`✅ ${followUpRules.groc.description} (${groc}): +${followUpRules.groc.points} point`);
  } else {
    breakdown.push(`❌ GROC (${groc} < ${followUpRules.groc.threshold}): +0 points`);
  }

  // 7. Clinician Assessment
  if (clinicianData.milestone) {
    points += followUpRules.clinician.milestone.points;
    breakdown.push(`✅ ${followUpRules.clinician.milestone.description}: +${followUpRules.clinician.milestone.points} point`);
  }
  
  if (clinicianData.progress) {
    points += followUpRules.clinician.progress.points;
    breakdown.push(`✅ ${followUpRules.clinician.progress.description}: +${followUpRules.clinician.progress.points} point`);
  }

  const phase = getPhase(points);
  
  console.log('📊 Follow-up SRS Calculation Complete:');
  console.log(`🎯 Total Points: ${points}/${scoreRanges.followup.max}`);
  console.log(`📋 Phase: ${phase}`);
  console.log('📝 Breakdown:', breakdown);

  return {
    score: points,
    phase: phase,
    breakdown: breakdown,
    maxScore: scoreRanges.followup.max
  };
}

// Main SRS calculation function
export function calculateSRS(data: any, previousData: any = null, clinicianData: any = {}) {
  if (previousData) {
    return computeFollowUpSRS(previousData, data, clinicianData);
  } else {
    return computeBaselineSRS(data, clinicianData);
  }
}

// Helper functions
export function calculateDisabilityPercentage(ndi: number, odi: number, tdi: number, ulfi: number, lefs: number, region: string) {
  // Implementation for disability percentage calculation
  return 0; // Placeholder
}

export function validateAssessmentData(data: any) {
  // Implementation for data validation
  return true; // Placeholder
} 