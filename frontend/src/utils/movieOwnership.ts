import type { Movie } from '../backend';
import type { Identity } from '@dfinity/agent';

/**
 * Checks if the current user is the owner/creator of a movie
 * @param movie The movie to check ownership for
 * @param identity The current user's identity (from useInternetIdentity)
 * @returns true if the current user is the movie creator, false otherwise
 */
export function isMovieOwner(movie: Movie, identity: Identity | null | undefined): boolean {
  if (!identity) return false;
  return movie.creator.toString() === identity.getPrincipal().toString();
}
