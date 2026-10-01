import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Enter your email address first.' },
        { status: 400 }
      )
    }

    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      'https://framework-production-92f5.up.railway.app'

    const response = await fetch(`${backendUrl}/api/patient-portal/request-password-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim() }),
      cache: 'no-store',
    })

    const data = await response.json().catch(() => ({
      error: 'Password reset service returned an invalid response',
    }))

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Password reset request error:', error)
    return NextResponse.json(
      { error: 'Unable to request a password reset link.' },
      { status: 500 }
    )
  }
}
