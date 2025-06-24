// Recovery Points API Routes
const express = require('express');
const router = express.Router();
const recoveryPointsService = require('../services/recoveryPointsService');
const { rpActions } = require('../config/recoveryPointsConfig');

// Add recovery points
router.post('/add', async (req, res) => {
  try {
    const { patientId, category, action, points } = req.body;
    
    // Validate input
    if (!patientId || !category || !action || !points) {
      return res.status(400).json({
        error: 'Missing required fields: patientId, category, action, points'
      });
    }
    
    // Validate category
    if (!rpActions[category]) {
      return res.status(400).json({
        error: `Invalid category: ${category}`
      });
    }
    
    console.log(`🎯 API: Adding RP for patient ${patientId}: ${category} - ${action} (+${points})`);
    
    const result = await recoveryPointsService.addRecoveryPoints(
      parseInt(patientId),
      category,
      action,
      parseInt(points)
    );
    
    res.json(result);
    
  } catch (error) {
    console.error('Error adding recovery points:', error);
    res.status(500).json({
      error: 'Failed to add recovery points',
      details: error.message
    });
  }
});

// Get weekly breakdown for a patient
router.get('/weekly/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    
    console.log(`📊 API: Getting weekly RP breakdown for patient ${patientId}`);
    
    const breakdown = await recoveryPointsService.getWeeklyBreakdown(
      parseInt(patientId)
    );
    
    res.json(breakdown);
    
  } catch (error) {
    console.error('Error getting weekly breakdown:', error);
    res.status(500).json({
      error: 'Failed to get weekly breakdown',
      details: error.message
    });
  }
});

// Get SRS buffer for a patient
router.get('/buffer/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    
    console.log(`🔄 API: Getting SRS buffer for patient ${patientId}`);
    
    const buffer = await recoveryPointsService.getSRSBuffer(
      parseInt(patientId)
    );
    
    res.json(buffer);
    
  } catch (error) {
    console.error('Error getting SRS buffer:', error);
    res.status(500).json({
      error: 'Failed to get SRS buffer',
      details: error.message
    });
  }
});

// Check 4-week thresholds for a patient
router.get('/thresholds/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    
    console.log(`🔍 API: Checking thresholds for patient ${patientId}`);
    
    const thresholds = await recoveryPointsService.checkThresholds(
      parseInt(patientId)
    );
    
    res.json(thresholds);
    
  } catch (error) {
    console.error('Error checking thresholds:', error);
    res.status(500).json({
      error: 'Failed to check thresholds',
      details: error.message
    });
  }
});

// Get recent activity for a patient
router.get('/activity/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { limit = 10 } = req.query;
    
    console.log(`📝 API: Getting recent RP activity for patient ${patientId}`);
    
    const activity = await recoveryPointsService.getRecentActivity(
      parseInt(patientId),
      parseInt(limit)
    );
    
    res.json(activity);
    
  } catch (error) {
    console.error('Error getting recent activity:', error);
    res.status(500).json({
      error: 'Failed to get recent activity',
      details: error.message
    });
  }
});

// Get available actions for a category
router.get('/actions/:category', async (req, res) => {
  try {
    const { category } = req.params;
    
    if (!rpActions[category]) {
      return res.status(400).json({
        error: `Invalid category: ${category}`
      });
    }
    
    res.json({
      category,
      actions: rpActions[category]
    });
    
  } catch (error) {
    console.error('Error getting actions:', error);
    res.status(500).json({
      error: 'Failed to get actions',
      details: error.message
    });
  }
});

// Get all available actions
router.get('/actions', async (req, res) => {
  try {
    res.json(rpActions);
  } catch (error) {
    console.error('Error getting all actions:', error);
    res.status(500).json({
      error: 'Failed to get actions',
      details: error.message
    });
  }
});

// Bulk add recovery points (for testing/seeding)
router.post('/bulk-add', async (req, res) => {
  try {
    const { patientId, activities } = req.body;
    
    if (!patientId || !Array.isArray(activities)) {
      return res.status(400).json({
        error: 'Missing required fields: patientId, activities (array)'
      });
    }
    
    console.log(`🎯 API: Bulk adding RP for patient ${patientId}: ${activities.length} activities`);
    
    const results = [];
    
    for (const activity of activities) {
      const { category, action, points } = activity;
      
      try {
        const result = await recoveryPointsService.addRecoveryPoints(
          parseInt(patientId),
          category,
          action,
          parseInt(points)
        );
        results.push({ ...activity, result });
      } catch (error) {
        results.push({ ...activity, error: error.message });
      }
    }
    
    res.json({
      patientId: parseInt(patientId),
      totalActivities: activities.length,
      results
    });
    
  } catch (error) {
    console.error('Error bulk adding recovery points:', error);
    res.status(500).json({
      error: 'Failed to bulk add recovery points',
      details: error.message
    });
  }
});

// Reset all recovery points for a patient
router.post('/reset/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    
    console.log(`🔄 API: Resetting recovery points for patient ${patientId}`);
    
    const result = await recoveryPointsService.resetPatientRecoveryPoints(
      parseInt(patientId)
    );
    
    res.json(result);
    
  } catch (error) {
    console.error('Error resetting recovery points:', error);
    res.status(500).json({
      error: 'Failed to reset recovery points',
      details: error.message
    });
  }
});

// Initialize recovery points for a new patient
router.post('/initialize/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    
    console.log(`🆕 API: Initializing recovery points for patient ${patientId}`);
    
    const buffer = await recoveryPointsService.initializePatientRecoveryPoints(
      parseInt(patientId)
    );
    
    res.json({
      success: true,
      message: 'Recovery points system initialized',
      buffer
    });
    
  } catch (error) {
    console.error('Error initializing recovery points:', error);
    res.status(500).json({
      error: 'Failed to initialize recovery points',
      details: error.message
    });
  }
});

module.exports = router; 