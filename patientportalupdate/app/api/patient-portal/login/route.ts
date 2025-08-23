import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://framework-production-92f5.up.railway.app';
    
    console.log('🔐 Login attempt:', { email: body.email, backendUrl });
    
    const response = await fetch(`${backendUrl}/api/patient-portal/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('🔐 Backend response:', { status: response.status, data });

    if (!response.ok) {
      console.log('❌ Login failed:', data);
      return NextResponse.json(
        { error: data.error || 'Login failed' },
        { status: response.status }
      );
    }

    console.log('✅ Login successful, forwarding response');
    
    // Create response with the data
    const nextResponse = NextResponse.json(data);

    // Forward the JWT cookie from backend to frontend
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      console.log('🍪 Setting JWT cookie');
      nextResponse.headers.set('set-cookie', setCookieHeader);
    }

    return nextResponse;
    
  } catch (error) {
    console.error('❌ Error during login:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 