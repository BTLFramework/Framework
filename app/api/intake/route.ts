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
    console.log('📝 Received intake form data:', formData);
    
    // Process intake form data with comprehensive region support
    const processedData = {
      patient: {
        name: formData.patientName,
        email: formData.email,
        region: formData.region,
        dob: formData.dob
      },
      assessment: {
        date: formData.date,
        formType: formData.formType || 'Intake',
        region: formData.region,
        disabilityIndex: getDisabilityIndexForRegion(formData.region),
        disabilityPercentage: formData.disabilityPercentage,
        vas: formData.vas,
        psfs: formData.psfs,
        beliefs: formData.beliefs,
        confidence: formData.confidence,
        groc: formData.groc || 0,
        // Include all disability index data
        ndi: formData.ndi,
        tdi: formData.tdi, // Include TDI data
        odi: formData.odi,
        ulfi: formData.ulfi,
        lefs: formData.lefs
      },
      srsScore: formData.srsScore || calculateSRS(formData),
      phase: formData.phase || determinePhase(formData),
      timestamp: new Date().toISOString()
    };

    console.log('✅ Processed intake data:', processedData);

    return NextResponse.json({
      success: true,
      data: processedData,
      message: 'Intake form processed successfully'
    }, {
      headers: corsHeaders
    });
  } catch (error) {
    console.error('❌ Intake processing error:', error);
    return NextResponse.json({
      success: false,
      error: 'Processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 500,
      headers: corsHeaders
    });
  }
}

// Get disability index type for a given region
function getDisabilityIndexForRegion(region: string): string {
  const regionLower = region?.toLowerCase();
  
  if (regionLower === 'neck') return 'NDI';
  if (regionLower === 'mid-back / thoracic') return 'TDI';
  if (regionLower === 'low back / si joint') return 'ODI';
  if (regionLower?.includes('shoulder') || regionLower?.includes('elbow') || regionLower?.includes('wrist') || regionLower?.includes('hand')) return 'ULFI';
  if (regionLower?.includes('hip') || regionLower?.includes('knee') || regionLower?.includes('ankle') || regionLower?.includes('foot')) return 'LEFS';
  
  // Backward compatibility
  if (regionLower === 'back') return 'ODI';
  if (regionLower === 'upper limb') return 'ULFI';
  if (regionLower === 'lower limb') return 'LEFS';
  
  return 'Unknown';
}

// Enhanced SRS calculation with proper disability index handling
function calculateSRS(formData: any): string {
  let score = 9; // Start with max baseline score
  
  // Pain assessment (0-3 point reduction)
  const vas = parseInt(formData.vas) || 0;
  if (vas >= 7) score -= 3;
  else if (vas >= 5) score -= 2;
  else if (vas >= 3) score -= 1;
  
  // Disability assessment (0-2 point reduction)
  const disabilityPercentage = formData.disabilityPercentage || 0;
  if (disabilityPercentage >= 60) score -= 2;
  else if (disabilityPercentage >= 40) score -= 1;
  
  // Function assessment (0-2 point reduction)
  if (formData.psfs && formData.psfs.length > 0) {
    const avgPSFS = formData.psfs.reduce((sum: number, item: any) => sum + (item.score || 0), 0) / formData.psfs.length;
    if (avgPSFS < 4) score -= 2;
    else if (avgPSFS < 6) score -= 1;
  }
  
  // Confidence assessment (0-1 point reduction)
  const confidence = parseInt(formData.confidence) || 0;
  if (confidence < 6) score -= 1;
  
  // Beliefs assessment (0-1 point reduction)
  if (formData.beliefs && Array.isArray(formData.beliefs)) {
    const hasNegativeBeliefs = formData.beliefs.some((belief: string) => 
      belief && belief.trim() !== "" && belief !== "None of these apply"
    );
    if (hasNegativeBeliefs) score -= 1;
  }
  
  // Ensure score stays within bounds
  score = Math.max(0, Math.min(9, score));
  
  return `${score}/9`; // Baseline scoring out of 9
}

function determinePhase(formData: any): string {
  const score = parseInt(calculateSRS(formData).split('/')[0]);
  if (score <= 3) return "RESET";
  if (score <= 6) return "EDUCATE";
  return "REBUILD";
} 