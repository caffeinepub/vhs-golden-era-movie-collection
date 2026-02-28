import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { normalizeError, isBackendUnavailableError } from '../utils/errors';

type AvailabilityState = 'checking' | 'available' | 'unavailable';

const AUTO_RETRY_INTERVAL = 10; // seconds

interface BackendAvailabilityContextType {
  state: AvailabilityState;
  errorMessage: string | null;
  reportUnavailable: (error: unknown) => void;
  clearError: () => void;
  retry: () => Promise<void>;
  retryCountdown: number;
}

const BackendAvailabilityContext = createContext<BackendAvailabilityContextType | null>(null);

export function BackendAvailabilityProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AvailabilityState>('checking');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCountdown, setRetryCountdown] = useState(AUTO_RETRY_INTERVAL);
  const queryClient = useQueryClient();
  const { actor, isFetching: actorFetching } = useActor();

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoRetryRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasTransitionedRef = useRef(false);

  const clearTimers = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    if (autoRetryRef.current) {
      clearTimeout(autoRetryRef.current);
      autoRetryRef.current = null;
    }
  }, []);

  // Transition to 'available' as soon as the actor is ready
  useEffect(() => {
    if (!actorFetching && actor && !hasTransitionedRef.current) {
      hasTransitionedRef.current = true;
      setState('available');
      setErrorMessage(null);
      clearTimers();
    }
  }, [actor, actorFetching, clearTimers]);

  // Start auto-retry countdown when unavailable
  useEffect(() => {
    if (state !== 'unavailable') {
      clearTimers();
      return;
    }

    // Reset countdown
    setRetryCountdown(AUTO_RETRY_INTERVAL);

    // Tick countdown every second
    countdownRef.current = setInterval(() => {
      setRetryCountdown((prev) => {
        if (prev <= 1) return AUTO_RETRY_INTERVAL;
        return prev - 1;
      });
    }, 1000);

    // Auto-retry after interval
    const scheduleAutoRetry = () => {
      autoRetryRef.current = setTimeout(async () => {
        if (state !== 'unavailable') return;
        try {
          await queryClient.refetchQueries({ queryKey: ['movies'], type: 'active' });
          await queryClient.refetchQueries({ queryKey: ['genres'], type: 'active' });
          await queryClient.refetchQueries({ queryKey: ['paginationInfo'], type: 'active' });
          // If refetch didn't throw, assume backend is back
          setState('available');
          setErrorMessage(null);
          clearTimers();
        } catch {
          scheduleAutoRetry();
        }
      }, AUTO_RETRY_INTERVAL * 1000);
    };

    scheduleAutoRetry();

    return () => {
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const reportUnavailable = useCallback((error: unknown) => {
    // Only report as unavailable for genuine backend failures
    if (isBackendUnavailableError(error)) {
      setState('unavailable');
      setErrorMessage(normalizeError(error));
    }
  }, []);

  const clearError = useCallback(() => {
    setState('available');
    setErrorMessage(null);
    clearTimers();
  }, [clearTimers]);

  const retry = useCallback(async () => {
    clearTimers();
    setState('checking');
    setErrorMessage(null);

    try {
      await queryClient.invalidateQueries();
      await queryClient.refetchQueries({ queryKey: ['movies'], type: 'active' });
      await queryClient.refetchQueries({ queryKey: ['genres'], type: 'active' });
      await queryClient.refetchQueries({ queryKey: ['paginationInfo'], type: 'active' });
      setState('available');
      setErrorMessage(null);
    } catch (error) {
      if (isBackendUnavailableError(error)) {
        setState('unavailable');
        setErrorMessage(normalizeError(error));
      } else {
        // Non-fatal error, still mark as available
        setState('available');
        setErrorMessage(null);
      }
    }
  }, [queryClient, clearTimers]);

  return (
    <BackendAvailabilityContext.Provider
      value={{
        state,
        errorMessage,
        reportUnavailable,
        clearError,
        retry,
        retryCountdown,
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
