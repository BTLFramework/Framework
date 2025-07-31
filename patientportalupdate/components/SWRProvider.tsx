'use client'

import { SWRConfig } from 'swr'

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig 
      value={{
        refreshInterval: 0, // Disable automatic refresh
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 60000, // 1 minute default
        errorRetryCount: 2,
        errorRetryInterval: 2000,
        focusThrottleInterval: 5000, // Throttle focus events
        loadingTimeout: 3000, // Timeout for loading states
        onError: (error, key) => {
          // Log errors but don't throw to prevent crashes
          console.error('SWR Error:', error, 'Key:', key);
        },
        onSuccess: (data, key) => {
          // Optional: Log successful data fetches
          console.log('SWR Success:', key);
        },
      }}
    >
      {children}
    </SWRConfig>
  )
} 