// Recovery Points API utilities
// Handles communication with the backend recovery points system

export interface RecoveryPointActivity {
  category: string;
  action: string;
  points: number;
}

export interface RecoveryPointsResponse {
  success: boolean;
  pointsAdded?: number;
  weeklyTotal?: number;
  cap?: number;
  bufferData?: any;
  message?: string;
  error?: string;
  alreadyLogged?: boolean;
}

// Add recovery points for a patient
export async function addRecoveryPoints(
  patientId: string,
  category: string,
  action: string,
  points: number
): Promise<RecoveryPointsResponse> {
  try {
    console.log(`🎯 Adding ${points} RP for patient ${patientId}: ${category} - ${action}`);
    
    const response = await fetch('/api/recovery-points/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        patientId: parseInt(patientId),
        category,
        action,
        points
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Recovery points added successfully:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Error adding recovery points:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Bulk add recovery points for multiple activities
export async function bulkAddRecoveryPoints(
  patientId: string,
  activities: RecoveryPointActivity[]
): Promise<RecoveryPointsResponse[]> {
  try {
    console.log(`🎯 Bulk adding RP for patient ${patientId}: ${activities.length} activities`);
    
    const response = await fetch('/api/recovery-points/bulk-add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        patientId: parseInt(patientId),
        activities
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Bulk recovery points added successfully:', result);
    return result.results || [];
    
  } catch (error) {
    console.error('❌ Error bulk adding recovery points:', error);
    return activities.map(() => ({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }));
  }
}

// Get weekly recovery points breakdown
export async function getWeeklyRecoveryPoints(patientId: string) {
  try {
    const response = await fetch(`/api/recovery-points/weekly/${patientId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
    
  } catch (error) {
    console.error('❌ Error fetching weekly recovery points:', error);
    return {
      breakdown: {
        MOVEMENT: 0,
        LIFESTYLE: 0,
        MINDSET: 0,
        EDUCATION: 0,
        ADHERENCE: 0
      },
      total: 0,
      caps: {}
    };
  }
}

// Get SRS buffer status
export async function getSRSBuffer(patientId: string) {
  try {
    const response = await fetch(`/api/recovery-points/buffer/${patientId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
    
  } catch (error) {
    console.error('❌ Error fetching SRS buffer:', error);
    return null;
  }
}

// Log mood after mindfulness session
export async function logMood(patientId: string, mood: string) {
  try {
    console.log(`😊 Logging mood for patient ${patientId}: ${mood}`);
    
    const response = await fetch('/api/recovery-points/mood', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        patientId: parseInt(patientId),
        mood
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Mood logged successfully:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Error logging mood:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 