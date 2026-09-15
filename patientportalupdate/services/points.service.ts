// Points Service
// Handles awarding points for various activities

import { addRecoveryPoints } from '@/lib/recoveryPointsApi';

export const awardPoints = async (
  reason: 'checkin' | 'insight' | 'movement' | 'mindfulness' | 'education',
  amount = 1,
  patientId?: string
) => {
  try {
    if (!patientId || patientId === 'undefined') {
      throw new Error('An authenticated patient ID is required to award points');
    }
    
    // Map reason to category
    const categoryMap: Record<string, string> = {
      'checkin': 'LIFESTYLE',
      'insight': 'EDUCATION',
      'movement': 'MOVEMENT',
      'mindfulness': 'MINDSET',
      'education': 'EDUCATION'
    };
    
    const category = categoryMap[reason] || 'EDUCATION';
    const action = `Completed ${reason}`;
    
    const result = await addRecoveryPoints(patientId, category, action, amount);
    
    // Check if the result indicates success (either success: true or pointsAdded > 0)
    if (result.success || (result.pointsAdded && result.pointsAdded > 0) || result.weeklyTotal !== undefined) {
      console.log(`✅ Awarded ${amount} points for ${reason}`);
      return result;
    } else {
      console.error('❌ Failed to award points:', result.error);
      throw new Error(result.error || 'Failed to award points');
    }
    
  } catch (error) {
    console.error('❌ Error awarding points:', error);
    throw error;
  }
};
