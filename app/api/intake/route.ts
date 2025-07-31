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
        pcs4: formData.pcs4,
        tsk11: formData.tsk11,
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

// Standardized SRS calculation that matches backend logic
// Uses the same rules as back-to-life-f-server/src/config/srsConfig.js
function calculateSRS(formData: any): string {
  console.log('🔢 Intake API: Starting standardized SRS Calculation');
  console.log('📊 Form data:', formData);
  
  let points = 0;
  const breakdown: string[] = [];

  // 1. Pain Assessment (VAS ≤2 → +1 point)
  const vas = parseInt(formData.vas) || 0;
  if (vas <= 2) {
    points += 1;
    breakdown.push(`✅ Pain (VAS ≤2): +1 point (VAS: ${vas})`);
  } else {
    breakdown.push(`❌ Pain (VAS >2): +0 points (VAS: ${vas})`);
  }

  // 2. Disability Assessment (≤20% → +1 point)
  const disabilityPercentage = formData.disabilityPercentage || 0;
  if (disabilityPercentage <= 20) {
    points += 1;
    breakdown.push(`✅ Disability (≤20%): +1 point (${disabilityPercentage}%)`);
  } else {
    breakdown.push(`❌ Disability (>20%): +0 points (${disabilityPercentage}%)`);
  }

  // 3. Task Function (PSFS Average: ≥7→ +2, 4-6.9→ +1)
  if (formData.psfs && formData.psfs.length > 0) {
    const psfaScores = formData.psfs.map((item: any) => item.score || 0);
    const avgPSFS = psfaScores.reduce((sum: number, score: number) => sum + score, 0) / psfaScores.length;
    
    if (avgPSFS >= 7) {
      points += 2;
      breakdown.push(`✅ Task Function (PSFS ≥7): +2 points (avg: ${avgPSFS.toFixed(1)})`);
    } else if (avgPSFS >= 4) {
      points += 1;
      breakdown.push(`✅ Task Function (PSFS 4-6.9): +1 point (avg: ${avgPSFS.toFixed(1)})`);
    } else {
      breakdown.push(`❌ Task Function (PSFS <4): +0 points (avg: ${avgPSFS.toFixed(1)})`);
    }
  } else {
    breakdown.push(`❌ Task Function (no data): +0 points`);
  }

  // 4. Confidence Assessment (≥8 → +2, 5-7→ +1)
  const confidence = parseInt(formData.confidence) || 0;
  if (confidence >= 8) {
    points += 2;
    breakdown.push(`✅ Confidence (≥8): +2 points (${confidence})`);
  } else if (confidence >= 5) {
    points += 1;
    breakdown.push(`✅ Confidence (5-7): +1 point (${confidence})`);
  } else {
    breakdown.push(`❌ Confidence (<5): +0 points (${confidence})`);
  }

  // 5. Fear-Avoidance Assessment (TSK-11)
  const calculateTSK11Score = (tsk11Data: any) => {
    if (!tsk11Data || typeof tsk11Data !== 'object') return null;
    
    let rawScore = 0;
    let answeredCount = 0;
    
    // TSK-11 items with reverse-scored items (4, 8, 9)
    const reverseScoredItems = [4, 8, 9];
    
    for (let i = 1; i <= 11; i++) {
      const response = tsk11Data[i];
      if (response && response >= 1 && response <= 4) {
        answeredCount++;
        if (reverseScoredItems.includes(i)) {
          rawScore += (5 - response); // Reverse score: 1→4, 2→3, 3→2, 4→1
        } else {
          rawScore += response;
        }
      }
    }
    
    return answeredCount === 11 ? rawScore : null;
  };
  
  const tsk11RawScore = calculateTSK11Score(formData.tsk11);
  
  if (tsk11RawScore !== null) {
    if (tsk11RawScore <= 22) { // Low fear-avoidance threshold
      points += 1;
      breakdown.push(`✅ Low fear-avoidance (TSK-11 ≤22): +1 point (${tsk11RawScore})`);
    } else {
      breakdown.push(`❌ Fear-Avoidance (TSK-11 ${tsk11RawScore} > 22): +0 points`);
    }
  } else {
    breakdown.push(`❌ Fear-Avoidance (TSK-11 incomplete): +0 points`);
  }

  // 6. Clinician Assessments (not available for intake, so +0)
  breakdown.push(`❌ Recovery Milestone Met (not assessed): +0 points`);
  breakdown.push(`❌ Objective Progress (not assessed): +0 points`);

  console.log(`📋 Intake API SRS Calculation Breakdown:`);
  breakdown.forEach(item => console.log(`   ${item}`));
  console.log(`🎯 Final SRS Score: ${points}/11`);
  return `${points}/11`; // Standardized scoring out of 11
}

function determinePhase(formData: any): string {
  const score = parseInt(calculateSRS(formData).split('/')[0]);
  if (score <= 3) return "RESET";
  if (score <= 7) return "EDUCATE";
  return "REBUILD";
} 