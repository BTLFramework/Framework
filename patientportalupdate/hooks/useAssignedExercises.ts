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
  const [isStale, setIsStale] = useState(false);

  console.log(`🏃 useAssignedExercises called with email: "${patientEmail}" (type: ${typeof patientEmail}, length: ${patientEmail?.length})`);

  useEffect(() => {
    console.log(`🔄 useEffect triggered for email: "${patientEmail}"`);
    console.log(`🔍 useEffect dependency check - patientEmail: "${patientEmail}", length: ${patientEmail?.length}`);
    
    if (!patientEmail) {
      setData(null);
      setIsStale(false);
      setLoading(false);
      setError(null);
      return;
    }

    // The dependency only changes when the authenticated patient changes.
    // Clear the prior patient's plan before loading the new one.
    setData(null);
    setIsStale(false);

    const fetchAssignedExercises = async () => {
      try {
        console.log(`🌐 Making API call to fetch exercises for: ${patientEmail}`);
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/patient-portal/exercises/${encodeURIComponent(patientEmail)}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.log(`❌ HTTP Error ${response.status}:`, errorData);
          // Preserve the last verified plan during a transient failure.
          // Never replace it with fabricated region/phase/SRS values.
          setIsStale(true);
          setError(errorData.error || 'Assigned exercises are temporarily unavailable');
          return;
        }

        const result = await response.json();
        console.log(`📦 API Response:`, result);
        
        if (result.success) {
          console.log(`✅ Setting exercise data:`, result.data);
          setData(result.data);
          setIsStale(false);
          setError(null);
        } else {
          console.log(`❌ API Error:`, result.error);
          setError(result.error || 'Failed to fetch exercises');
          setData(null);
        }
      } catch (err) {
        console.error('Error fetching assigned exercises:', err);
        setIsStale(true);
        setError('Assigned exercises are temporarily unavailable');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedExercises();
  }, [patientEmail]);

  console.log(`📤 useAssignedExercises returning:`, { data, loading, error });
  return { data, loading, error, isStale };
}
