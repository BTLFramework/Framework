import { NextRequest, NextResponse } from 'next/server';

const backendUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://framework-production-92f5.up.railway.app';

async function forwardResponse(response: Response) {
  const payload = await response.json().catch(() => ({
    success: false,
    error: 'Recovery Insight service returned an invalid response'
  }));
  return NextResponse.json(payload, { status: response.status });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetch(`${backendUrl}/api/recovery-points/insights/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store'
    });
    return forwardResponse(response);
  } catch (error) {
    console.error('Error completing Recovery Insight:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to complete Recovery Insight' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const patientId = request.nextUrl.searchParams.get('patientId');
  if (!patientId) {
    return NextResponse.json(
      { success: false, error: 'Patient ID is required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${backendUrl}/api/recovery-points/insights/status/${encodeURIComponent(patientId)}`,
      { cache: 'no-store' }
    );
    return forwardResponse(response);
  } catch (error) {
    console.error('Error loading Recovery Insight status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load Recovery Insight status' },
      { status: 500 }
    );
  }
}
