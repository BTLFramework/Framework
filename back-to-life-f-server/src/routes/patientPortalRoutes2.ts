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

// Patient login
router.post('/login', async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const patientPortal = await findPatientPortalByEmail(email);
    
    if (!patientPortal) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    if (patientPortal.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
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
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
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

// Patient logout
router.post('/logout', (req: any, res: any) => {
  res.clearCookie('patientToken', { path: '/' });
  res.json({ message: 'Logged out' });
});

export default router; 