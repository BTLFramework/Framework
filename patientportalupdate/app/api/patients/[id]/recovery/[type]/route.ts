import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, context: { params: { id: string, type: string } }) {
  const params = await context.params;
  const { id, type } = params;

  // TODO: Fetch patient data from DB by id
  // For now, mock patient data
  const patientData = {
    id,
    srsScore: 7,
    phase: 'Educate',
    region: 'Low Back / SI Joint',
  };

  switch (type) {
    case 'patient': {
      // Return patient data for components that need region/phase
      return NextResponse.json(patientData);
    }
    case 'insight':
    case 'insights': {
      return NextResponse.json({
        insights: {
          availableInsights: 3,
          viewedInsights: 1,
          phase: 'EDUCATE',
          riskProfile: 'Low',
          lastUpdated: new Date()
        }
      });
    }
    case 'pain': {
      return NextResponse.json({
        pain: {
          lastAssessment: {
            level: 4,
            location: 'Lower back',
            type: 'Aching',
            date: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
          },
          phase: 'EDUCATE',
          trend: 'improving',
          lastUpdated: new Date()
        }
      });
    }
    case 'mindfulness': {
      return NextResponse.json({
        mindfulness: {
          lastSession: {
            track: 'Breathing Basics',
            duration: 8,
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
          },
          availableTracks: 5,
          phase: 'EDUCATE',
          streak: 3,
          lastUpdated: new Date()
        }
      });
    }
    default:
      return NextResponse.json({ error: 'Unknown recovery type' }, { status: 404 });
  }
} 