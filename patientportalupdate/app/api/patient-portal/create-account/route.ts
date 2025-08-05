import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, patientName } = await request.json()

    if (!email || !password || !patientName) {
      return NextResponse.json(
        { error: 'Email, password, and patient name are required' },
        { status: 400 }
      )
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character' },
        { status: 400 }
      )
    }

    // Send to Railway backend to create patient portal account
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const backendResponse = await fetch(`${backendUrl}/api/patient-portal/create-account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        patientName
      }),
    })

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json()
      return NextResponse.json(
        { error: errorData.error || 'Failed to create account' },
        { status: backendResponse.status }
      )
    }

    const result = await backendResponse.json()

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      data: result
    })

  } catch (error) {
    console.error('Account creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 