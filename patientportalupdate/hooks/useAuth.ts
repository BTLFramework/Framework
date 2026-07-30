import useSWR from 'swr';
import { normalizeClinicalProfile } from '@/lib/clinicalState';

interface Patient {
  id: number;
  name: string;
  email: string;
  currentPhase?: string;
  phase?: string;
  score?: string | number;
  srsScores?: any[];
  srsScore?: number;
}

// SWR fetcher function
const fetcher = async (url: string) => {
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Return null for unauthenticated state instead of throwing
      return null;
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return normalizeClinicalProfile(data);
};

export function useAuth() {
  const { data: patient, error, isLoading, mutate } = useSWR<Patient | null>(
    '/api/patient-portal/profile',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minute
      errorRetryCount: 1,
      shouldRetryOnError: false, // Don't retry on auth errors
    }
  );

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/patient-portal/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Revalidate the profile data
        await mutate();
        return true;
      } else {
        const data = await response.json();
        console.error('Login failed:', data);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const refetch = async () => {
    await mutate();
  };

  return {
    patient: patient || null,
    loading: isLoading,
    error: error?.message || null,
    isAuthenticated: !!patient,
    refetch,
    login,
  };
}
