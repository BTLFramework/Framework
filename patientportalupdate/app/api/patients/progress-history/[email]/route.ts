import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { email: string } }
) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://framework-production-92f5.up.railway.app';
    const { email } = params;

    console.log(`📊 Frontend API: Fetching progress history for ${email}`);

    const response = await fetch(`${backendUrl}/patients/progress-history/${encodeURIComponent(email)}`);
    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Backend error:', data);
      return NextResponse.json(
        { error: data.error || 'Failed to fetch progress history' },
        { status: response.status }
      );
    }

    console.log(`✅ Progress history fetched: ${data.data.progressHistory.length} entries`);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error fetching progress history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress history' },
      { status: 500 }
    );
  }
} 