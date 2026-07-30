import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://framework-production-92f5.up.railway.app';
    const { email } = await params;

    const response = await fetch(`${backendUrl}/patients/portal-data/${encodeURIComponent(email)}`);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || 'Verified patient portal data is unavailable' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching patient portal data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patient portal data' },
      { status: 500 }
    );
  }
}
