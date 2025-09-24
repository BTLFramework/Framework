import { useState, useEffect } from 'react';
import type { Exercise } from '@/types/exercise';

interface AssignedExercisesData {
  exercises: Exercise[];
  totalPoints: number;
  region: string;
  phase: string;
  srsScore: number;
}

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
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.log(`❌ HTTP Error ${response.status}:`, errorData);
          // Graceful fallback for any non-OK: show empty exercises (no red error in UI)
          setData({ exercises: [], totalPoints: 0, region: 'Neck', phase: 'EDUCATE', srsScore: 0 });
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
          console.log(`❌ API Error:`, result.error);
          setError(result.error || 'Failed to fetch exercises');
          setData(null);
        }
      } catch (err) {
        console.error('Error fetching assigned exercises, using fallback:', err);
        // Network/unknown error fallback: empty exercises list
        setData({ exercises: [], totalPoints: 0, region: 'Neck', phase: 'EDUCATE', srsScore: 0 });
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