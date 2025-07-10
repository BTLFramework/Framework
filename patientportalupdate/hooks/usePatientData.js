import { useState, useEffect } from 'react';

export function usePatientRecoveryData(patientId, type, enabled) {
  const [data, setData] = useState(undefined);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Don't fetch during SSR or build time
    if (typeof window === 'undefined') {
      return;
    }

    if (!enabled || !patientId || !type) {
      setData(undefined);
      setError(null);
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/patients/${patientId}/recovery/${type}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('Error fetching patient recovery data:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [patientId, type, enabled]);

  return { data, error, isLoading };
} 