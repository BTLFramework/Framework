import { NextRequest, NextResponse } from 'next/server'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const patientEmail = searchParams.get('email')
    
    if (!patientEmail) {
      return NextResponse.json({
        success: false,
        error: 'Patient email is required'
      }, { 
        status: 400,
        headers: corsHeaders
      })
    }

    console.log('Patient Portal - Fetching intake data for:', patientEmail)
    
    // Fetch patient data from backend server
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://framework-production-92f5.up.railway.app';
    const backendResponse = await fetch(`${backendUrl}/patients/by-email/${encodeURIComponent(patientEmail)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json()
      throw new Error(`Backend server error: ${errorData.error || 'Unknown error'}`)
    }

    const patientData = await backendResponse.json()
    console.log('Backend patient data:', patientData)

    // Transform the data for the assessments section
    const intakeDate = new Date(patientData.intakeDate)
    const fourWeekDate = new Date(intakeDate)
    fourWeekDate.setDate(fourWeekDate.getDate() + 28)
    
    const eightWeekDate = new Date(intakeDate)
    eightWeekDate.setDate(eightWeekDate.getDate() + 56)
    
    const today = new Date()
    
    // Get SRS scores for each period
    const srsScores = patientData.srsScores || []
    const initialScore = srsScores.find((score: any) => score.formType === 'Intake')
    const fourWeekScore = srsScores.find((score: any) => 
      score.formType === 'Follow-Up' && 
      new Date(score.date) >= fourWeekDate && 
      new Date(score.date) < eightWeekDate
    )
    const eightWeekScore = srsScores.find((score: any) => 
      score.formType === 'Follow-Up' && 
      new Date(score.date) >= eightWeekDate
    )

    const intakeForms = [
      {
        id: "initial-intake",
        title: "Initial Intake Form",
        description: "Your first Back to Life assessment to establish baseline",
        status: initialScore ? "completed" : "due",
        date: intakeDate.toISOString(),
        completedDate: initialScore ? initialScore.date : undefined,
        formData: initialScore ? {
          patientName: patientData.name,
          region: initialScore.region,
          vas: initialScore.vas,
          confidence: initialScore.confidence,
          disabilityPercentage: initialScore.disabilityPercentage,
          psfs: initialScore.psfs,
          beliefs: initialScore.beliefs || [],
          srsScore: initialScore.srsScore
        } : undefined,
        actionButton: initialScore ? "View Results" : "Complete Form",
        isHighlighted: !initialScore
      },
      {
        id: "4-week-followup",
        title: "4 Week Follow-up Intake",
        description: "Progress assessment to track your recovery journey",
        status: fourWeekScore ? "completed" : today >= fourWeekDate ? "due" : "upcoming",
        date: fourWeekDate.toISOString(),
        dueDate: fourWeekDate.toISOString(),
        completedDate: fourWeekScore ? fourWeekScore.date : undefined,
        formData: fourWeekScore ? {
          patientName: patientData.name,
          region: fourWeekScore.region,
          vas: fourWeekScore.vas,
          confidence: fourWeekScore.confidence,
          disabilityPercentage: fourWeekScore.disabilityPercentage,
          psfs: fourWeekScore.psfs,
          beliefs: fourWeekScore.beliefs || [],
          srsScore: fourWeekScore.srsScore,
          groc: fourWeekScore.groc
        } : undefined,
        actionButton: fourWeekScore ? "View Results" : "Start Assessment",
        isHighlighted: !fourWeekScore && today > fourWeekDate
      },
      {
        id: "8-week-followup",
        title: "8 Week Follow-up Intake",
        description: "Final assessment to evaluate long-term progress",
        status: eightWeekScore ? "completed" : today >= eightWeekDate ? "due" : "upcoming",
        date: eightWeekDate.toISOString(),
        dueDate: eightWeekDate.toISOString(),
        completedDate: eightWeekScore ? eightWeekScore.date : undefined,
        formData: eightWeekScore ? {
          patientName: patientData.name,
          region: eightWeekScore.region,
          vas: eightWeekScore.vas,
          confidence: eightWeekScore.confidence,
          disabilityPercentage: eightWeekScore.disabilityPercentage,
          psfs: eightWeekScore.psfs,
          beliefs: eightWeekScore.beliefs || [],
          srsScore: eightWeekScore.srsScore,
          groc: eightWeekScore.groc
        } : undefined,
        actionButton: eightWeekScore ? "View Results" : "Start Assessment",
        isHighlighted: !eightWeekScore && today > eightWeekDate
      }
    ]

    return NextResponse.json({
      success: true,
      data: {
        patient: {
          name: patientData.name,
          email: patientData.email,
          intakeDate: patientData.intakeDate
        },
        intakeForms
      }
    }, {
      headers: corsHeaders
    })

  } catch (error) {
    console.error('Patient Portal - Error fetching intake data:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch intake data',
      message: 'Unable to load your intake form data. Please try again.'
    }, { 
      status: 500,
      headers: corsHeaders
    })
  }
} 