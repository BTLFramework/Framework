import { NextRequest, NextResponse } from 'next/server';

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle preflight OPTIONS request
export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    console.log('Patient Portal - Received intake form data:', formData);
    
    // Send comprehensive data to backend server
    const backendResponse = await fetch('http://localhost:3001/patients/submit-intake', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Patient Information
        patientName: formData.patientName,
        email: formData.email,
        date: formData.date || new Date().toISOString(),
        formType: formData.formType || "Intake",
        region: formData.region,
        
        // Disability Index Arrays (based on region)
        ndi: formData.region === "Neck" ? formData.ndi : null,
        odi: formData.region === "Lower Back" ? formData.odi : null,
        ulfi: formData.region === "Upper Limb" ? formData.ulfi : null,
        lefs: formData.region === "Lower Extremity" ? formData.lefs : null,
        
        // Pain and Function Assessment
        vas: formData.vas,
        psfs: formData.psfs || [],
        
        // Cognitive Assessment
        beliefs: formData.beliefs || [],
        confidence: formData.confidence,
        
        // Follow-up specific (if applicable)
        groc: formData.groc || 0,
        
        // Clinical verification (if applicable)
        recoveryMilestone: formData.recoveryMilestone || false,
        clinicalProgressVerified: formData.clinicalProgressVerified || false
      }),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      throw new Error(`Backend server error: ${errorData.error || 'Unknown error'}`);
    }

    const backendResult = await backendResponse.json();
    console.log('Backend response:', backendResult);

    // Return success response with backend data
    return NextResponse.json({
      success: true,
      message: backendResult.message || 'Intake form submitted successfully',
      data: {
        patient: backendResult.patient,
        srsScore: backendResult.srsScore?.srsScore || 0,
        phase: backendResult.phase,
        disabilityPercentage: backendResult.disabilityPercentage,
        beliefStatus: backendResult.beliefStatus,
        setupLink: backendResult.setupLink
      }
    }, {
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Patient Portal - Intake processing error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Processing failed',
      message: 'Failed to process intake form. Please try again.'
    }, { 
      status: 500,
      headers: corsHeaders
    });
  }
}

// Legacy calculation functions (kept for reference but not used)
function calculateSRS(formData: any): string {
  let score = 0;
  
  if (formData.vas && formData.previousVas && (formData.previousVas - formData.vas) >= 2) {
    score += 1;
  }
  
  if (formData.psfs) {
    const psfTotal = formData.psfs.reduce((sum: number, item: any) => sum + (item.score || 0), 0);
    if (psfTotal >= 4) score += 2;
  }
  
  if (formData.confidence >= 7) score += 2;
  
  if (formData.beliefs && formData.beliefs.includes("None of these apply")) {
    score += 1;
  }
  
  return `${Math.min(score, 11)}/11`;
}

function determinePhase(formData: any): string {
  const score = parseInt(calculateSRS(formData).split('/')[0]);
  if (score <= 3) return "RESET";
  if (score <= 6) return "EDUCATE";
  return "REBUILD";
} 