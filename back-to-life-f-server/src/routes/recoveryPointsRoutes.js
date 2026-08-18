// Recovery Points API Routes
const express = require('express');
const router = express.Router();
const recoveryPointsService = require('../services/recoveryPointsService');
const { rpActions } = require('../config/recoveryPointsConfig');
const { insightSequence } = require('../config/insightSequence');
const {
  INSIGHT_ACTION_PREFIX,
  calculateInsightStatus
} = require('../services/insightProgression');

// Use centralized Prisma instance with fallback
let prisma;
try {
  const db = require("../db");
  prisma = db.default || db;
} catch (error) {
  console.warn('Could not import centralized DB, creating new Prisma client');
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient();
}

async function resolvePatient(patientIdentifier) {
  const identifier = String(patientIdentifier || '').trim();
  if (!identifier) return null;

  if (/^\d+$/.test(identifier)) {
    return prisma.patient.findUnique({ where: { id: parseInt(identifier, 10) } });
  }

  return prisma.patient.findUnique({ where: { email: identifier.toLowerCase() } });
}

async function getInsightStatus(patient) {
  const records = await prisma.recoveryPoint.findMany({
    where: {
      patientId: patient.id,
      category: 'EDUCATION',
      action: { startsWith: INSIGHT_ACTION_PREFIX }
    },
    orderBy: { date: 'asc' }
  });

  return calculateInsightStatus({
    records,
    enrollmentDate: patient.intakeDate || patient.createdAt
  });
}

// Durable Recovery Insight progression. Upcoming titles remain visible in the
// patient portal, but only the next sequential, calendar-eligible lesson opens.
router.get('/insights/status/:patientIdentifier', async (req, res) => {
  try {
    const patient = await resolvePatient(req.params.patientIdentifier);
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }

    return res.json({ success: true, data: await getInsightStatus(patient) });
  } catch (error) {
    console.error('Error getting Recovery Insight status:', error);
    return res.status(500).json({ success: false, error: 'Failed to get Recovery Insight status' });
  }
});

router.post('/insights/complete', async (req, res) => {
  try {
    const { patientId, insightId } = req.body;
    const patient = await resolvePatient(patientId);
    const numericInsightId = parseInt(insightId, 10);

    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }
    if (!insightSequence.includes(numericInsightId)) {
      return res.status(400).json({ success: false, error: 'Unknown Recovery Insight' });
    }

    const action = `${INSIGHT_ACTION_PREFIX}${numericInsightId}`;
    const duplicate = await prisma.recoveryPoint.findFirst({
      where: { patientId: patient.id, category: 'EDUCATION', action }
    });
    if (duplicate) {
      return res.json({
        success: true,
        alreadyCompleted: true,
        pointsAdded: 0,
        data: await getInsightStatus(patient)
      });
    }

    const status = await getInsightStatus(patient);
    if (status.completedToday) {
      return res.status(409).json({
        success: false,
        error: 'Today’s Recovery Insight is already complete. The next lesson unlocks tomorrow.',
        data: status
      });
    }
    if (status.availableInsightId !== numericInsightId) {
      return res.status(409).json({
        success: false,
        error: 'Complete the previous Recovery Insight before opening this lesson.',
        data: status
      });
    }

    const pointsResult = await recoveryPointsService.addRecoveryPoints(
      patient.id,
      'EDUCATION',
      action,
      5
    );
    if (!pointsResult.success) {
      return res.status(409).json({
        success: false,
        error: pointsResult.message || pointsResult.error || 'Recovery Insight points could not be recorded'
      });
    }

    await prisma.taskCompletion.create({
      data: {
        patientId: patient.id,
        taskType: 'RECOVERY_INSIGHTS',
        pointsEarned: pointsResult.pointsAdded || 5
      }
    });

    return res.json({
      success: true,
      alreadyCompleted: false,
      pointsAdded: pointsResult.pointsAdded || 5,
      data: await getInsightStatus(patient)
    });
  } catch (error) {
    console.error('Error completing Recovery Insight:', error);
    return res.status(500).json({ success: false, error: 'Failed to complete Recovery Insight' });
  }
});

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

// Record task completion
router.post('/task-completion', async (req, res) => {
  try {
    const { patientId, taskType, sessionDuration, pointsEarned } = req.body;
    
    // Validate input
    if (!patientId || !taskType) {
      return res.status(400).json({
        error: 'Missing required fields: patientId, taskType'
      });
    }
    
    // Validate task type
    const validTaskTypes = ['MOVEMENT', 'PAIN_ASSESSMENT', 'MINDFULNESS', 'RECOVERY_INSIGHTS'];
    if (!validTaskTypes.includes(taskType)) {
      return res.status(400).json({
        error: `Invalid task type: ${taskType}. Must be one of: ${validTaskTypes.join(', ')}`
      });
    }
    
    console.log(`✅ API: Recording task completion for patient ${patientId}: ${taskType}`);

    // A daily task can only advance the patient's day once. Recovery points
    // already enforce a daily cap; make the completion record idempotent too
    // so retries or double-clicks cannot inflate progress statistics.
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const existingCompletion = await prisma.taskCompletion.findFirst({
      where: {
        patientId: parseInt(patientId),
        taskType,
        completedAt: { gte: today, lt: tomorrow }
      },
      orderBy: { completedAt: 'desc' }
    });

    if (existingCompletion) {
      return res.json({
        success: true,
        alreadyCompleted: true,
        data: existingCompletion,
        message: `Task was already completed today: ${taskType}`
      });
    }
    
    // Record the task completion
    const taskCompletion = await prisma.taskCompletion.create({
      data: {
        patientId: parseInt(patientId),
        taskType: taskType,
        sessionDuration: sessionDuration || null,
        pointsEarned: pointsEarned || null
      }
    });
    
    res.json({
      success: true,
      alreadyCompleted: false,
      data: taskCompletion,
      message: `Task completion recorded: ${taskType}`
    });
    
  } catch (error) {
    console.error('Error recording task completion:', error);
    res.status(500).json({
      error: 'Failed to record task completion',
      details: error.message
    });
  }
});

// Get weekly task completion statistics for "Biggest Win This Week"
router.get('/task-stats/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    
    console.log(`📈 API: Getting task completion stats for patient ${patientId}`);
    
    // Get current week (Monday to Sunday) and last week
    const now = new Date();
    const currentWeekStart = new Date(now);
    currentWeekStart.setDate(now.getDate() - now.getDay() + 1); // Monday
    currentWeekStart.setHours(0, 0, 0, 0);
    
    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekStart.getDate() + 6); // Sunday
    currentWeekEnd.setHours(23, 59, 59, 999);
    
    const lastWeekStart = new Date(currentWeekStart);
    lastWeekStart.setDate(currentWeekStart.getDate() - 7);
    
    const lastWeekEnd = new Date(currentWeekEnd);
    lastWeekEnd.setDate(currentWeekEnd.getDate() - 7);
    
    // Get task completions for both weeks
    const [thisWeekCompletions, lastWeekCompletions] = await Promise.all([
      prisma.taskCompletion.findMany({
        where: {
          patientId: parseInt(patientId),
          completedAt: {
            gte: currentWeekStart,
            lte: currentWeekEnd
          }
        }
      }),
      prisma.taskCompletion.findMany({
        where: {
          patientId: parseInt(patientId),
          completedAt: {
            gte: lastWeekStart,
            lte: lastWeekEnd
          }
        }
      })
    ]);
    
    // Count completions by task type for both weeks
    const taskTypes = ['MOVEMENT', 'PAIN_ASSESSMENT', 'MINDFULNESS', 'RECOVERY_INSIGHTS'];
    const thisWeekCounts = {};
    const lastWeekCounts = {};
    
    taskTypes.forEach(type => {
      thisWeekCounts[type] = thisWeekCompletions.filter(tc => tc.taskType === type).length;
      lastWeekCounts[type] = lastWeekCompletions.filter(tc => tc.taskType === type).length;
    });
    
    // Calculate deltas and find biggest win
    const deltas = taskTypes.map(type => ({
      taskType: type,
      thisWeek: thisWeekCounts[type],
      lastWeek: lastWeekCounts[type],
      delta: thisWeekCounts[type] - lastWeekCounts[type]
    }));
    
    // Find the task type with the highest positive delta
    const biggestWin = deltas
      .filter(item => item.delta > 0)
      .sort((a, b) => b.delta - a.delta)[0];
    
    const result = {
      success: true,
      data: {
        thisWeek: thisWeekCounts,
        lastWeek: lastWeekCounts,
        deltas: deltas,
        biggestWin: biggestWin || null
      }
    };
    
    console.log(`📊 Task stats calculated:`, result.data);
    res.json(result);
    
  } catch (error) {
    console.error('Error getting task completion stats:', error);
    res.status(500).json({
      error: 'Failed to get task completion stats',
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

// Log mood after mindfulness session
router.post('/mood', async (req, res) => {
  try {
    const { patientId, mood } = req.body;
    
    if (!patientId || !mood) {
      return res.status(400).json({
        error: 'Missing required fields: patientId, mood'
      });
    }
    
    console.log(`😊 API: Logging mood for patient ${patientId}: ${mood}`);
    
    // Update today's mindfulness log with mood
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const updatedLog = await prisma.mindfulnessLog.updateMany({
      where: {
        patientId: parseInt(patientId),
        date: {
          gte: today,
          lt: tomorrow
        }
      },
      data: {
        mood
      }
    });
    
    if (updatedLog.count === 0) {
      return res.status(404).json({
        error: 'No mindfulness session found for today'
      });
    }
    
    res.json({
      success: true,
      message: 'Mood logged successfully',
      mood
    });
    
  } catch (error) {
    console.error('Error logging mood:', error);
    res.status(500).json({
      error: 'Failed to log mood',
      details: error.message
    });
  }
});

module.exports = router;
