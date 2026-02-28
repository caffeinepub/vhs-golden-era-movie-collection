import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useBackendAvailability } from '../context/BackendAvailabilityContext';
import { isBackendUnavailableError } from '../utils/errors';
import type { Movie, MovieId, PaginationInfo } from '../backend';
import { ExternalBlob } from '../backend';

export function useGetMovies(page: number) {
  const { actor, isFetching: actorFetching } = useActor();
  const { reportUnavailable } = useBackendAvailability();

  return useQuery<Movie[]>({
    queryKey: ['movies', page],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      const movies = await actor.getMovies(BigInt(page));
      return movies;
    },
    enabled: !!actor && !actorFetching,
    placeholderData: (previousData) => previousData,
    staleTime: 30000,
    retry: (failureCount, error) => {
      if (isBackendUnavailableError(error)) {
        reportUnavailable(error);
        return false;
      }
      return failureCount < 2;
    },
  });
}

export function useGetPaginationInfo() {
  const { actor, isFetching: actorFetching } = useActor();
  const { reportUnavailable } = useBackendAvailability();

  return useQuery<PaginationInfo>({
    queryKey: ['paginationInfo'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getPaginationInfo();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 30000,
    retry: (failureCount, error) => {
      if (isBackendUnavailableError(error)) {
        reportUnavailable(error);
        return false;
      }
      return failureCount < 2;
    },
  });
}

export function useFilterByGenre(genre: string | null) {
  const { actor, isFetching: actorFetching } = useActor();
  const { reportUnavailable } = useBackendAvailability();

  return useQuery<Movie[]>({
    queryKey: ['movies', 'genre', genre],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      if (!genre) return [];
      return actor.filterByGenre(genre);
    },
    enabled: !!actor && !actorFetching && !!genre,
    placeholderData: (previousData) => previousData,
    staleTime: 30000,
    retry: (failureCount, error) => {
      if (isBackendUnavailableError(error)) {
        reportUnavailable(error);
        return false;
      }
      return failureCount < 2;
    },
  });
}

export function useGetAllGenres() {
  const { actor, isFetching: actorFetching } = useActor();
  const { reportUnavailable } = useBackendAvailability();

  return useQuery<string[]>({
    queryKey: ['genres'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getAllGenres();
    },
    enabled: !!actor && !actorFetching,
    placeholderData: (previousData) => previousData,
    staleTime: 30000,
    retry: (failureCount, error) => {
      if (isBackendUnavailableError(error)) {
        reportUnavailable(error);
        return false;
      }
      return failureCount < 2;
    },
  });
}

export function useAddMovie() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      photos,
      genres,
    }: {
      title: string;
      description: string;
      photos: ExternalBlob[];
      genres: string[];
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addMovie(title, description, photos, genres);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      queryClient.invalidateQueries({ queryKey: ['genres'] });
      queryClient.invalidateQueries({ queryKey: ['paginationInfo'] });
    },
  });
}

export function useDeleteMovie() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: MovieId) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteMovie(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      queryClient.invalidateQueries({ queryKey: ['genres'] });
      queryClient.invalidateQueries({ queryKey: ['paginationInfo'] });
    },
  });
}
