import useSWR from 'swr';

// SWR fetcher function
const fetcher = async (url) => {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

export function usePatientRecoveryData(patientId, type, isOpen) {
  // Create a unique SWR key only when conditions are met
  const swrKey = isOpen && patientId && type 
    ? `/api/patients/${patientId}/recovery/${type}` 
    : null;

  const { data, error, isLoading, mutate } = useSWR(
    swrKey,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 30000, // 30 seconds
      errorRetryCount: 2,
      errorRetryInterval: 1000,
    }
  );

  // Temporary debugging
  console.log('🔍 usePatientRecoveryData DEBUG:', { 
    patientId, 
    type, 
    isOpen, 
    swrKey,
    hasData: !!data,
    isLoading,
    hasError: !!error 
  });

  return { 
    data: data || undefined, 
    error: error || null, 
    isLoading: isLoading || false,
    mutate 
  };
} 