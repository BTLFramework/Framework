import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string, type: string } }) {
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
    case 'insight': {
      return NextResponse.json({ summary: 'Your latest recovery insights...', status: 'good', lastUpdated: new Date() });
    }
    case 'pain': {
      return NextResponse.json({ summary: 'Pain assessment summary...', status: 'stable', lastUpdated: new Date() });
    }
    case 'mindfulness': {
      return NextResponse.json({ summary: 'Mindfulness session data...', status: 'pending', lastUpdated: new Date() });
    }
    default:
      return NextResponse.json({ error: 'Unknown recovery type' }, { status: 404 });
  }
} 