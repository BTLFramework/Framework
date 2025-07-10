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

  useEffect(() => {
    if (!patientEmail) {
      setLoading(false);
      return;
    }

    const fetchAssignedExercises = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/patient-portal/exercises/${encodeURIComponent(patientEmail)}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch exercises: ${response.statusText}`);
        }

        const result = await response.json();
        
        if (result.success) {
          setData(result.data);
        } else {
          throw new Error(result.error || 'Failed to fetch exercises');
        }
      } catch (err) {
        console.error('Error fetching assigned exercises:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedExercises();
  }, [patientEmail]);

  return { data, loading, error };
} 