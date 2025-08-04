import { Router } from "express";
import { submitIntake, getPatientLatestScore, getAllPatientsWithScores, deletePatient, getPatientRecoveryPointsData, getPhaseByScore } from "../controllers/patientController";
import { findPatientByEmail, getLatestSRSScore } from "../models/patientModel";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = Router();

// Add logging middleware to this router
router.use((req, res, next) => {
  console.log(`PatientRoutes: ${req.method} ${req.path}`);
  next();
});

router.post("/submit-intake", submitIntake);
router.get("/patient/:id/score", getPatientLatestScore);
router.get("/", getAllPatientsWithScores);
router.delete("/:id", deletePatient);

// Update patient portal password for testing
router.post("/update-portal-password", async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    
    // Update the portal account password
    const portalAccount = await prisma.patientPortal.update({
      where: { email },
      data: { password }
    });
    
    res.json({
      success: true,
      message: "Patient portal password updated successfully",
      data: {
        email: portalAccount.email
      }
    });
  } catch (error) {
    console.error('Error updating patient portal password:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to update patient portal password'
    });
  }
});

// Create patient portal account for testing
router.post("/create-portal-account", async (req: any, res: any) => {
  try {
    const { email, password, patientName } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    
    // Check if portal account already exists
    const existingPortal = await prisma.patientPortal.findUnique({
      where: { email }
    });
    
    if (existingPortal) {
      return res.status(400).json({ error: "Portal account already exists" });
    }
    
    // Find the patient first
    let patient = await findPatientByEmail(email);
    
    // If patient doesn't exist and we have patientName, create the patient
    if (!patient && patientName) {
      console.log('Creating new patient for direct signup:', { email, patientName });
      const newPatient = await prisma.patient.create({
        data: {
          name: patientName,
          email: email,
          intakeDate: new Date(),
        },
      });
      patient = await findPatientByEmail(email); // Get the full patient object with relations
    }
    
    // If still no patient found, return error
    if (!patient) {
      return res.status(404).json({ error: "Patient not found. Please complete intake first or provide patient name for direct signup." });
    }
    
    // Create the portal account
    const portalAccount = await prisma.patientPortal.create({
      data: {
        patientId: patient.id,
        email,
        password
      }
    });
    
    res.json({
      success: true,
      message: "Patient portal account created successfully",
      data: {
        email: portalAccount.email,
        patientId: portalAccount.patientId,
        patientName: patient.name
      }
    });
  } catch (error) {
    console.error('Error creating patient portal account:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to create patient portal account',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get patient by email with SRS scores
router.get("/by-email/:email", async (req: any, res: any) => {
  try {
    const { email } = req.params;
    console.log('Fetching patient by email:', email);
    
    const patient = await findPatientByEmail(email);
    
    if (!patient) {
      return res.status(404).json({ 
        error: 'Patient not found',
        message: 'No patient found with this email address'
      });
    }
    
    res.json(patient);
  } catch (error) {
    console.error('Error fetching patient by email:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to fetch patient data'
    });
  }
});

// Get SRS scores for a patient
router.get("/:id/srs-scores", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const patientId = parseInt(id);
    
    if (isNaN(patientId)) {
      return res.status(400).json({ error: "Invalid patient ID" });
    }
    
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    const srsScores = await prisma.sRSScore.findMany({
      where: { patientId },
      orderBy: { date: 'desc' }
    });
    
    res.json({
      success: true,
      data: srsScores
    });
  } catch (error) {
    console.error('Error fetching SRS scores:', error);
    res.status(500).json({ error: 'Failed to fetch SRS scores' });
  }
});

// Get patient portal data by email
router.get("/portal-data/:email", async (req: any, res: any) => {
  try {
    const { email } = req.params;
    console.log('🔍 Fetching portal data for email:', email);
    
    const patient = await findPatientByEmail(email);
    
    if (!patient) {
      return res.status(404).json({ 
        error: 'Patient not found',
        message: 'No patient found with this email address'
      });
    }
    
    // Get latest SRS score
    const latestScore = await getLatestSRSScore(patient.id);

    // Get recovery points data
    const recoveryPointsData = await getPatientRecoveryPointsData(patient.id);

    // Determine phase
    const phase = getPhaseByScore(latestScore?.srsScore || 0);

    // Always include all assessment/intake fields, even if empty
    res.json({
      success: true,
      data: {
        patient: {
          id: patient.id,
          name: patient.name,
          email: patient.email,
          intakeDate: patient.createdAt
        },
        srsScore: latestScore?.srsScore || 0,
        phase: phase.label,
        recoveryPoints: recoveryPointsData,
        lastUpdated: latestScore?.date || patient.createdAt,
        // Detailed assessment fields
        region: latestScore?.region || null,
        ndi: latestScore?.ndi || null,
        odi: latestScore?.odi || null,
        ulfi: latestScore?.ulfi || null,
        lefs: latestScore?.lefs || null,
        disabilityPercentage: latestScore?.disabilityPercentage || null,
        vas: latestScore?.vas || null,
        psfs: latestScore?.psfs || null,
        pcs4: latestScore?.pcs4 || null,
        tsk7: latestScore?.tsk7 || null,
        beliefs: latestScore?.beliefs || null,
        confidence: latestScore?.confidence || null,
        groc: latestScore?.groc || null,
        beliefStatus: latestScore?.beliefStatus || null
      }
    });
  } catch (error) {
    console.error('Error fetching portal data:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to fetch patient portal data'
    });
  }
});

// Update patient engagement
router.post("/update-engagement", async (req: any, res: any) => {
  try {
    const { email, activityType, data } = req.body;
    
    console.log('📊 Updating patient engagement:', { email, activityType, data });
    
    // Find patient by email
    const patient = await findPatientByEmail(email);
    if (!patient) {
      return res.status(404).json({ 
        error: 'Patient not found',
        message: 'No patient found with this email address'
      });
    }
    
    // Store engagement data (you can expand this based on your needs)
    // For now, just log the engagement
    console.log('✅ Engagement updated successfully for patient:', patient.name);
    
    res.json({
      success: true,
      message: 'Engagement updated successfully',
      data: {
        patientId: patient.id,
        activityType,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error updating engagement:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to update engagement'
    });
  }
});

// Submit daily pain and stress assessment
router.post("/daily-assessment", async (req: any, res: any) => {
  try {
    const { patientId, pain, stress, mood, painArea, functionLikert, triggers, stressFactors } = req.body;
    
    console.log('📊 Received daily assessment:', { patientId, pain, stress, mood });
    
    // Find patient by email if patientId is email format
    let numericPatientId = parseInt(patientId);
    if (isNaN(numericPatientId)) {
      const patient = await prisma.patient.findUnique({
        where: { email: patientId }
      });
      if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
      }
      numericPatientId = patient.id;
    }
    
    // Convert to 0-100 scale for storage
    const painNormalized = (pain / 10) * 100; // Convert 0-10 to 0-100
    const stressNormalized = (stress / 10) * 100; // Convert 0-10 to 0-100
    
    // Calculate psychLoad based on stress and any existing PCS-4 data
    let psychLoad = stressNormalized;
    
    // Get latest SRS score to check for PCS-4 data
    const latestSRS = await prisma.sRSScore.findFirst({
      where: { patientId: numericPatientId },
      orderBy: { date: 'desc' }
    });
    
    if (latestSRS && latestSRS.pcs4) {
      // Calculate PCS-4 contribution to psychLoad
      const pcs4Data = latestSRS.pcs4 as any;
      let pcs4Total = 0;
      for (let i = 1; i <= 4; i++) {
        if (pcs4Data[i] !== undefined) {
          pcs4Total += pcs4Data[i];
        }
      }
      // Normalize PCS-4 (0-16) to 0-100 and average with stress
      const pcs4Normalized = (pcs4Total / 16) * 100;
      psychLoad = (stressNormalized + pcs4Normalized) / 2;
    }
    
    // Calculate function score based on functionLikert
    let functionScore = 100; // Default to perfect function
    if (functionLikert) {
      const functionMap: { [key: string]: number } = {
        "No limit": 100,
        "A little": 80,
        "Some": 60,
        "A lot": 40,
        "Couldn't do much": 20
      };
      functionScore = functionMap[functionLikert] || 100;
    }
    
    // Store in SRSDaily table (upsert for today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dailyRecord = await prisma.sRSDaily.upsert({
      where: {
        patientId_date: {
          patientId: numericPatientId,
          date: today
        }
      },
      update: {
        pain: painNormalized,
        function: functionScore,
        psychLoad: psychLoad
      },
      create: {
        patientId: numericPatientId,
        date: today,
        pain: painNormalized,
        function: functionScore,
        psychLoad: psychLoad
      }
    });
    
    console.log('✅ Daily assessment stored:', dailyRecord);
    
    res.json({
      success: true,
      data: {
        id: dailyRecord.id,
        pain: painNormalized,
        stress: stressNormalized,
        psychLoad: psychLoad,
        function: functionScore,
        date: dailyRecord.date
      }
    });
    
  } catch (error) {
    console.error('❌ Error storing daily assessment:', error);
    res.status(500).json({ error: "Failed to store daily assessment" });
  }
});

// Get latest daily assessment data for recovery insights
router.get("/daily-data/:email", async (req: any, res: any) => {
  try {
    const { email } = req.params;
    console.log('📊 Fetching daily data for:', email);
    
    // Find patient by email
    const patient = await prisma.patient.findUnique({
      where: { email: email }
    });
    
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    
    // Get latest daily assessment
    const latestDaily = await prisma.sRSDaily.findFirst({
      where: { patientId: patient.id },
      orderBy: { date: 'desc' }
    });
    
    if (!latestDaily) {
      return res.json({
        success: false,
        message: 'No daily assessment data found'
      });
    }
    
    console.log('✅ Latest daily data found:', latestDaily);
    
    res.json({
      success: true,
      data: {
        id: latestDaily.id,
        patientId: latestDaily.patientId,
        date: latestDaily.date,
        pain: latestDaily.pain,
        function: latestDaily.function,
        psychLoad: latestDaily.psychLoad,
        fa: latestDaily.fa
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching daily data:', error);
    res.status(500).json({ error: "Failed to fetch daily data" });
  }
});

// Get patient progress history for trend chart
router.get('/progress-history/:email', async (req: any, res: any) => {
  try {
    const { email } = req.params;
    console.log(`📊 Fetching progress history for: ${email}`);

    // Find patient by email
    const patient = await prisma.patient.findUnique({
      where: { email },
      include: {
        srsScores: {
          orderBy: { date: 'asc' },
          select: {
            date: true,
            srsScore: true,
            formType: true
          }
        }
      }
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }

    // Transform SRS scores into progress history format
    const progressHistory = patient.srsScores.map(score => {
      // Determine phase based on SRS score
      let phase = 'RESET';
      if (score.srsScore >= 8) {
        phase = 'REBUILD';
      } else if (score.srsScore >= 4) {
        phase = 'EDUCATE';
      }

      return {
        date: score.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
        score: score.srsScore,
        phase: phase,
        formType: score.formType
      };
    });

    console.log(`✅ Found ${progressHistory.length} progress entries for ${email}`);

    res.json({
      success: true,
      data: {
        patient: {
          name: patient.name,
          email: patient.email
        },
        progressHistory
      }
    });

  } catch (error) {
    console.error('❌ Error fetching progress history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch progress history'
    });
  }
});

// Record patient activity
router.post("/activity", async (req: any, res: any) => {
  try {
    const { email, activityType, data } = req.body;
    
    console.log('📊 Recording patient activity:', { email, activityType, data });
    
    // Find patient by email
    const patient = await findPatientByEmail(email);
    if (!patient) {
      return res.status(404).json({ 
        error: 'Patient not found',
        message: 'No patient found with this email address'
      });
    }
    
    // Store activity data in database (you can expand this based on your needs)
    // For now, just log the activity
    console.log('✅ Activity recorded successfully for patient:', patient.name);
    
    res.json({
      success: true,
      message: 'Activity recorded successfully',
      data: {
        patientId: patient.id,
        activityType,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error recording activity:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to record activity'
    });
  }
});

export default router;