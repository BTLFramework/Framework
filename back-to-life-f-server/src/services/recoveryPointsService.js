// Recovery Points Service
// Handles RP logging, buffer updates, and threshold checking

const { PrismaClient } = require('@prisma/client');
const { 
  rpActions, 
  weeklyCaps, 
  bufferConfig, 
  fourWeekThresholds 
} = require('../config/recoveryPointsConfig.js');

// Use centralized Prisma instance with fallback
let prisma;
try {
  const db = require("../db");
  prisma = db.default || db;
} catch (error) {
  console.warn('Could not import centralized DB, creating new Prisma client');
  prisma = new PrismaClient();
}

// Check if mindfulness was already logged today
async function checkDailyMindfulness(patientId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const existingLog = await prisma.mindfulnessLog.findFirst({
    where: {
      patientId,
      date: {
        gte: today,
        lt: tomorrow
      }
    }
  });
  
  return {
    alreadyLogged: !!existingLog,
    log: existingLog
  };
}

// Add Recovery Points and update SRS buffer
async function addRecoveryPoints(patientId, category, action, points) {
  console.log(`🎯 Adding ${points} RP for patient ${patientId}: ${category} - ${action}`);
  
  try {
    // Special handling for MINDSET category (mindfulness daily cap)
    if (category === 'MINDSET') {
      const dailyCheck = await checkDailyMindfulness(patientId);
      
      if (dailyCheck.alreadyLogged) {
        console.log(`⚠️ Daily mindfulness already logged for patient ${patientId}`);
        return {
          success: false,
          message: 'Mindfulness already logged for today',
          alreadyLogged: true,
          weeklyTotal: await getWeeklyRP(patientId, category),
          cap: weeklyCaps[category]
        };
      }
      
      // Log mindfulness completion for today
      await prisma.mindfulnessLog.create({
        data: {
          patientId,
          practice: action,
          date: new Date()
        }
      });
      
      console.log(`✅ Mindfulness logged for today: ${action}`);
    }

    // --- DAILY CAP LOGIC FOR ALL CATEGORIES ---
    // Calculate today's total points for this patient/category
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayPoints = await prisma.recoveryPoint.aggregate({
      where: {
        patientId,
        category,
        date: {
          gte: today,
          lt: tomorrow
        }
      },
      _sum: { points: true }
    });
    const todaysTotal = dayPoints._sum.points || 0;
    
    // Special daily cap for recovery insights (EDUCATION category with "Watch micro-lesson" action)
    let dailyCap;
    if (category === 'EDUCATION' && action === 'Watch micro-lesson') {
      dailyCap = 5; // 5 points per day for recovery insights (one insight per day)
    } else {
      // The daily cap is the points value for this card/task
      dailyCap = points;
    }
    
    if (todaysTotal >= dailyCap) {
      console.log(`⚠️ Daily cap reached for ${category}: ${todaysTotal}/${dailyCap}`);
      return {
        success: false,
        message: `Daily ${category.toLowerCase()} cap reached (${dailyCap} points)`,
        alreadyLogged: true,
        todaysTotal,
        dailyCap
      };
    }
    // Adjust points if they would exceed the daily cap
    const adjustedPoints = Math.min(points, dailyCap - todaysTotal);
    if (adjustedPoints <= 0) {
      return {
        success: false,
        message: `No points awarded; daily cap already reached for ${category}`,
        alreadyLogged: true,
        todaysTotal,
        dailyCap
      };
    }
    
    // Check weekly cap
    const weeklyTotal = await getWeeklyRP(patientId, category);
    const cap = weeklyCaps[category];
    
    if (weeklyTotal >= cap) {
      console.log(`⚠️ Weekly cap reached for ${category}: ${weeklyTotal}/${cap}`);
      return {
        success: false,
        message: `Weekly ${category.toLowerCase()} cap reached (${cap} points)`,
        weeklyTotal,
        cap
      };
    }
    
    // Log the recovery points
    const rpRecord = await prisma.recoveryPoint.create({
      data: {
        patientId,
        category,
        action,
        points: adjustedPoints
      }
    });
    
    // Update SRS buffer
    await updateSRSBuffer(patientId, category, adjustedPoints);
    
    // Get updated totals
    const newWeeklyTotal = weeklyTotal + adjustedPoints;
    const bufferData = await getSRSBuffer(patientId);
    
    console.log(`✅ Added ${adjustedPoints} RP. Weekly total: ${newWeeklyTotal}/${cap}`);
    
    return {
      success: true,
      pointsAdded: adjustedPoints,
      weeklyTotal: newWeeklyTotal,
      cap,
      bufferData,
      rpRecord,
      alreadyLogged: false
    };
    
  } catch (error) {
    console.error('Error adding recovery points:', error);
    throw error;
  }
}

// Update SRS Buffer based on RP accumulation
async function updateSRSBuffer(patientId, category, points) {
  console.log(`🔄 Updating SRS buffer for patient ${patientId}, category ${category}`);
  
  const config = bufferConfig[category];
  if (!config) {
    console.warn(`No buffer config found for category: ${category}`);
    return;
  }
  
  // Get or create buffer record
  let buffer = await prisma.sRSBuffer.findUnique({
    where: { patientId }
  });
  
  if (!buffer) {
    buffer = await prisma.sRSBuffer.create({
      data: { patientId }
    });
  }
  
  // Calculate new RP total and buffer increment
  const rpField = `${category.toLowerCase()}RP`;
  const currentRP = buffer[rpField] + points;
  
  // Calculate buffer increments (0.25 per threshold)
  const quarters = Math.floor(currentRP / config.perQuarter);
  const bufferIncrement = quarters * 0.25;
  
  // Calculate remaining RP after buffer conversion
  const remainingRP = currentRP % config.perQuarter;
  
  // Update buffer value (capped at domain maximum)
  const currentBufferValue = buffer[config.domain];
  const newBufferValue = Math.min(
    config.maxBuffer, 
    currentBufferValue + bufferIncrement
  );
  
  // Update the buffer record
  const updateData = {
    [rpField]: remainingRP,
    [config.domain]: newBufferValue
  };
  
  await prisma.sRSBuffer.update({
    where: { patientId },
    data: updateData
  });
  
  console.log(`📊 Buffer updated: ${config.domain} ${currentBufferValue} → ${newBufferValue} (+${bufferIncrement})`);
  console.log(`📊 RP remaining: ${remainingRP}/${config.perQuarter}`);
  
  return {
    bufferIncrement,
    newBufferValue,
    remainingRP,
    domain: config.domain
  };
}

// Get weekly RP total for a category
async function getWeeklyRP(patientId, category) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const result = await prisma.recoveryPoint.aggregate({
    where: {
      patientId,
      category,
      date: {
        gte: oneWeekAgo
      }
    },
    _sum: {
      points: true
    }
  });
  
  return result._sum.points || 0;
}

// Get 4-week RP totals for threshold checking
async function getFourWeekRP(patientId, category) {
  const fourWeeksAgo = new Date();
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
  
  const result = await prisma.recoveryPoint.aggregate({
    where: {
      patientId,
      category,
      date: {
        gte: fourWeeksAgo
      }
    },
    _sum: {
      points: true
    }
  });
  
  return result._sum.points || 0;
}

// Get current SRS buffer for a patient
async function getSRSBuffer(patientId) {
  let buffer = await prisma.sRSBuffer.findUnique({
    where: { patientId }
  });
  
  if (!buffer) {
    buffer = await prisma.sRSBuffer.create({
      data: { patientId }
    });
  }
  
  return buffer;
}

// Check 4-week thresholds and set eligibility flags
async function checkThresholds(patientId) {
  console.log(`🔍 Checking 4-week thresholds for patient ${patientId}`);
  
  const results = {};
  
  for (const [domain, config] of Object.entries(fourWeekThresholds)) {
    const rpTotal = await getFourWeekRP(patientId, config.category);
    const met = rpTotal >= config.threshold;
    
    results[domain] = {
      rpTotal,
      threshold: config.threshold,
      met,
      flag: config.flag,
      description: config.description
    };
    
    // Log threshold hit to database
    const windowEnd = new Date();
    await prisma.rPThresholdHit.upsert({
      where: {
        patientId_domain_windowEnd: {
          patientId,
          domain,
          windowEnd
        }
      },
      update: {
        met,
        rpTotal
      },
      create: {
        patientId,
        domain,
        windowEnd,
        met,
        rpTotal
      }
    });
    
    console.log(`📈 ${domain}: ${rpTotal}/${config.threshold} ${met ? '✅' : '❌'}`);
  }
  
  return results;
}

// Get patient's weekly RP breakdown
async function getWeeklyBreakdown(patientId) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const breakdown = await prisma.recoveryPoint.groupBy({
    by: ['category'],
    where: {
      patientId,
      date: {
        gte: oneWeekAgo
      }
    },
    _sum: {
      points: true
    }
  });
  
  // Convert to object with all categories
  const result = {
    MOVEMENT: 0,
    LIFESTYLE: 0,
    MINDSET: 0,
    EDUCATION: 0,
    ADHERENCE: 0
  };
  
  breakdown.forEach(item => {
    result[item.category] = item._sum.points || 0;
  });
  
  const total = Object.values(result).reduce((sum, points) => sum + points, 0);
  
  return {
    breakdown: result,
    total,
    caps: weeklyCaps
  };
}

// Get recent RP activity for patient dashboard
async function getRecentActivity(patientId, limit = 10) {
  return await prisma.recoveryPoint.findMany({
    where: { patientId },
    orderBy: { date: 'desc' },
    take: limit,
    select: {
      id: true,
      date: true,
      category: true,
      action: true,
      points: true
    }
  });
}

// Reset all recovery points for a patient
async function resetPatientRecoveryPoints(patientId) {
  console.log(`🔄 Resetting all recovery points for patient ${patientId}`);
  
  try {
    // Delete all recovery points for this patient
    const deletedPoints = await prisma.recoveryPoint.deleteMany({
      where: { patientId }
    });
    
    // Reset SRS buffer to zero
    await prisma.sRSBuffer.upsert({
      where: { patientId },
      update: {
        psfsBuffer: 0.0,
        vasBuffer: 0.0,
        confBuffer: 0.0,
        beliefBuffer: 0.0,
        movementRP: 0,
        lifestyleRP: 0,
        mindsetRP: 0,
        educationRP: 0
      },
      create: {
        patientId,
        psfsBuffer: 0.0,
        vasBuffer: 0.0,
        confBuffer: 0.0,
        beliefBuffer: 0.0,
        movementRP: 0,
        lifestyleRP: 0,
        mindsetRP: 0,
        educationRP: 0
      }
    });
    
    // Delete any threshold hits
    const deletedThresholds = await prisma.rPThresholdHit.deleteMany({
      where: { patientId }
    });
    
    console.log(`✅ Reset complete: ${deletedPoints.count} points deleted, ${deletedThresholds.count} thresholds cleared`);
    
    return {
      success: true,
      pointsDeleted: deletedPoints.count,
      thresholdsCleared: deletedThresholds.count,
      message: 'All recovery points and buffers reset to zero'
    };
    
  } catch (error) {
    console.error('❌ Error resetting recovery points:', error);
    throw error;
  }
}

// Initialize recovery points system for new patient
async function initializePatientRecoveryPoints(patientId) {
  console.log(`🆕 Initializing recovery points for new patient ${patientId}`);
  
  try {
    // Create initial SRS buffer record (all zeros)
    const buffer = await prisma.sRSBuffer.create({
      data: {
        patientId,
        psfsBuffer: 0.0,
        vasBuffer: 0.0,
        confBuffer: 0.0,
        beliefBuffer: 0.0,
        movementRP: 0,
        lifestyleRP: 0,
        mindsetRP: 0,
        educationRP: 0
      }
    });
    
    console.log(`✅ Recovery points system initialized for patient ${patientId}`);
    return buffer;
    
  } catch (error) {
    console.error('❌ Error initializing recovery points:', error);
    throw error;
  }
}

module.exports = {
  addRecoveryPoints,
  updateSRSBuffer,
  getWeeklyRP,
  getFourWeekRP,
  getSRSBuffer,
  checkThresholds,
  getWeeklyBreakdown,
  getRecentActivity,
  resetPatientRecoveryPoints,
  initializePatientRecoveryPoints
}; 