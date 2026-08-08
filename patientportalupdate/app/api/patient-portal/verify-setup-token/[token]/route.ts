import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      'https://framework-production-92f5.up.railway.app'

    const response = await fetch(
      `${backendUrl}/api/patient-portal/verify-setup-token/${encodeURIComponent(token)}`,
      { cache: 'no-store' }
    )
    const data = await response.json().catch(() => ({
      error: 'Account setup service returned an invalid response'
    }))

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Setup token verification error:', error)
    return NextResponse.json(
      { error: 'Unable to verify this account setup link' },
      { status: 500 }
    )
  }
}
