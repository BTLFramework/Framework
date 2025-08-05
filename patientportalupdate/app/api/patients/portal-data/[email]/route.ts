import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const { email } = await params;

    const response = await fetch(`${backendUrl}/patients/portal-data/${email}`);
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching patient portal data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patient portal data' },
      { status: 500 }
    );
  }
} 