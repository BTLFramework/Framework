import { NextRequest, NextResponse } from 'next/server';

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:5173',
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
    
    // Process intake form data
    const processedData = {
      patient: {
        name: formData.patientName,
        email: formData.email,
        region: formData.region
      },
      srsScore: calculateSRS(formData),
      phase: determinePhase(formData),
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: processedData
    }, {
      headers: corsHeaders
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Processing failed'
    }, { 
      status: 500,
      headers: corsHeaders
    });
  }
}

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