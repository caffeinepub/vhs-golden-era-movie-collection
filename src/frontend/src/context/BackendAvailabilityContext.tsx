import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useBackendHealth } from '../hooks/useBackendHealth';
import { normalizeError } from '../utils/errors';

type AvailabilityState = 'checking' | 'available' | 'unavailable';

interface BackendAvailabilityContextType {
  state: AvailabilityState;
  errorMessage: string | null;
  reportUnavailable: (error: unknown) => void;
  clearError: () => void;
  retry: () => Promise<void>;
}

const BackendAvailabilityContext = createContext<BackendAvailabilityContextType | null>(null);

export function BackendAvailabilityProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AvailabilityState>('checking');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { isHealthy, isChecking, error: healthError, refetch: refetchHealth } = useBackendHealth();

  // Update state based on health check
  useEffect(() => {
    if (isChecking) {
      setState('checking');
    } else if (isHealthy) {
      setState('available');
      setErrorMessage(null);
    } else if (healthError) {
      setState('unavailable');
      setErrorMessage(normalizeError(healthError));
    }
  }, [isHealthy, isChecking, healthError]);

  const reportUnavailable = useCallback((error: unknown) => {
    setState('unavailable');
    setErrorMessage(normalizeError(error));
  }, []);

  const clearError = useCallback(() => {
    setState('available');
    setErrorMessage(null);
  }, []);

  const retry = useCallback(async () => {
    setState('checking');
    setErrorMessage(null);
    
    try {
      // Refetch health check
      const result = await refetchHealth();
      
      if (result.isSuccess) {
        // Health check succeeded, refetch all queries
        await queryClient.refetchQueries({ 
          queryKey: ['movies'],
          type: 'active'
        });
        await queryClient.refetchQueries({ 
          queryKey: ['genres'],
          type: 'active'
        });
        await queryClient.refetchQueries({ 
          queryKey: ['paginationInfo'],
          type: 'active'
        });
        
        setState('available');
        setErrorMessage(null);
      } else {
        setState('unavailable');
        setErrorMessage(normalizeError(result.error));
      }
    } catch (error) {
      setState('unavailable');
      setErrorMessage(normalizeError(error));
    }
  }, [refetchHealth, queryClient]);

  return (
    <BackendAvailabilityContext.Provider
      value={{
        state,
        errorMessage,
        reportUnavailable,
        clearError,
        retry,
      }}
    >
      {children}
    </BackendAvailabilityContext.Provider>
  );
}

export function useBackendAvailability() {
  const context = useContext(BackendAvailabilityContext);
  if (!context) {
    throw new Error('useBackendAvailability must be used within BackendAvailabilityProvider');
  }
  return context;
}
