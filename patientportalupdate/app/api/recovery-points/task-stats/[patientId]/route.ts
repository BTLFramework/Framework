import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ patientId: string }> }
) {
  try {
    const { patientId } = await params;
    
    console.log(`📈 Frontend API: Getting task completion stats for patient ${patientId}`);
    
    // Proxy to backend
    const response = await fetch(`http://localhost:3001/api/recovery-points/task-stats/${patientId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || 'Failed to get task completion stats' },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log(`📊 Task stats fetched successfully for patient ${patientId}`);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Error getting task completion stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 