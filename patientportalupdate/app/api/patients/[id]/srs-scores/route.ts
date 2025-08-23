import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://framework-production-92f5.up.railway.app';
    const { id } = await params;

    // Fetch SRS scores from backend
    const response = await fetch(`${backendUrl}/patients/${id}/srs-scores`);
    
    if (!response.ok) {
      // If backend doesn't have this endpoint, return empty array
      if (response.status === 404) {
        return NextResponse.json({ 
          success: true, 
          data: [] 
        });
      }
      throw new Error(`Backend error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching SRS scores:', error);
    return NextResponse.json(
      { 
        success: true, 
        data: [] 
      },
      { status: 500 }
    );
  }
} 