import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { patientId: string } }
) {
  try {
    const { patientId } = params;
    
    console.log(`📈 Frontend API: Getting task completion stats for patient ${patientId}`);
    
    // Proxy to backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://framework-production-92f5.up.railway.app';
    const response = await fetch(`${backendUrl}/api/recovery-points/task-stats/${encodeURIComponent(patientId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
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