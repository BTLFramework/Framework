import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Forward the request to the backend server
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const patientId = request.url.split('/tasks/')[1];

    const response = await fetch(`${backendUrl}/patients/tasks/${patientId}`);
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching patient tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patient tasks' },
      { status: 500 }
    );
  }
} 