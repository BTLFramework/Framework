import { 
  createPatient, 
  addSRSScore, 
  getLatestSRSScore, 
  getAllPatientsWithLatestScores,
  findPatientByEmail,
  createPatientPortalAccount
} from "../models/patientModel";
import { PrismaClient } from "@prisma/client";
import { sendWelcomeEmailDev } from "../services/emailService";
import { generateSetupLink } from "../services/jwtService";

// TSK-7 calculation function (standardized across all apps)
const calculateTSK7Score = (tsk7Data: any) => {
  if (!tsk7Data || typeof tsk7Data !== 'object') {
    return null;
  }
  
  let totalScore = 0;
  let validResponses = 0;
  
  // TSK-7 items with reverse-scored items (2, 6, 7)
  const reverseScoredItems = [2, 6, 7];
  
  for (let i = 1; i <= 7; i++) {
    const response = tsk7Data[i];
    if (response !== undefined && response >= 1 && response <= 4) {
      let itemScore = response;
      
      // Reverse score items 2, 6, 7 (1→4, 2→3, 3→2, 4→1)
      if (reverseScoredItems.includes(i)) {
        itemScore = 5 - response;
      }
      
      totalScore += itemScore;
      validResponses++;
    }
  }
  
  return validResponses === 7 ? totalScore : null;
};

const prisma = new PrismaClient();

// Import standardized SRS configuration
import { intakeRules, followUpRules, getPhase } from '../config/srsConfig';

// Standardized SRS calculation function using centralized configuration
const calculateSRS = (formData: any, previousData?: any) => {
  console.log('🔢 Backend: Starting standardized SRS calculation');
  console.log('📊 Form data:', formData);
  console.log('📊 Previous data:', previousData);
  
  // For initial intake, use standardized baseline calculation
  if (!previousData) {
    return computeBaselineSRS(formData);
  }
  
  // For follow-up, use standardized follow-up calculation
  return computeFollowUpSRS(previousData, formData);
};

// Baseline (Intake) SRS Calculation - Range: 0-11 points
const computeBaselineSRS = (formData: any) => {
  console.log('🔢 Backend: Starting Baseline SRS Calculation');
  
  let points = 0;
  const breakdown: string[] = [];

  // 1. Pain Assessment (VAS ≤2 → +1 point)
  const vas = parseInt(formData.vas) || 0;
  if (vas <= intakeRules.pain.threshold) {
    points += intakeRules.pain.points;
    breakdown.push(`✅ ${intakeRules.pain.description} (${vas}): +${intakeRules.pain.points} point`);
  } else {
    breakdown.push(`❌ Pain (VAS ${vas} > ${intakeRules.pain.threshold}): +0 points`);
  }

  // 2. Disability Assessment (≤20% → +1 point)
  const disabilityPercentage = formData.disabilityPercentage || 0;
  if (disabilityPercentage <= intakeRules.disability.threshold) {
    points += intakeRules.disability.points;
    breakdown.push(`✅ ${intakeRules.disability.description} (${disabilityPercentage}%): +${intakeRules.disability.points} point`);
  } else {
    breakdown.push(`❌ Disability (${disabilityPercentage}% > ${intakeRules.disability.threshold}%): +0 points`);
  }

  // 3. Task Function (PSFS Average: ≥7→ +2, 4-6.9→ +1)
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

  // 4. Confidence Assessment (≥8→ +2, 5-7→ +1)
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

  // 5. Fear-Avoidance Assessment (TSK-7 ≤8 → +1 point)
  const tsk7RawScore = calculateTSK7Score(formData.tsk7);
  
  if (tsk7RawScore !== null) {
    if (tsk7RawScore <= intakeRules.fearAvoidance.threshold) {
      points += intakeRules.fearAvoidance.points;
      breakdown.push(`✅ ${intakeRules.fearAvoidance.description} (${tsk7RawScore}): +${intakeRules.fearAvoidance.points} point`);
    } else {
      breakdown.push(`❌ Fear-Avoidance (TSK-7 ${tsk7RawScore} > ${intakeRules.fearAvoidance.threshold}): +0 points`);
    }
  } else {
    breakdown.push(`❌ Fear-Avoidance (TSK-7 incomplete): +0 points`);
  }

  // 6. Pain Beliefs Assessment (PCS-4 ≤6 → +1 point)
  const calculatePCS4Score = (pcs4Data: any) => {
    if (!pcs4Data || typeof pcs4Data !== 'object') return null;
    
    let totalScore = 0;
    let answeredCount = 0;
    
    for (let i = 1; i <= 4; i++) {
      const response = pcs4Data[i];
      if (response !== undefined && response >= 0 && response <= 4) {
        totalScore += response;
        answeredCount++;
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
      breakdown.push(`❌ Pain Beliefs (PCS-4 ${pcs4TotalScore} > ${intakeRules.painBeliefs.threshold}): +0 points`);
    }
  } else {
    breakdown.push(`❌ Pain Beliefs (PCS-4 incomplete): +0 points`);
  }

  // 7. Clinician Assessments
  if (formData.recoveryMilestone) {
    points += intakeRules.clinician.milestone.points;
    breakdown.push(`✅ ${intakeRules.clinician.milestone.description}: +${intakeRules.clinician.milestone.points} point`);
  } else {
    breakdown.push(`❌ ${intakeRules.clinician.milestone.description} (not met): +0 points`);
  }

  if (formData.clinicalProgressVerified) {
    points += intakeRules.clinician.progress.points;
    breakdown.push(`✅ ${intakeRules.clinician.progress.description}: +${intakeRules.clinician.progress.points} point`);
  } else {
    breakdown.push(`❌ ${intakeRules.clinician.progress.description} (not verified): +0 points`);
  }

  console.log('📋 SRS Calculation Breakdown:');
  breakdown.forEach(item => console.log(`   ${item}`));
  console.log(`🎯 Final Baseline SRS Score: ${points}/11`);

  return points;
};

// Follow-up SRS Calculation - Range: 0-11 points
const computeFollowUpSRS = (baselineData: any, currentData: any) => {
  console.log('🔢 Backend: Starting Follow-up SRS Calculation');
  
  let points = 0;
  const breakdown: string[] = [];

  // 1. Pain Improvement (VAS decrease ≥2 → +1)
  const vasImprovement = baselineData.vas - Number(currentData.vas);
  if (vasImprovement >= followUpRules.pain.improvement) {
    points += followUpRules.pain.points;
    breakdown.push(`✅ ${followUpRules.pain.description} (${baselineData.vas} → ${currentData.vas}): +${followUpRules.pain.points} point`);
  } else {
    breakdown.push(`❌ Pain (change ${vasImprovement}): +0 points`);
  }

  // 2. Function Improvement (PSFS increase ≥4 → +2)
  if (baselineData.psfs && currentData.psfs) {
    const baselineSum = baselineData.psfs.reduce((sum: number, item: any) => sum + (item.score || 0), 0);
    const currentSum = currentData.psfs.reduce((sum: number, item: any) => sum + (item.score || 0), 0);
    const functionImprovement = currentSum - baselineSum;
    
    if (functionImprovement >= followUpRules.function.improvement) {
      points += followUpRules.function.points;
      breakdown.push(`✅ ${followUpRules.function.description} (${baselineSum} → ${currentSum}): +${followUpRules.function.points} points`);
    } else {
      breakdown.push(`❌ Function (change +${functionImprovement}): +0 points`);
    }
  } else {
    breakdown.push(`❌ Function (no data): +0 points`);
  }

  // 3. Disability Improvement (decrease ≥10% → +1)
  const disabilityImprovement = baselineData.disabilityPercentage - currentData.disabilityPercentage;
  if (disabilityImprovement >= followUpRules.disability.improvement) {
    points += followUpRules.disability.points;
    breakdown.push(`✅ ${followUpRules.disability.description} (${baselineData.disabilityPercentage}% → ${currentData.disabilityPercentage}%): +${followUpRules.disability.points} point`);
  } else {
    breakdown.push(`❌ Disability (change ${disabilityImprovement}%): +0 points`);
  }

  // 4. Confidence Improvement (increase ≥3 → +2)
  const confidenceImprovement = Number(currentData.confidence) - baselineData.confidence;
  if (confidenceImprovement >= followUpRules.confidence.improvement) {
    points += followUpRules.confidence.points;
    breakdown.push(`✅ ${followUpRules.confidence.description} (${baselineData.confidence} → ${currentData.confidence}): +${followUpRules.confidence.points} points`);
  } else {
    breakdown.push(`❌ Confidence (change +${confidenceImprovement}): +0 points`);
  }

  // 5. Beliefs Improvement (all cleared → +1)
  const baselineNegBeliefs = baselineData.beliefs ? baselineData.beliefs.filter((b: string) => b && b !== "None of these apply").length : 0;
  const currentNegBeliefs = currentData.beliefs ? currentData.beliefs.filter((b: string) => b && b !== "None of these apply").length : 0;
  
  if (baselineNegBeliefs > 0 && currentNegBeliefs === 0) {
    points += followUpRules.beliefs.points;
    breakdown.push(`✅ ${followUpRules.beliefs.description} (${baselineNegBeliefs} → 0): +${followUpRules.beliefs.points} point`);
  } else {
    breakdown.push(`❌ Beliefs (${baselineNegBeliefs} → ${currentNegBeliefs}): +0 points`);
  }

  // 6. GROC Assessment (≥+5 → +1)
  const groc = Number(currentData.groc) || 0;
  if (groc >= followUpRules.groc.threshold) {
    points += followUpRules.groc.points;
    breakdown.push(`✅ ${followUpRules.groc.description} (${groc}): +${followUpRules.groc.points} point`);
  } else {
    breakdown.push(`❌ GROC (${groc}): +0 points`);
  }

  // 7. Clinician Assessments
  if (currentData.recoveryMilestone) {
    points += followUpRules.clinician.milestone.points;
    breakdown.push(`✅ ${followUpRules.clinician.milestone.description}: +${followUpRules.clinician.milestone.points} point`);
  } else {
    breakdown.push(`❌ ${followUpRules.clinician.milestone.description} (not met): +0 points`);
  }

  if (currentData.clinicalProgressVerified) {
    points += followUpRules.clinician.progress.points;
    breakdown.push(`✅ ${followUpRules.clinician.progress.description}: +${followUpRules.clinician.progress.points} point`);
  } else {
    breakdown.push(`❌ ${followUpRules.clinician.progress.description} (not verified): +0 points`);
  }

  console.log('📋 Follow-up SRS Calculation Breakdown:');
  breakdown.forEach(item => console.log(`   ${item}`));
  console.log(`🎯 Final Follow-up SRS Score: ${points}/11`);

  return points;
};

// Enhanced phase determination function
export const getPhaseByScore = (score: number) => {
  if (score <= 3) return { label: "RESET", color: "blue" };
  if (score <= 6) return { label: "EDUCATE", color: "amber" };
  return { label: "REBUILD", color: "emerald" };
};

// Calculate disability percentage based on region and scores
const calculateDisabilityPercentage = (formData: any) => {
  const { region, ndi, tdi, odi, ulfi, lefs } = formData;
  
  let totalScore = 0;
  let maxScore = 0;
  
  if (region === "Neck" && ndi) {
    totalScore = ndi.reduce((sum: number, score: number) => sum + score, 0);
    maxScore = ndi.length * 5; // NDI: 0-5 scale, 10 questions
  } else if (region === "Mid-Back / Thoracic" && tdi) {
    totalScore = tdi.reduce((sum: number, score: number) => sum + score, 0);
    maxScore = tdi.length * 5; // TDI: 0-5 scale, 10 questions
  } else if (region === "Low Back / SI Joint" && odi) {
    totalScore = odi.reduce((sum: number, score: number) => sum + score, 0);
    maxScore = odi.length * 5; // ODI: 0-5 scale, 10 questions
  } else if (region === "Upper Limb" && ulfi) {
    totalScore = ulfi.reduce((sum: number, score: number) => sum + score, 0);
    maxScore = ulfi.length * 4; // ULFI: 0-4 scale, 25 questions
  } else if (region === "Lower Extremity" && lefs) {
    totalScore = lefs.reduce((sum: number, score: number) => sum + score, 0);
    maxScore = lefs.length * 4; // LEFS: 0-4 scale, 20 questions
  }
  
  return maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
};

// Determine belief status based on selected beliefs
const determineBeliefStatus = (beliefs: string[]) => {
  if (!beliefs || beliefs.length === 0 || beliefs.includes("None of these apply")) {
    return "Positive";
  }
  if (beliefs.length <= 2) {
    return "Neutral";
  }
  return "Negative";
};

// Get comprehensive recovery points data for patient
export const getPatientRecoveryPointsData = async (patientId: number) => {
  const recoveryPointsService = require('../services/recoveryPointsService');
  
  try {
    // Get weekly breakdown
    const weeklyBreakdown = await recoveryPointsService.getWeeklyBreakdown(patientId);
    
    // Get SRS buffer status
    const bufferStatus = await recoveryPointsService.getSRSBuffer(patientId);
    
    // Get recent activity
    const recentActivity = await recoveryPointsService.getRecentActivity(patientId, 7);
    
    // Calculate streak (consecutive days with points)
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dayStart = new Date(checkDate.setHours(0, 0, 0, 0));
      const dayEnd = new Date(checkDate.setHours(23, 59, 59, 999));
      
      const dayPoints = await prisma.recoveryPoint.aggregate({
        where: {
          patientId,
          date: {
            gte: dayStart,
            lte: dayEnd
          }
        },
        _sum: { points: true }
      });
      
      if (dayPoints._sum.points && dayPoints._sum.points > 0) {
        streak++;
      } else {
        break;
      }
    }
    
    // Calculate completion rate (percentage of days with activity in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeDays = await prisma.recoveryPoint.groupBy({
      by: ['date'],
      where: {
        patientId,
        date: {
          gte: thirtyDaysAgo
        }
      },
      _sum: { points: true },
      having: {
        points: {
          _sum: {
            gt: 0
          }
        }
      }
    });
    
    const completionRate = Math.round((activeDays.length / 30) * 100);
    
    // Determine trend
    const lastWeekTotal = weeklyBreakdown.total;
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const previousWeekPoints = await prisma.recoveryPoint.aggregate({
      where: {
        patientId,
        date: {
          gte: twoWeeksAgo,
          lt: oneWeekAgo
        }
      },
      _sum: { points: true }
    });
    
    const previousWeekTotal = previousWeekPoints._sum.points || 0;
    let trend = 'stable';
    if (lastWeekTotal > previousWeekTotal * 1.1) trend = 'improving';
    else if (lastWeekTotal < previousWeekTotal * 0.9) trend = 'declining';
    
    return {
      total: bufferStatus.movementRP + bufferStatus.lifestyleRP + bufferStatus.mindsetRP + bufferStatus.educationRP,
      thisWeek: lastWeekTotal,
      lastWeek: previousWeekTotal,
      weeklyAverage: Math.round((lastWeekTotal + previousWeekTotal) / 2),
      trend,
      lastActivity: recentActivity[0]?.date?.toISOString()?.split('T')[0] || null,
      streakDays: streak,
      completionRate,
      breakdown: weeklyBreakdown.breakdown,
      bufferStatus
    };
  } catch (error) {
    console.error('Error getting comprehensive recovery points data:', error);
    return {
      total: 0,
      thisWeek: 0,
      lastWeek: 0,
      weeklyAverage: 0,
      trend: 'stable',
      lastActivity: null,
      streakDays: 0,
      completionRate: 0,
      breakdown: {
        MOVEMENT: 0,
        LIFESTYLE: 0,
        MINDSET: 0,
        EDUCATION: 0,
        ADHERENCE: 0
      },
      bufferStatus: null
    };
  }
};

export const submitIntake = async (req: any, res: any) => {
  try {
    console.log('Received comprehensive intake submission:', req.body);
    const { 
      patientName, 
      email, 
      dob, // Date of Birth
      date, 
      formType, 
      region,
      // Disability Index Arrays
      ndi,
      tdi, // Add TDI
      odi, 
      ulfi,
      lefs,
      // Pain and Function
      vas, 
      psfs, 
      // Cognitive Assessment
      pcs4,
      tsk7,
      beliefs, 
      confidence, 
      // Follow-up specific
      groc,
      // Clinical verification
      recoveryMilestone,
      clinicalProgressVerified
    } = req.body;
    
    // Calculate disability percentage
    const disabilityPercentage = calculateDisabilityPercentage({
      region, ndi, tdi, odi, ulfi, lefs
    });
    
    // Check if patient already exists
    let patient = await findPatientByEmail(email);
    let previousData = null;
    
    if (!patient) {
      console.log('Creating new patient:', patientName, email, date, dob);
      // Create new patient
      const newPatient = await createPatient(patientName, email, new Date(date), dob);
      console.log('Patient created:', newPatient);
      
      // Create patient portal account (with temporary password)
      const tempPassword = Math.random().toString(36).slice(-8); // Simple temp password
      await createPatientPortalAccount(newPatient.id, email, tempPassword);
      console.log('Patient portal account created');
      
      // Initialize Recovery Points system for new patient
      const recoveryPointsService = require('../services/recoveryPointsService');
      await recoveryPointsService.initializePatientRecoveryPoints(newPatient.id);
      console.log('Recovery points system initialized');
      
      // Get the full patient record with relations
      patient = await findPatientByEmail(email);
    } else {
      console.log('Patient already exists:', patient);
      // Get previous data for SRS calculation
      previousData = await getLatestSRSScore(patient.id);
    }
    
    if (!patient) {
      throw new Error('Failed to create or find patient');
    }
    
    // Calculate SRS score
    const srsScore = calculateSRS({
      vas, psfs, pcs4, tsk7, disabilityPercentage, confidence, beliefs, groc, formType,
      recoveryMilestone, clinicalProgressVerified
    }, previousData);
    
    console.log('🔢 SRS Score calculated:', srsScore, 'Type:', typeof srsScore);
    
    // NEW: Calculate continuous SRS components (0-100 scale)
    const continuousSRS = calculateContinuousSRS({
      vas, psfs, pcs4, tsk7, disabilityPercentage
    });
    
    // NEW: Store assessment results
    await storeAssessmentResults(patient.id, { pcs4, tsk7 });
    
    // NEW: Update or create SRSDaily record
    await updateSRSDaily(patient.id, continuousSRS);
    
    // Prepare comprehensive SRS data
    const srsData = {
      date: new Date(date),
      formType: formType || "Intake",
      region,
      // Disability Index data
      ndi: ndi || null,
      tdi: tdi || null, // Add TDI
      odi: odi || null,
      ulfi: ulfi || null,
      lefs: lefs || null,
      disabilityPercentage,
      // Pain and Function
      vas: Number(vas),
      psfs: psfs || [],
      // Cognitive Assessment
      pcs4: pcs4 || null,
      tsk7: tsk7 || null,
      beliefs: beliefs || [],
      confidence: Number(confidence),
      // Follow-up specific
      groc: Number(groc) || 0,
      // Calculated values
      srsScore,
      beliefStatus: determineBeliefStatus(beliefs),
      // Clinical verification
      recoveryMilestone: recoveryMilestone || false,
      clinicalProgressVerified: clinicalProgressVerified || false
    };
    
    console.log('Adding comprehensive SRS score:', srsData);
    const srsScoreRecord = await addSRSScore(patient.id, srsData);
    console.log('SRS score added:', srsScoreRecord);
    
    // Determine phase and send welcome email
    const phase = getPhaseByScore(srsScore);
    const firstName = patientName.split(' ')[0]; // Get first name
    
    // Generate setup link
    const baseUrl = process.env.PATIENT_PORTAL_URL || 'http://localhost:3000';
    const setupLink = generateSetupLink(email, patient.id, baseUrl);
    
    // Send welcome email (using dev mode for development)
    const emailSent = await sendWelcomeEmailDev({
      firstName,
      email,
      phase: phase.label,
      setupLink
    });
    
    res.status(201).json({ 
      success: true,
      patient, 
      srsScore: srsScoreRecord, 
      phase: phase.label,
      disabilityPercentage,
      beliefStatus: srsData.beliefStatus,
      continuousSRS, // NEW: Include continuous SRS
      emailSent,
      setupLink: process.env.NODE_ENV === 'development' ? setupLink : undefined,
      message: `${formType || 'Intake'} assessment processed successfully. Patient ${formType === 'Follow-Up' ? 'progress updated' : 'enrolled'} in Back to Life program.`
    });
  } catch (err) {
    console.error('Error in submitIntake:', err);
    res.status(500).json({ 
      success: false,
      error: (err as Error).message 
    });
  }
};

// NEW: Calculate continuous SRS (0-100 scale)
const calculateContinuousSRS = (formData: any) => {
  console.log('🔢 Calculating continuous SRS (0-100 scale)');
  
  // 1. Pain component (0-100): VAS 0-10 → 0-100 (inverted)
  const pain = Math.max(0, 100 - (formData.vas * 10));
  
  // 2. Function component (0-100): PSFS average 0-10 → 0-100
  let functionScore = 0;
  if (formData.psfs && formData.psfs.length > 0) {
    const avgPSFS = formData.psfs.reduce((sum: number, item: any) => sum + (item.score || 0), 0) / formData.psfs.length;
    functionScore = Math.min(100, avgPSFS * 10);
  }
  
  // 3. Psychological load (0-100): PCS-4 + stress component
  let psychLoad = 0;
  if (formData.pcs4) {
    const pcs4Score = calculatePCS4ScoreFromData(formData.pcs4);
    if (pcs4Score !== null) {
      // PCS-4: 0-16 → 0-100 (higher = more catastrophizing = higher psych load)
      psychLoad = Math.min(100, (pcs4Score / 16) * 100);
    }
  }
  
  // 4. Fear-avoidance (0-100): TSK-7 raw → normalized
  let fa = 0;
  if (formData.tsk7) {
    const tsk7Raw = calculateTSK7Score(formData.tsk7);
    if (tsk7Raw !== null) {
      // Normalize TSK-7 score (7-28) to 0-100 scale
      fa = ((tsk7Raw - 7) / 21) * 100;
    }
  }
  
  // Calculate continuous SRS: 4-way average
  const continuousSRS = (pain + functionScore + (100 - psychLoad) + (100 - fa)) / 4;
  
  console.log('📊 Continuous SRS Components:');
  console.log(`   Pain: ${pain.toFixed(1)}/100`);
  console.log(`   Function: ${functionScore.toFixed(1)}/100`);
  console.log(`   Psych Load: ${psychLoad.toFixed(1)}/100 (inverted: ${(100 - psychLoad).toFixed(1)})`);
  console.log(`   Fear-Avoidance: ${fa.toFixed(1)}/100 (inverted: ${(100 - fa).toFixed(1)})`);
  console.log(`   Final Continuous SRS: ${continuousSRS.toFixed(1)}/100`);
  
  return {
    pain,
    function: functionScore,
    psychLoad,
    fa,
    continuousSRS: Math.round(continuousSRS)
  };
};

// Helper function to calculate PCS-4 score
const calculatePCS4ScoreFromData = (pcs4Data: any) => {
  if (!pcs4Data || typeof pcs4Data !== 'object') return null;
  
  let totalScore = 0;
  let answeredCount = 0;
  
  for (let i = 1; i <= 4; i++) {
    const response = pcs4Data[i];
    if (response !== undefined && response >= 0 && response <= 4) {
      totalScore += response;
      answeredCount++;
    }
  }
  
  return answeredCount === 4 ? totalScore : null;
};

// NEW: Store assessment results
const storeAssessmentResults = async (patientId: number, assessments: any) => {
  try {
    // Store PCS-4 score
    if (assessments.pcs4) {
      const pcs4Score = calculatePCS4ScoreFromData(assessments.pcs4);
      if (pcs4Score !== null) {
        await prisma.assessmentResult.create({
          data: {
            patientId,
            name: 'PCS4',
            score: pcs4Score
          }
        });
        console.log(`📊 Stored PCS-4 score: ${pcs4Score}`);
      }
    }
    
      // Store TSK-7 score
  if (assessments.tsk7) {
    const tsk7Score = calculateTSK7Score(assessments.tsk7);
    if (tsk7Score !== null) {
      await prisma.assessmentResult.create({
        data: {
          patientId,
          name: 'TSK7',
          score: tsk7Score
        }
      });
      console.log(`📊 Stored TSK-7 score: ${tsk7Score}`);
    }
  }
  } catch (error) {
    console.error('Error storing assessment results:', error);
  }
};

// NEW: Update SRSDaily record
const updateSRSDaily = async (patientId: number, continuousSRS: any) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    await prisma.sRSDaily.upsert({
      where: {
        patientId_date: {
          patientId,
          date: today
        }
      },
      update: {
        pain: continuousSRS.pain,
        function: continuousSRS.function,
        psychLoad: continuousSRS.psychLoad,
        fa: continuousSRS.fa
      },
      create: {
        patientId,
        date: today,
        pain: continuousSRS.pain,
        function: continuousSRS.function,
        psychLoad: continuousSRS.psychLoad,
        fa: continuousSRS.fa
      }
    });
    
    console.log(`📊 Updated SRSDaily for patient ${patientId}:`, continuousSRS);
  } catch (error) {
    console.error('Error updating SRSDaily:', error);
  }
};

export const getPatientLatestScore = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const score = await getLatestSRSScore(Number(id));
    res.json(score);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const getAllPatientsWithScores = async (_req: any, res: any) => {
  try {
    console.log('getAllPatientsWithScores route HIT');
    const patients = await getAllPatientsWithLatestScores();
    
    // Transform data for clinician dashboard
    const transformedPatients = await Promise.all(patients.map(async (patient: any) => {
      const latestScore = patient.srsScores?.[0];
      
      return {
        id: patient.id,
        name: patient.name,
        email: patient.email,
        intakeDate: patient.createdAt,
        formType: latestScore?.formType || "Intake",
        region: latestScore?.region || "Unknown",
        srs: latestScore?.srsScore || 0,
        prevSrs: patient.srsScores?.[1]?.srsScore || null,
        groc: latestScore?.groc || 0,
        painScore: latestScore?.vas || 0,
        confidence: latestScore?.confidence || 0,
        phase: getPhaseByScore(latestScore?.srsScore || 0).label,
        psfs: latestScore?.psfs || [],
        beliefStatus: latestScore?.beliefStatus || "Unknown",
        beliefs: latestScore?.beliefs || [],
        disabilityIndex: latestScore?.disabilityPercentage || 0,
        // Disability index arrays
        ndi: latestScore?.ndi || null,
        odi: latestScore?.odi || null,
        ulfi: latestScore?.ulfi || null,
        lefs: latestScore?.lefs || null,
        // Cognitive assessments
        pcs4: latestScore?.pcs4 || null,
        tsk7: latestScore?.tsk7 || null,
        lastUpdate: latestScore?.date || patient.createdAt,
        notes: [], // Clinical notes would come from a separate table
        // Real recovery points data from database
        recoveryPoints: await getPatientRecoveryPointsData(patient.id)
      };
    }));
    
    res.json(transformedPatients);
  } catch (err) {
    console.error('Error in getAllPatientsWithScores:', err);
    res.status(500).json({ error: (err as Error).message });
  }
};

export const deletePatient = async (req: any, res: any) => {
  const { id } = req.params;
  const patientId = Number(id);

  if (isNaN(patientId)) {
    return res.status(400).json({ error: "Invalid patient ID" });
  }

  try {
    console.log(`Attempting to delete patient with ID: ${patientId}`);

    // Use a transaction to ensure all or nothing is deleted
    await prisma.$transaction(async (tx) => {
      // 1. Delete all related SRSScore records
      await tx.sRSScore.deleteMany({
        where: { patientId: patientId },
      });
      console.log(`Deleted SRS scores for patient ID: ${patientId}`);

      // 2. Delete the related PatientPortal record
      await tx.patientPortal.deleteMany({
        where: { patientId: patientId },
      });
      console.log(`Deleted patient portal account for patient ID: ${patientId}`);

      // 3. Finally, delete the patient
      await tx.patient.delete({
        where: { id: patientId },
      });
      console.log(`Successfully deleted patient with ID: ${patientId}`);
    });

    res.status(200).json({ message: "Patient deleted successfully" });

  } catch (err) {
    console.error(`Error deleting patient with ID ${patientId}:`, err);
    res.status(500).json({
      message: "Failed to delete patient due to a server error.",
      error: (err as Error).message
    });
  }
}; 