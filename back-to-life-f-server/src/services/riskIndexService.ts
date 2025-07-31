import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface RiskIndexResult {
  patientId: number;
  riskIndex: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  components: {
    stress7dMean: number;
    pcsLatest: number;
    faLatest: number;
  };
  date: Date;
}

/**
 * Calculate risk index for a patient
 * Formula: 0.3 * stress7dMean + 0.4 * pcsLatest + 0.3 * faLatest
 */
export async function calculateRiskIndex(patientId: number): Promise<RiskIndexResult> {
  try {
    console.log(`🔍 Calculating risk index for patient ${patientId}`);
    
    // Get 7-day stress mean from SRSDaily records
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const stressData = await prisma.sRSDaily.findMany({
      where: {
        patientId,
        date: {
          gte: sevenDaysAgo
        }
      },
      select: {
        psychLoad: true
      },
      orderBy: {
        date: 'desc'
      }
    });
    
    // Calculate 7-day stress mean (psychLoad is already 0-100)
    const stress7dMean = stressData.length > 0 
      ? stressData.reduce((sum, record) => sum + record.psychLoad, 0) / stressData.length
      : 0;
    
    // Get latest PCS-4 score
    const latestPCS = await prisma.assessmentResult.findFirst({
      where: {
        patientId,
        name: 'PCS4'
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Convert PCS-4 score (0-16) to 0-100 scale
    const pcsLatest = latestPCS ? (latestPCS.score / 16) * 100 : 0;
    
    // Get latest fear-avoidance score from SRSDaily
    const latestSRSDaily = await prisma.sRSDaily.findFirst({
      where: {
        patientId,
        fa: {
          not: null
        }
      },
      orderBy: {
        date: 'desc'
      }
    });
    
    // FA is already 0-100 scale
    const faLatest = latestSRSDaily?.fa || 0;
    
    // Calculate risk index
    const riskIndex = (0.3 * stress7dMean) + (0.4 * pcsLatest) + (0.3 * faLatest);
    
    // Determine risk level
    let riskLevel: 'Low' | 'Medium' | 'High';
    if (riskIndex < 40) {
      riskLevel = 'Low';
    } else if (riskIndex < 65) {
      riskLevel = 'Medium';
    } else {
      riskLevel = 'High';
    }
    
    const result: RiskIndexResult = {
      patientId,
      riskIndex: Math.round(riskIndex),
      riskLevel,
      components: {
        stress7dMean: Math.round(stress7dMean),
        pcsLatest: Math.round(pcsLatest),
        faLatest: Math.round(faLatest)
      },
      date: new Date()
    };
    
    console.log(`📊 Risk Index for patient ${patientId}:`, {
      riskIndex: result.riskIndex,
      riskLevel: result.riskLevel,
      components: result.components
    });
    
    return result;
  } catch (error) {
    console.error(`Error calculating risk index for patient ${patientId}:`, error);
    throw error;
  }
}

/**
 * Calculate risk index for all patients (for cron job)
 */
export async function calculateRiskIndexForAllPatients(): Promise<RiskIndexResult[]> {
  try {
    console.log('🔄 Starting risk index calculation for all patients');
    
    // Get all patients with recent activity
    const patients = await prisma.patient.findMany({
      where: {
        srsDaily: {
          some: {
            date: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
            }
          }
        }
      },
      select: {
        id: true
      }
    });
    
    console.log(`📋 Calculating risk index for ${patients.length} patients`);
    
    const results: RiskIndexResult[] = [];
    
    for (const patient of patients) {
      try {
        const riskIndex = await calculateRiskIndex(patient.id);
        results.push(riskIndex);
      } catch (error) {
        console.error(`Failed to calculate risk index for patient ${patient.id}:`, error);
      }
    }
    
    console.log(`✅ Completed risk index calculation for ${results.length} patients`);
    
    // Log summary
    const lowRisk = results.filter(r => r.riskLevel === 'Low').length;
    const mediumRisk = results.filter(r => r.riskLevel === 'Medium').length;
    const highRisk = results.filter(r => r.riskLevel === 'High').length;
    
    console.log('📊 Risk Index Summary:');
    console.log(`   Low Risk: ${lowRisk} patients`);
    console.log(`   Medium Risk: ${mediumRisk} patients`);
    console.log(`   High Risk: ${highRisk} patients`);
    
    return results;
  } catch (error) {
    console.error('Error calculating risk index for all patients:', error);
    throw error;
  }
}

/**
 * Get risk index for a specific patient
 */
export async function getPatientRiskIndex(patientId: number): Promise<RiskIndexResult | null> {
  try {
    return await calculateRiskIndex(patientId);
  } catch (error) {
    console.error(`Error getting risk index for patient ${patientId}:`, error);
    return null;
  }
}

/**
 * Get risk index history for a patient (last 30 days)
 */
export async function getPatientRiskIndexHistory(patientId: number): Promise<RiskIndexResult[]> {
  try {
    // This would require storing risk index history in a separate table
    // For now, return current risk index
    const currentRisk = await calculateRiskIndex(patientId);
    return [currentRisk];
  } catch (error) {
    console.error(`Error getting risk index history for patient ${patientId}:`, error);
    return [];
  }
} 