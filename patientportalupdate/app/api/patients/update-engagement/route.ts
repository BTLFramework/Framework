import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      'https://framework-production-92f5.up.railway.app';
    const body = await request.json();
    const response = await fetch(`${backendUrl}/patients/update-engagement`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error updating patient engagement:', error);
    return NextResponse.json(
      { error: 'Failed to update patient engagement' },
      { status: 500 }
    );
  }
}
