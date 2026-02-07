import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Movie, MovieId } from '../backend';
import { ExternalBlob } from '../backend';

export function useGetMovies(page: number) {
  const { actor, isFetching } = useActor();

  return useQuery<Movie[]>({
    queryKey: ['movies', page],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMovies(BigInt(page));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFilterByGenre(genre: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Movie[]>({
    queryKey: ['movies', 'genre', genre],
    queryFn: async () => {
      if (!actor || !genre) return [];
      return actor.filterByGenre(genre);
    },
    enabled: !!actor && !isFetching && !!genre,
  });
}

export function useGetAllGenres() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['genres'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllGenres();
    },
    enabled: !!actor && !isFetching,
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
