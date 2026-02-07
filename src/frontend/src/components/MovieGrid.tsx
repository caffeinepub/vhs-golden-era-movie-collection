import { useState } from 'react';
import { useGetMovies, useFilterByGenre } from '../hooks/useQueries';
import MovieCard from './MovieCard';
import MovieDetailDialog from './MovieDetailDialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Film, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Movie } from '../backend';
import { normalizeError } from '../utils/errors';

interface MovieGridProps {
  selectedGenre: string | null;
}

export default function MovieGrid({ selectedGenre }: MovieGridProps) {
  const [page, setPage] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { 
    data: paginatedMovies, 
    isLoading: isPaginatedLoading,
    error: paginatedError,
    isFetching: isPaginatedFetching,
    isFetched: isPaginatedFetched
  } = useGetMovies(page);
  
  const { 
    data: filteredMovies, 
    isLoading: isFilteredLoading,
    error: filteredError,
    isFetching: isFilteredFetching,
    isFetched: isFilteredFetched
  } = useFilterByGenre(selectedGenre);
  
  const movies = selectedGenre ? filteredMovies : paginatedMovies;
  const isLoading = selectedGenre ? isFilteredLoading : isPaginatedLoading;
  const isFetching = selectedGenre ? isFilteredFetching : isPaginatedFetching;
  const isFetched = selectedGenre ? isFilteredFetched : isPaginatedFetched;
  const error = selectedGenre ? filteredError : paginatedError;

  const hasNextPage = !selectedGenre && paginatedMovies && paginatedMovies.length === 10;
  const hasPrevPage = !selectedGenre && page > 0;

  const handleOpenDetail = (movie: Movie, photoIndex: number) => {
    setSelectedMovie(movie);
    setSelectedPhotoIndex(photoIndex);
    setIsDialogOpen(true);
  };

  // Show loading state during initial load or when actor is initializing
  if (isLoading || (isFetching && !movies)) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-[450px] w-full bg-retro-teal/20 retro-border-clip" />
            <Skeleton className="h-6 w-3/4 bg-retro-teal/20" />
            <Skeleton className="h-5 w-1/2 bg-retro-teal/20" />
          </div>
        ))}
      </div>
    );
  }

  // Show error state if query failed
  if (error) {
    console.error('[MovieGrid] Error:', error);
    const errorMessage = normalizeError(error);
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="relative mb-10">
          <AlertCircle className="w-40 h-40 text-retro-magenta/40" />
          <div className="absolute inset-0 blur-3xl bg-retro-magenta/30" />
        </div>
        <h2 className="text-4xl retro-heading text-retro-magenta mb-4 retro-glow-magenta">
          ERROR LOADING MOVIES
        </h2>
        <p className="text-xl retro-body text-retro-amber mb-6 text-center max-w-md">
          {errorMessage}
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-retro-teal hover:bg-retro-teal/90 text-white retro-heading px-8 h-14"
        >
          RELOAD PAGE
        </Button>
      </div>
    );
  }

  // Show empty state only when we have successfully fetched data and it's empty
  if (isFetched && (!movies || movies.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="relative mb-10">
          <Film className="w-40 h-40 text-retro-magenta/40" />
          <div className="absolute inset-0 blur-3xl bg-retro-magenta/30" />
        </div>
        <h2 className="text-4xl retro-heading text-retro-teal mb-4 retro-glow-teal">
          {selectedGenre ? 'NO MOVIES FOUND' : 'COLLECTION EMPTY'}
        </h2>
        <p className="text-xl retro-body text-retro-amber">
          {selectedGenre 
            ? 'No movies in this genre yet' 
            : 'Add your first movie to the collection'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
        {movies && movies.map((movie) => (
          <MovieCard 
            key={movie.id.toString()} 
            movie={movie}
            onOpenDetail={handleOpenDetail}
          />
        ))}
      </div>

      {!selectedGenre && (hasNextPage || hasPrevPage) && (
        <div className="flex justify-center items-center gap-8 pt-10">
          <Button
            onClick={() => setPage(p => p - 1)}
            disabled={!hasPrevPage}
            variant="outline"
            className="bg-card/90 border-3 border-retro-teal text-retro-teal hover:bg-retro-teal/20 hover:text-retro-magenta hover:border-retro-magenta disabled:opacity-30 retro-subheading px-8 h-14 transition-all"
          >
            <ChevronLeft className="w-6 h-6 mr-2" />
            BACK
          </Button>
          
          <span className="text-retro-amber retro-heading text-xl retro-glow-amber">
            ► {page + 1} ◄
          </span>
          
          <Button
            onClick={() => setPage(p => p + 1)}
            disabled={!hasNextPage}
            variant="outline"
            className="bg-card/90 border-3 border-retro-teal text-retro-teal hover:bg-retro-teal/20 hover:text-retro-magenta hover:border-retro-magenta disabled:opacity-30 retro-subheading px-8 h-14 transition-all"
          >
            NEXT
            <ChevronRight className="w-6 h-6 ml-2" />
          </Button>
        </div>
      )}

      <MovieDetailDialog
        movie={selectedMovie}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialPhotoIndex={selectedPhotoIndex}
      />
    </div>
  );
}
