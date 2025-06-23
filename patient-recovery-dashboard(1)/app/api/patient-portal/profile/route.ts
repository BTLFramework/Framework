import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // For now, we'll use the test endpoint from your backend
    // Later we can switch to the authenticated endpoint
    const backendUrl = 'http://localhost:5000/api/patient-portal/test-profile';
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching patient profile:', error);
    
    // Return mock data if backend is not available
    const mockData = {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      currentPhase: "REBUILD",
      srsScores: [
        {
          id: 1,
          srsScore: 7,
          confidence: 8,
          groc: 2,
          date: new Date().toISOString(),
          psfs: [
            { activity: "Walking", score: 8 },
            { activity: "Lifting groceries", score: 6 },
            { activity: "Playing with kids", score: 7 }
          ]
        }
      ],
      weeklyPoints: 145,
      todaysTasks: [
        {
          id: 1,
          title: "Morning Movement Routine",
          description: "Complete your 15-minute morning mobility exercises",
          category: "Movement",
          completed: false,
          points: 25
        },
        {
          id: 2,
          title: "Pain Journal Entry",
          description: "Record your pain levels and triggers from yesterday",
          category: "Tracking",
          completed: true,
          points: 15
        },
        {
          id: 3,
          title: "Breathing Exercise",
          description: "Practice diaphragmatic breathing for 10 minutes",
          category: "Wellness",
          completed: false,
          points: 20
        }
      ],
      recoveryTools: [
        {
          id: 1,
          title: "Exercise Library",
          description: "Access your personalized exercise programs",
          category: "Movement",
          icon: "💪"
        },
        {
          id: 2,
          title: "Pain Tracking Journal",
          description: "Track your daily pain levels and patterns",
          category: "Tracking",
          icon: "📊"
        },
        {
          id: 3,
          title: "Mindfulness Exercises",
          description: "Guided meditation and relaxation techniques",
          category: "Mental Health",
          icon: "🧘‍♀️"
        }
      ],
      assessments: [
        {
          id: 1,
          title: "Monthly Check-in",
          description: "Complete your monthly progress assessment",
          dueDate: "2024-01-15",
          status: "pending"
        }
      ]
    };
    
    return NextResponse.json(mockData);
  }
} 