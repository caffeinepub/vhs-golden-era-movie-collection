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
    retry: 2,
    retryDelay: 1000,
    staleTime: 30000, // Consider health fresh for 30 seconds
  });

  return {
    ...query,
    isHealthy: query.isSuccess,
    isChecking: actorFetching || query.isLoading,
  };
}
