import { useState, useEffect } from 'react';
import type { Exercise } from '@/types/exercise';
import { exercises as localExerciseLibrary } from '@/lib/exerciseLibrary';

interface AssignedExercisesData {
  exercises: Exercise[];
  totalPoints: number;
  region: string;
  phase: string;
  srsScore: number;
}

// Function to get exercises from local library based on patient data
const getLocalExercises = async (patientEmail: string): Promise<AssignedExercisesData> => {
  try {
    // First try to get patient data to determine region and phase
    const patientResponse = await fetch(`/api/patients/portal-data/${patientEmail}`);
    let region = 'Neck'; // Default fallback
    let phase = 'EDUCATE'; // Default fallback
    let srsScore = 4; // Default fallback
    
    if (patientResponse.ok) {
      const patientData = await patientResponse.json();
      if (patientData.success && patientData.data) {
        region = patientData.data.region || 'Neck';
        phase = patientData.data.phase || 'EDUCATE';
        srsScore = patientData.data.srsScore?.srsScore || 4;
      }
    }
    
    // Map phase names to match exercise library
    const phaseMap: Record<string, string> = {
      'RESET': 'Reset',
      'EDUCATE': 'Educate', 
      'REBUILD': 'Rebuild'
    };
    
    const mappedPhase = phaseMap[phase] || 'Educate';
    
    // Filter exercises by region and phase
    const filteredExercises = localExerciseLibrary.filter(ex => 
      ex.region.toLowerCase().includes(region.toLowerCase()) && 
      ex.phase === mappedPhase
    );
    
    // If no exact matches, try broader matching
    const fallbackExercises = filteredExercises.length > 0 ? filteredExercises : 
      localExerciseLibrary.filter(ex => ex.phase === mappedPhase).slice(0, 3);
    
    return {
      exercises: fallbackExercises.map(ex => ({
        id: ex.id,
        name: ex.name,
        difficulty: ex.difficulty,
        points: ex.points,
        description: ex.description,
        duration: ex.duration,
        instructions: ex.instructions,
        videoId: ex.videoId,
        region: ex.region,
        phase: ex.phase,
        focus: ex.focus
      })),
      totalPoints: fallbackExercises.reduce((sum, ex) => sum + ex.points, 0),
      region: region,
      phase: phase,
      srsScore: srsScore
    };
  } catch (error) {
    console.log('⚠️ Error getting local exercises, using defaults:', error);
    // Return default exercises
    return {
      exercises: localExerciseLibrary.slice(0, 3).map(ex => ({
        id: ex.id,
        name: ex.name,
        difficulty: ex.difficulty,
        points: ex.points,
        description: ex.description,
        duration: ex.duration,
        instructions: ex.instructions,
        videoId: ex.videoId,
        region: ex.region,
        phase: ex.phase,
        focus: ex.focus
      })),
      totalPoints: 9,
      region: 'Neck',
      phase: 'EDUCATE',
      srsScore: 4
    };
  }
};

export function useAssignedExercises(patientEmail: string) {
  const [data, setData] = useState<AssignedExercisesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log(`🏃 useAssignedExercises called with email: "${patientEmail}" (type: ${typeof patientEmail}, length: ${patientEmail?.length})`);

  useEffect(() => {
    console.log(`🔄 useEffect triggered for email: "${patientEmail}"`);
    console.log(`🔍 useEffect dependency check - patientEmail: "${patientEmail}", length: ${patientEmail?.length}`);
    
    if (!patientEmail) {
      console.log('❌ No patient email provided to useAssignedExercises');
      setLoading(false);
      setError('No patient email provided');
      return;
    }

    const fetchAssignedExercises = async () => {
      try {
        console.log(`🌐 Making API call to fetch exercises for: ${patientEmail}`);
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/patient-portal/exercises/${encodeURIComponent(patientEmail)}`);
        
        if (!response.ok) {
          // Backend failed, use local exercise library as fallback
          console.log(`⚠️ Backend exercise fetch failed (${response.status}), using local exercise library`);
          const localExercises = await getLocalExercises(patientEmail);
          setData(localExercises);
          setError(null);
          return;
        }

        const result = await response.json();
        console.log(`📦 API Response:`, result);
        
        if (result.success) {
          console.log(`✅ Setting exercise data:`, result.data);
          setData(result.data);
          setError(null);
        } else {
          // Backend returned error, use local exercise library as fallback
          console.log(`⚠️ Backend exercise data invalid, using local exercise library`);
          const localExercises = await getLocalExercises(patientEmail);
          setData(localExercises);
          setError(null);
        }
      } catch (error) {
        console.log(`❌ API Error:`, error);
        // Use local exercise library as fallback on any error
        const localExercises = await getLocalExercises(patientEmail);
        setData(localExercises);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedExercises();
  }, [patientEmail]);

  console.log(`📤 useAssignedExercises returning:`, { data, loading, error });
  return { data, loading, error };
} 