export const completeInsight = async (patientId: string, insightId: string) => {
  console.log('🎯 Completing insight', insightId, 'for patient', patientId);
  
  try {
    const response = await fetch('/api/v1/insights/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        patientId,
        insightId: parseInt(insightId),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Insight completed successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ Error completing insight:', error);
    throw error;
  }
}; 