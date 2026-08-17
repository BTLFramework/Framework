import { NextRequest, NextResponse } from 'next/server';
import { clinicalRegionFromProfile, normalizeClinicalProfile } from '@/lib/clinicalState';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string; type: string }> }
) {
  const { id, type } = await context.params;
  const backendUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    'https://framework-production-92f5.up.railway.app';

  try {
    const response = await fetch(
      `${backendUrl}/patients/portal-data/${encodeURIComponent(id)}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Verified patient recovery data is unavailable' },
        { status: response.status }
      );
    }

    const result = await response.json();
    const portalData = result?.data ?? result;
    const profile = normalizeClinicalProfile({
      ...(portalData?.patient ?? {}),
      ...portalData,
    });
    const patientData = {
      id: profile?.id ?? portalData?.patient?.id ?? id,
      srsScore: profile?.srsScore ?? null,
      phase: profile?.phase ?? null,
      region: clinicalRegionFromProfile(portalData),
    };

    switch (type) {
      case 'patient':
        return NextResponse.json(patientData);

      case 'recovery-insights':
      case 'insight':
      case 'insights':
        return NextResponse.json({
          recoveryInsights: {
            availableInsights: null,
            viewedInsights: null,
            phase: patientData.phase,
            srsScore: patientData.srsScore,
            region: patientData.region,
            riskProfile: null,
            lastUpdated: portalData?.updatedAt ?? null,
          },
        });

      case 'pain':
        return NextResponse.json({
          pain: {
            lastAssessment: portalData?.lastPainAssessment ?? null,
            phase: patientData.phase,
            region: patientData.region,
            trend: null,
            lastUpdated: portalData?.updatedAt ?? null,
          },
        });

      case 'snapshot': {
        let pain =
          typeof portalData?.vas === 'number' ? portalData.vas : null;
        let stress = null;

        const dailyResponse = await fetch(
          `${backendUrl}/patients/daily-data/${encodeURIComponent(id)}`,
          { cache: 'no-store' }
        );

        if (dailyResponse.ok) {
          const dailyResult = await dailyResponse.json();
          const dailyData = dailyResult?.data ?? dailyResult;

          if (
            dailyResult?.success === true &&
            dailyData?.source === 'daily-assessment' &&
            typeof dailyData?.pain === 'number'
          ) {
            pain = Math.round((dailyData.pain / 100) * 10);
            if (typeof dailyData?.stress === 'number') {
              stress = Math.round((dailyData.stress / 100) * 10);
            }
          }
        }

        const risk =
          pain === null || stress === null
            ? null
            : pain >= 7 || stress >= 7
              ? 'high'
              : pain >= 5 || stress >= 5
                ? 'moderate'
                : 'low';

        return NextResponse.json({
          clinical: patientData,
          snapshot: { pain, stress, risk },
        });
      }

      case 'mindfulness':
        return NextResponse.json({
          mindfulness: {
            lastSession: portalData?.lastMindfulnessSession ?? null,
            availableTracks: 4,
            phase: patientData.phase,
            region: patientData.region,
            streak: portalData?.mindfulnessStreak ?? null,
            lastUpdated: portalData?.updatedAt ?? null,
          },
        });

      default:
        return NextResponse.json(
          { error: 'Unknown recovery type' },
          { status: 404 }
        );
    }
  } catch {
    return NextResponse.json(
      { error: 'Verified patient recovery data is unavailable' },
      { status: 503 }
    );
  }
}
