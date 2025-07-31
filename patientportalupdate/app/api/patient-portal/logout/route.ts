import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Clear the session cookie
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' })
    
    // Clear the authentication cookie
    response.cookies.delete('btl_patient_session')
    response.cookies.delete('btl_patient_data')
    
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to logout' },
      { status: 500 }
    )
  }
} 