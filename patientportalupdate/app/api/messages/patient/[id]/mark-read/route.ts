import { NextResponse } from 'next/server';

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      'https://framework-production-92f5.up.railway.app';
    const { id } = await params;
    const response = await fetch(
      `${backendUrl}/api/messages/patient/${encodeURIComponent(id)}/mark-read`,
      { method: 'PATCH' }
    );
    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error marking patient messages as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark patient messages as read' },
      { status: 500 }
    );
  }
}
