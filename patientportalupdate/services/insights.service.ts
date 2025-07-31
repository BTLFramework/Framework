// Insights Service
// Handles insight completion and related API calls

const API_BASE_URL = '';

export const completeInsight = async (patientId: string, insightId: string) => {
  try {
    console.log(`🎯 Completing insight ${insightId} for patient ${patientId}`);
    
    const response = await fetch(`${API_BASE_URL}/api/v1/insights/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        insightId, 
        patientId 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Insight completed successfully:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Error completing insight:', error);
    throw error;
  }
}; 