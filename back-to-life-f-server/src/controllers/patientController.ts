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

const prisma = new PrismaClient();

// Enhanced SRS calculation function
const calculateSRS = (formData: any, previousData?: any) => {
  let score = 0;
  
  // For initial intake, we establish baseline - no points awarded yet
  if (!previousData) {
    return 0; // Initial intake establishes baseline only
  }
  
  // VAS reduction ≥ 2 points (+1 point)
  if (previousData.vas - Number(formData.vas) >= 2) {
    score += 1;
  }
  
  // PSFS improvement ≥ 4 points combined (+2 points)
  const prevPSFSSum = previousData.psfs.reduce((sum: number, item: any) => sum + (item.score || 0), 0);
  const currPSFSSum = formData.psfs.reduce((sum: number, item: any) => sum + (item.score || 0), 0);
  if (currPSFSSum - prevPSFSSum >= 4) {
    score += 2;
  }
  
  // Disability Index improvement ≥ 10% (+1 point)
  if (previousData.disabilityPercentage - formData.disabilityPercentage >= 10) {
    score += 1;
  }
  
  // Confidence increase ≥ 3 points (+2 points)
  if (Number(formData.confidence) - previousData.confidence >= 3) {
    score += 2;
  }
  
  // Beliefs resolved - "None of these apply" (+1 point)
  if (formData.beliefs.includes("None of these apply")) {
    score += 1;
  }
  
  // GROC ≥ +5 (Follow-up only) (+1 point)
  if (formData.formType === "Follow-Up" && Number(formData.groc) >= 5) {
    score += 1;
  }
  
  // Recovery Milestone (manual clinical assessment) (+1 point)
  if (formData.recoveryMilestone) {
    score += 1;
  }
  
  // Clinical Progress Verified (+1 point)
  if (formData.clinicalProgressVerified) {
    score += 1;
  }
  
  // Cap at 11
  return Math.min(score, 11);
};

// Enhanced phase determination function
const getPhaseByScore = (score: number) => {
  if (score <= 3) return { label: "RESET", color: "blue" };
  if (score <= 6) return { label: "EDUCATE", color: "amber" };
  return { label: "REBUILD", color: "emerald" };
};

// Calculate disability percentage based on region and scores
const calculateDisabilityPercentage = (formData: any) => {
  const { region, ndi, odi, ulfi, lefs } = formData;
  
  let totalScore = 0;
  let maxScore = 0;
  
  if (region === "Neck" && ndi) {
    totalScore = ndi.reduce((sum: number, score: number) => sum + score, 0);
    maxScore = ndi.length * 5; // NDI: 0-5 scale, 10 questions
  } else if (region === "Lower Back" && odi) {
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
const getPatientRecoveryPointsData = async (patientId: number) => {
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
      date, 
      formType, 
      region,
      // Disability Index Arrays
      ndi,
      odi, 
      ulfi,
      lefs,
      // Pain and Function
      vas, 
      psfs, 
      // Cognitive Assessment
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
      region, ndi, odi, ulfi, lefs
    });
    
    // Check if patient already exists
    let patient = await findPatientByEmail(email);
    let previousData = null;
    
    if (!patient) {
      console.log('Creating new patient:', patientName, email, date);
      // Create new patient
      const newPatient = await createPatient(patientName, email, new Date(date));
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
      vas, psfs, disabilityPercentage, confidence, beliefs, groc, formType,
      recoveryMilestone, clinicalProgressVerified
    }, previousData);
    
    // Prepare comprehensive SRS data
    const srsData = {
      date: new Date(date),
      formType: formType || "Intake",
      region,
      // Disability Index data
      ndi: ndi || null,
      odi: odi || null,
      ulfi: ulfi || null,
      lefs: lefs || null,
      disabilityPercentage,
      // Pain and Function
      vas: Number(vas),
      psfs: psfs || [],
      // Cognitive Assessment
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
    
    // Send welcome email (using dev mode for now)
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