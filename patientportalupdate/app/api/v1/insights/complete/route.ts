import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { insightId, patientId } = await request.json();
    
    console.log('🎯 Insight completion request:', { insightId, patientId });
    
    // Store insight completion in localStorage for now (in production, this would go to a database)
    const completionKey = `insight_completed_${patientId}_${insightId}`;
    const completionData = {
      insightId,
      patientId,
      completedAt: new Date().toISOString(),
      points: 5 // Standard points for insight completion
    };
    
    // Store in localStorage (this is a simple solution for now)
    if (typeof window !== 'undefined') {
      localStorage.setItem(completionKey, JSON.stringify(completionData));
    }
    
    // Also store in a global completions object for server-side access
    if (!(global as any).insightCompletions) {
      (global as any).insightCompletions = {};
    }
    (global as any).insightCompletions[completionKey] = completionData;
    
    console.log('✅ Insight completion recorded:', completionData);
    
    return NextResponse.json({
      success: true,
      message: 'Insight completed successfully',
      data: completionData
    });
  } catch (error) {
    console.error('❌ Error completing insight:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to complete insight'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    
    if (!patientId) {
      return NextResponse.json({
        success: false,
        error: 'Patient ID is required'
      }, { status: 400 });
    }
    
    // Get all completed insights for this patient
    const completedInsights: string[] = [];
    
    // Check localStorage (client-side)
    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(`insight_completed_${patientId}_`)) {
          const insightId = key.replace(`insight_completed_${patientId}_`, '');
          completedInsights.push(insightId);
        }
      });
    }
    
    // Check global completions (server-side)
    if ((global as any).insightCompletions) {
      Object.keys((global as any).insightCompletions).forEach(key => {
        if (key.startsWith(`insight_completed_${patientId}_`)) {
          const insightId = key.replace(`insight_completed_${patientId}_`, '');
          if (!completedInsights.includes(insightId)) {
            completedInsights.push(insightId);
          }
        }
      });
    }
    
    console.log('📊 Completed insights for patient:', patientId, completedInsights);
    
    return NextResponse.json({
      success: true,
      data: {
        patientId,
        completedInsights
      }
    });
  } catch (error) {
    console.error('❌ Error fetching completed insights:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch completed insights'
    }, { status: 500 });
  }
} 