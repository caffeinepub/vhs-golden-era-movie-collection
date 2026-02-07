import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Movie, MovieId } from '../backend';
import { ExternalBlob } from '../backend';

export function useGetMovies(page: number) {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<Movie[]>({
    queryKey: ['movies', page],
    queryFn: async () => {
      if (!actor) {
        console.error('[useGetMovies] Actor not available during query execution');
        throw new Error('Actor not initialized');
      }
      console.log('[useGetMovies] Fetching movies for page:', page);
      const movies = await actor.getMovies(BigInt(page));
      console.log('[useGetMovies] Fetched', movies.length, 'movies');
      return movies;
    },
    enabled: !!actor && !actorFetching,
    placeholderData: (previousData) => previousData,
    retry: 1,
  });

  // Return custom state that properly reflects actor dependency
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && !actorFetching && query.isFetched,
  };
}

export function useFilterByGenre(genre: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<Movie[]>({
    queryKey: ['movies', 'genre', genre],
    queryFn: async () => {
      if (!actor) {
        console.error('[useFilterByGenre] Actor not available during query execution');
        throw new Error('Actor not initialized');
      }
      if (!genre) {
        console.log('[useFilterByGenre] No genre selected, returning empty array');
        return [];
      }
      console.log('[useFilterByGenre] Filtering by genre:', genre);
      const movies = await actor.filterByGenre(genre);
      console.log('[useFilterByGenre] Found', movies.length, 'movies');
      return movies;
    },
    enabled: !!actor && !actorFetching && !!genre,
    placeholderData: (previousData) => previousData,
    retry: 1,
  });

  // Return custom state that properly reflects actor dependency
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && !actorFetching && query.isFetched,
  };
}

export function useGetAllGenres() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<string[]>({
    queryKey: ['genres'],
    queryFn: async () => {
      if (!actor) {
        console.error('[useGetAllGenres] Actor not available during query execution');
        throw new Error('Actor not initialized');
      }
      console.log('[useGetAllGenres] Fetching all genres');
      const genres = await actor.getAllGenres();
      console.log('[useGetAllGenres] Fetched', genres.length, 'genres');
      return genres;
    },
    enabled: !!actor && !actorFetching,
    placeholderData: (previousData) => previousData,
    retry: 1,
  });

  // Return custom state that properly reflects actor dependency
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && !actorFetching && query.isFetched,
  };
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
    },
  });
}
