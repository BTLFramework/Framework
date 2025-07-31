/**
 * Risk Index Cron Job Service
 * Updates patient risk bands using the new formula including fear-avoidance
 * Runs nightly to calculate riskIndex = 0.3 × stress7d + 0.4 × PCS + 0.3 × FA
 */

const { PrismaClient } = require('@prisma/client');
const { calculateTSK11Raw, tskRawToFa } = require('../../utils/computeFaScore');

// Use centralized Prisma instance with fallback
let prisma;
try {
  const db = require("../db");
  prisma = db.default || db;
} catch (error) {
  console.warn('Could not import centralized DB, creating new Prisma client');
  prisma = new PrismaClient();
}

/**
 * Calculate 7-day mean stress score for a patient
 * @param {number} patientId - Patient ID
 * @returns {number} Mean stress score (0-10)
 */
async function calculate7DayStressMean(patientId) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  // Get stress scores from the last 7 days
  // Note: This assumes stress data is stored in SRSDaily or similar table
  const stressScores = await prisma.sRSDaily.findMany({
    where: {
      patientId,
      date: {
        gte: sevenDaysAgo
      }
    },
    select: {
      psychLoad: true // Assuming psychLoad contains stress component
    }
  });
  
  if (stressScores.length === 0) {
    return 0; // Default to 0 if no data
  }
  
  // Calculate mean stress (assuming psychLoad is 0-100, convert to 0-10)
  const totalStress = stressScores.reduce((sum, record) => sum + (record.psychLoad / 10), 0);
  return totalStress / stressScores.length;
}

/**
 * Get latest PCS-4 score for a patient
 * @param {number} patientId - Patient ID
 * @returns {number} PCS-4 score (0-16)
 */
async function getLatestPCS4Score(patientId) {
  const latestPCS = await prisma.assessmentResult.findFirst({
    where: {
      patientId,
      name: 'PCS4'
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  
  return latestPCS ? latestPCS.score : 0;
}

/**
 * Get latest fear-avoidance score for a patient
 * @param {number} patientId - Patient ID
 * @returns {number} Fear-avoidance score (0-100)
 */
async function getLatestFAScore(patientId) {
  // First try to get from SRSDaily
  const latestSRSDaily = await prisma.sRSDaily.findFirst({
    where: {
      patientId
    },
    orderBy: {
      date: 'desc'
    }
  });
  
  if (latestSRSDaily && latestSRSDaily.fa !== null) {
    return latestSRSDaily.fa;
  }
  
  // Fallback: calculate from TSK-11 assessment
  const latestTSK11 = await prisma.assessmentResult.findFirst({
    where: {
      patientId,
      name: 'TSK11'
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  
  if (latestTSK11) {
    return tskRawToFa(latestTSK11.score);
  }
  
  return 0; // Default to 0 if no data
}

/**
 * Calculate risk index for a patient
 * @param {number} patientId - Patient ID
 * @returns {Object} Risk index and band
 */
async function calculateRiskIndex(patientId) {
  try {
    // Get components
    const stress7dMean = await calculate7DayStressMean(patientId);
    const pcsLatest = await getLatestPCS4Score(patientId);
    const faLatest = await getLatestFAScore(patientId);
    
    // Convert PCS-4 to 0-100 scale
    const pcsScaled = (pcsLatest / 16) * 100;
    
    // Convert stress to 0-100 scale
    const stressScaled = stress7dMean * 10;
    
    // Calculate risk index: 0.3 × stress7d + 0.4 × PCS + 0.3 × FA
    const riskIndex = (
      stressScaled * 0.3 +
      pcsScaled * 0.4 +
      faLatest * 0.3
    );
    
    // Determine risk band
    let riskBand;
    if (riskIndex < 40) {
      riskBand = 'low';
    } else if (riskIndex < 65) {
      riskBand = 'medium';
    } else {
      riskBand = 'high';
    }
    
    return {
      riskIndex: Math.round(riskIndex * 10) / 10,
      riskBand,
      components: {
        stress: Math.round(stressScaled * 10) / 10,
        pcs: Math.round(pcsScaled * 10) / 10,
        fa: Math.round(faLatest * 10) / 10
      },
      raw: {
        stress7dMean: Math.round(stress7dMean * 10) / 10,
        pcsLatest,
        faLatest: Math.round(faLatest * 10) / 10
      }
    };
  } catch (error) {
    console.error(`Error calculating risk index for patient ${patientId}:`, error);
    return {
      riskIndex: 0,
      riskBand: 'low',
      components: { stress: 0, pcs: 0, fa: 0 },
      raw: { stress7dMean: 0, pcsLatest: 0, faLatest: 0 },
      error: error.message
    };
  }
}

/**
 * Update risk band for a patient
 * @param {number} patientId - Patient ID
 * @param {Object} riskData - Risk calculation results
 */
async function updatePatientRiskBand(patientId, riskData) {
  try {
    // Update patient record with risk band
    await prisma.patient.update({
      where: { id: patientId },
      data: {
        riskBand: riskData.riskBand,
        riskIndex: riskData.riskIndex,
        lastRiskUpdate: new Date()
      }
    });
    
    console.log(`✅ Updated risk band for patient ${patientId}: ${riskData.riskBand} (${riskData.riskIndex})`);
  } catch (error) {
    console.error(`❌ Error updating risk band for patient ${patientId}:`, error);
  }
}

/**
 * Run risk index calculation for all patients
 */
async function runRiskIndexCron() {
  console.log('🚀 Starting nightly risk index calculation...');
  
  try {
    // Get all patients
    const patients = await prisma.patient.findMany({
      select: {
        id: true,
        name: true,
        email: true
      }
    });
    
    console.log(`📊 Processing ${patients.length} patients...`);
    
    let processedCount = 0;
    let errorCount = 0;
    
    for (const patient of patients) {
      try {
        const riskData = await calculateRiskIndex(patient.id);
        await updatePatientRiskBand(patient.id, riskData);
        processedCount++;
        
        // Log high-risk patients
        if (riskData.riskBand === 'high') {
          console.log(`⚠️ High-risk patient: ${patient.name} (${patient.email}) - Risk Index: ${riskData.riskIndex}`);
        }
      } catch (error) {
        console.error(`❌ Error processing patient ${patient.id}:`, error);
        errorCount++;
      }
    }
    
    console.log(`✅ Risk index cron completed: ${processedCount} processed, ${errorCount} errors`);
    
    return {
      success: true,
      processed: processedCount,
      errors: errorCount,
      timestamp: new Date()
    };
  } catch (error) {
    console.error('❌ Risk index cron failed:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date()
    };
  }
}

/**
 * Calculate risk index for a single patient (for testing)
 * @param {number} patientId - Patient ID
 */
async function calculatePatientRiskIndex(patientId) {
  console.log(`🔍 Calculating risk index for patient ${patientId}...`);
  
  const riskData = await calculateRiskIndex(patientId);
  console.log('Risk Index Results:', riskData);
  
  return riskData;
}

module.exports = {
  runRiskIndexCron,
  calculateRiskIndex,
  calculatePatientRiskIndex,
  updatePatientRiskBand
}; 