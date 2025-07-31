// Points Service
// Handles awarding points for various activities

import { addRecoveryPoints } from '@/lib/recoveryPointsApi';

export const awardPoints = async (reason: 'checkin' | 'insight' | 'movement' | 'mindfulness' | 'education', amount = 1) => {
  try {
    console.log(`🎯 Awarding ${amount} points for: ${reason}`);
    
    // Get patient ID from localStorage or use a default
    const patientData = localStorage.getItem('btl_patient_data');
    let patientId = '1'; // fallback
    console.log('🎯 Initial patientId from localStorage:', patientData ? 'found' : 'not found');
    
    if (patientData) {
      const data = JSON.parse(patientData);
      console.log('🎯 Parsed patient data:', data);
      // If we have an email, we need to get the numeric ID
      if (data.email) {
        try {
          console.log('🎯 Fetching patient data for email:', data.email);
          const response = await fetch(`/api/patients/portal-data/${data.email}`);
          console.log('🎯 Patient data response status:', response.status);
          if (response.ok) {
            const result = await response.json();
            patientId = result.data.patient.id.toString();
            console.log('🎯 Got numeric patientId:', patientId);
          } else {
            console.log('🎯 Patient data response not ok:', response.statusText);
          }
        } catch (error) {
          console.warn('Could not get patient ID, using fallback:', error);
        }
      }
    }
    
    // If patientId is still undefined, use a default
    if (!patientId || patientId === 'undefined') {
      patientId = '1';
      console.log('🎯 Using fallback patientId:', patientId);
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
    
    console.log('🎯 Calling addRecoveryPoints with:', { patientId, category, action, amount });
    const result = await addRecoveryPoints(patientId, category, action, amount);
    console.log('🎯 addRecoveryPoints result:', result);
    console.log('🎯 Result success property:', result.success);
    console.log('🎯 Result keys:', Object.keys(result));
    
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