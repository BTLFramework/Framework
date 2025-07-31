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
          // Don't throw error for 404 - just set error and let component handle with mock data
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.log(`❌ HTTP Error ${response.status}:`, errorData);
          setError(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
          setData(null);
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
        console.error('Error fetching assigned exercises:', err);
        setError(err instanceof Error ? err.message : 'Network error occurred');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedExercises();
  }, [patientEmail]);

  console.log(`📤 useAssignedExercises returning:`, { data, loading, error });
  return { data, loading, error };
} 