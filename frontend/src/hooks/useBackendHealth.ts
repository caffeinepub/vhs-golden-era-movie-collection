import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useBackendHealth() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery({
    queryKey: ['backendHealth'],
    queryFn: async () => {
      if (!actor) {
        throw new Error('Actor not initialized');
      }
      const result = await actor.backendHealthCheck();
      return result;
    },
    enabled: !!actor && !actorFetching,
    retry: 1,
    retryDelay: 2000,
    staleTime: 15000, // Consider health fresh for 15 seconds
    gcTime: 0,        // Don't cache failed results
  });

  return {
    ...query,
    isHealthy: query.isSuccess,
    isChecking: actorFetching || query.isLoading || query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
}
