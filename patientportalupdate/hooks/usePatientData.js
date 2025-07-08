import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export function usePatientRecoveryData(patientId, type, enabled) {
  const { data, error, isLoading } = useSWR(
    enabled && patientId && type ? `/api/patients/${patientId}/recovery/${type}` : null,
    fetcher
  );
  return { data, error, isLoading };
} 