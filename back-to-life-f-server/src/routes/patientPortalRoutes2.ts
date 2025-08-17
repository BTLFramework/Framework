import express from 'express';
import { verifySetupToken, verifyToken } from '../services/jwtService';
import { 
  findPatientPortalByEmail, 
  updatePatientPortalPassword 
} from '../models/patientModel';

const router = express.Router();

// Verify setup token and get patient info
router.get('/verify-setup-token/:token', async (req: any, res: any) => {
  try {
    const { token } = req.params;
    
    const payload = verifySetupToken(token);
    
    if (!payload) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    
    const patientPortal = await findPatientPortalByEmail(payload.email);
    
    if (!patientPortal) {
      return res.status(404).json({ error: 'Patient portal account not found' });
    }
    
    res.json({
      email: payload.email,
      patientName: patientPortal.patient.name,
      isValid: true
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Set password for patient portal
router.post('/set-password', async (req: any, res: any) => {
  try {
    const { token, password } = req.body;
    
    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }
    
    const payload = verifySetupToken(token);
    
    if (!payload) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    
    // Update password
    await updatePatientPortalPassword(payload.email, password);
    
    res.json({ 
      message: 'Password set successfully',
      email: payload.email
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Test route to see which file is being used
router.get('/test-route', (req: any, res: any) => {
  res.json({ message: 'TypeScript file is being used' });
});

// Create account for patient portal (after intake completion)
router.post('/create-account', async (req: any, res: any) => {
  try {
    const { email, password, patientName } = req.body;
    
    if (!email || !password || !patientName) {
      return res.status(400).json({ error: 'Email, password, and patient name are required' });
    }
    
    // Find existing patient portal account (created during intake)
    const patientPortal = await findPatientPortalByEmail(email);
    
    if (!patientPortal) {
      return res.status(404).json({ error: 'Patient portal account not found. Please complete your intake form first.' });
    }
    
    // Update the password (replacing the temporary one)
    await updatePatientPortalPassword(email, password);
    
    console.log(`✅ Password updated for patient: ${email}`);
    
    res.json({ 
      message: 'Account created successfully',
      email: email,
      patientName: patientName
    });
  } catch (error) {
    console.error('Create account error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Patient login
router.post('/login', async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    
    console.log(`🔐 Login attempt for: ${email}`);
    
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const patientPortal = await findPatientPortalByEmail(email);
    
    if (!patientPortal) {
      console.log(`❌ No patient portal account found for: ${email}`);
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    console.log(`🔍 Found patient portal account for: ${email}`);
    console.log(`🔑 Stored password: ${patientPortal.password}`);
    console.log(`🔑 Provided password: ${password}`);
    
    if (patientPortal.password !== password) {
      console.log(`❌ Password mismatch for: ${email}`);
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    console.log(`✅ Password match for: ${email}`);
    
    // Generate JWT token for patient
    const { generatePatientToken } = require('../services/jwtService');
    const token = generatePatientToken(patientPortal);
    
    console.log(`🎫 JWT token generated for: ${email}`);
    
    // Set JWT as HTTP-only cookie
    res.cookie('patientToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    
    console.log(`✅ Login successful for: ${email}`);
    
    res.json({
      message: 'Login successful',
      patient: patientPortal.patient
      // Do NOT include token here
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get("/profile", async (req: any, res: any) => {
  try {
    // Read token from cookie instead of Authorization header
    const token = req.cookies.patientToken;
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const { verifyToken } = require('../services/jwtService');
    const payload = verifyToken(token);
    
    if (!payload || payload.role !== 'patient') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    const patientPortal = await findPatientPortalByEmail(payload.email);
    
    if (!patientPortal) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    // Include SRS scores in the response
    const prisma = require('../db').default;
    
    const patientWithScores = await prisma.patient.findUnique({
      where: { id: patientPortal.patientId },
      include: {
        srsScores: {
          orderBy: { date: 'desc' }
        }
      }
    });
    
    res.json(patientWithScores);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Test endpoint with mock patient data (no authentication required)
router.get('/test-profile', async (req: any, res: any) => {
  try {
    // Mock patient data for testing the beautiful dashboard
    const mockPatient = {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      srsScores: [
        {
          id: 1,
          srsScore: 7,
          confidence: 8,
          groc: 2,
          date: new Date().toISOString(),
          psfs: [
            { activity: "Walking", score: 8 },
            { activity: "Lifting groceries", score: 6 },
            { activity: "Playing with kids", score: 7 }
          ]
        }
      ]
    };
    
    res.json(mockPatient);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get assigned exercises for movement session
router.get('/exercises/:email', async (req: any, res: any) => {
  try {
    const { email } = req.params;
    // Import patient model functions
    const { findPatientByEmail, getLatestSRSScore } = require('../models/patientModel');
    // Find patient by email
    const patient = await findPatientByEmail(email);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    // Get latest SRS score to determine phase
    const latestSRS = await getLatestSRSScore(patient.id);
    const srsScore = latestSRS?.srsScore || 0;
    // Determine phase based on SRS score
    let phase;
    if (srsScore <= 3) phase = "Reset";
    else if (srsScore <= 6) phase = "Educate";
    else phase = "Rebuild";
    // Get region from latest assessment or default
    const region = latestSRS?.region || "Neck";
    // Import exercise library
    const { exercises } = require('../../config/exerciseConfig');
    // Filter exercises by region and phase
    let availableExercises = exercises.filter((ex: any) => 
      ex.region === region && ex.phase === phase
    );
    // If not enough exercises in current phase, get from other phases
    if (availableExercises.length < 3) {
      const phases = ["Reset", "Educate", "Rebuild"];
      for (const otherPhase of phases) {
        if (otherPhase !== phase) {
          const additionalExercises = exercises.filter((ex: any) => 
            ex.region === region && ex.phase === otherPhase
          );
          availableExercises = [...availableExercises, ...additionalExercises];
          if (availableExercises.length >= 3) break;
        }
      }
    }
    // Select exactly 3 exercises, prioritizing those that sum to 10 points
    let bestCombination = null;
    let bestScore = Infinity;
    for (let i = 0; i < availableExercises.length - 2; i++) {
      for (let j = i + 1; j < availableExercises.length - 1; j++) {
        for (let k = j + 1; k < availableExercises.length; k++) {
          const combo = [
            availableExercises[i],
            availableExercises[j],
            availableExercises[k]
          ];
          const totalPoints = combo.reduce((sum: any, ex: any) => sum + ex.points, 0);
          const difference = Math.abs(totalPoints - 10);
          if (difference < bestScore) {
            bestScore = difference;
            bestCombination = combo;
          }
        }
      }
    }
    // If no combination found, take first 3 exercises
    if (!bestCombination && availableExercises.length >= 3) {
      bestCombination = availableExercises.slice(0, 3);
    }
    // If still not enough exercises, pad with placeholder
    while (bestCombination && bestCombination.length < 3) {
      bestCombination.push({
        id: `placeholder_${bestCombination.length}`,
        name: "Additional exercise",
        description: "Exercise to be assigned",
        duration: "5-10 minutes",
        difficulty: "Beginner",
        points: 3,
        instructions: ["Exercise details coming soon"],
        videoId: "placeholder"
      });
    }
    const totalPoints = bestCombination ? bestCombination.reduce((sum: any, ex: any) => sum + ex.points, 0) : 0;
    res.json({
      success: true,
      data: {
        exercises: bestCombination || [],
        totalPoints,
        region,
        phase,
        srsScore
      }
    });
  } catch (error) {
    console.error('Error getting assigned exercises:', error);
    res.status(500).json({ error: 'Failed to get assigned exercises' });
  }
});

// Patient logout
router.post('/logout', (req: any, res: any) => {
  res.clearCookie('patientToken', { path: '/' });
  res.json({ message: 'Logged out' });
});

// Get all SRS scores for a patient by ID
router.get('/patients/:id/srs-scores', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { findPatientById } = require('../models/patientModel');
    const patient = await findPatientById(Number(id));
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    return res.json({ success: true, data: patient.srsScores || [] });
  } catch (error) {
    console.error('Error fetching SRS scores:', error);
    return res.status(500).json({ error: 'Failed to fetch SRS scores' });
  }
});

export default router; 