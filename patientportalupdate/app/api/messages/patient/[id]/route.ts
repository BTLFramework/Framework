import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://framework-production-92f5.up.railway.app';
    const { id } = await params;

    const response = await fetch(`${backendUrl}/api/messages/patient/${id}`, {
      cache: 'no-store',
    });
    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching patient messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patient messages' },
      { status: 500 }
    );
  }
}
