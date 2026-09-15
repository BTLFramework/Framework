import express from 'express';
import { verifyToken } from '../services/jwtService';
import { 
  findPatientPortalByEmail, 
  updatePatientPortalPassword 
} from '../models/patientModel';
import { isStrongPatientPassword, verifyPatientPassword } from '../services/patientPasswordService';
import { requirePatientAccess } from '../middleware/requirePatientAuth';
import { createRateLimit } from '../middleware/rateLimit';
import { consumePatientSetupToken, verifyPatientSetupToken } from '../services/patientSetupToken';

const router = express.Router();
const loginRateLimit = createRateLimit({
  windowMs: 15 * 60_000,
  max: 20,
  message: 'Too many sign-in attempts. Please wait and try again.',
  key: (req) => `${req.ip}:${String(req.body?.email || '').trim().toLowerCase()}`,
});

// Verify setup token and get patient info
router.get('/verify-setup-token/:token', async (req: any, res: any) => {
  try {
    const { token } = req.params;
    
    const identity = await verifyPatientSetupToken(token);
    
    if (!identity) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    
    res.json({
      email: identity.email,
      patientName: identity.patientName,
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
    if (!isStrongPatientPassword(password)) {
      return res.status(400).json({
        error: 'Password must be at least 10 characters and include uppercase, lowercase, a number, and a symbol'
      });
    }
    
    const identity = await consumePatientSetupToken(token, password);
    if (!identity) {
      return res.status(400).json({ error: 'Invalid, expired, or already used token' });
    }
    
    res.json({ 
      message: 'Password set successfully',
      email: identity.email
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Test route to see which file is being used
// Create account for patient portal (after intake completion)
router.post('/create-account', async (req: any, res: any) => {
  try {
    const { email, password, patientName, setupToken } = req.body;
    
    if (!email || !password || !patientName || !setupToken) {
      return res.status(400).json({ error: 'A valid intake setup link is required to create an account.' });
    }
    if (!isStrongPatientPassword(password)) {
      return res.status(400).json({
        error: 'Password must be at least 10 characters and include uppercase, lowercase, a number, and a symbol'
      });
    }

    const identity = await consumePatientSetupToken(
      setupToken,
      password,
      { email, patientName }
    );
    if (!identity) {
      return res.status(400).json({ error: 'This account setup link is invalid, expired, or has already been used.' });
    }
    
    res.json({ 
      message: 'Account created successfully',
      email: identity.email,
      patientName: identity.patientName
    });
  } catch (error) {
    console.error('Create account error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Patient login
router.post('/login', loginRateLimit, async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const patientPortal = await findPatientPortalByEmail(email);
    
    if (!patientPortal) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const passwordCheck = await verifyPatientPassword(patientPortal.password, password);

    if (!passwordCheck.valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (passwordCheck.needsUpgrade) {
      await updatePatientPortalPassword(patientPortal.email, password);
    }
    
    // Generate JWT token for patient
    const { generatePatientToken } = require('../services/jwtService');
    const token = generatePatientToken(patientPortal);
    
    // Set JWT as HTTP-only cookie
    res.cookie('patientToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    
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
// Get assigned exercises for movement session
router.get('/exercises/:email', requirePatientAccess, async (req: any, res: any) => {
  try {
    const { email } = req.params;
    const { getAssignedExercisesByEmail } = require('../models/patientModel');
    const data = await getAssignedExercisesByEmail(email);
    if (!data) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    return res.json({ success: true, data });
  } catch (error) {
    console.error('Error getting assigned exercises:', error);
    // Avoid 500s; return empty truthful data instead
    return res.json({ success: true, data: { exercises: [], totalPoints: 0, region: 'Neck', phase: 'EDUCATE', srsScore: 0 } });
  }
});

// Patient logout
router.post('/logout', (req: any, res: any) => {
  res.clearCookie('patientToken', { path: '/' });
  res.json({ message: 'Logged out' });
});

// Get all SRS scores for a patient by ID
router.get('/patients/:id/srs-scores', requirePatientAccess, async (req: any, res: any) => {
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
