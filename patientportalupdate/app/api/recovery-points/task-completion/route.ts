import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patientId, taskType, sessionDuration, pointsEarned } = body;
    
    // Validate required fields
    if (!patientId || !taskType) {
      return NextResponse.json(
        { error: 'Missing required fields: patientId, taskType' },
        { status: 400 }
      );
    }
    
    console.log(`✅ Frontend API: Recording task completion for patient ${patientId}: ${taskType}`);
    
    // Proxy to backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://framework-production-92f5.up.railway.app';
    const response = await fetch(`${backendUrl}/api/recovery-points/task-completion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        patientId,
        taskType,
        sessionDuration,
        pointsEarned
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || 'Failed to record task completion' },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log(`✅ Task completion recorded successfully: ${taskType}`);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Error recording task completion:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 