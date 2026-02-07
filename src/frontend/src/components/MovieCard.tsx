import { useState } from 'react';
import { Trash2, Film, Info } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useDeleteMovie } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import type { Movie } from '../backend';
import { isMovieOwner } from '../utils/movieOwnership';
import { normalizeError } from '../utils/errors';

interface MovieCardProps {
  movie: Movie;
  onOpenDetail: (movie: Movie, photoIndex: number) => void;
}

export default function MovieCard({ movie, onOpenDetail }: MovieCardProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const deleteMovie = useDeleteMovie();
  const { identity } = useInternetIdentity();

  // Check if current user is the owner of this movie
  const isOwner = isMovieOwner(movie, identity);

  const handleDelete = async () => {
    try {
      await deleteMovie.mutateAsync(movie.id);
      toast.success('Фильм удалён из коллекции');
    } catch (error) {
      // Use error normalizer to show clear authorization messages
      const errorMessage = normalizeError(error);
      toast.error(errorMessage);
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (movie.photos.length > 1) {
      setCurrentPhotoIndex((prev) => (prev + 1) % movie.photos.length);
    }
  };

  const handleCardClick = () => {
    onOpenDetail(movie, currentPhotoIndex);
  };

  return (
    <Card className="group relative overflow-hidden retro-panel-hover retro-card retro-border-clip">
      <div className="retro-grid absolute inset-0 pointer-events-none opacity-10" />
      
      <CardContent className="p-0 relative">
        <div 
          className="relative aspect-[2/3] overflow-hidden cursor-pointer"
          onClick={handleImageClick}
        >
          {movie.photos.length > 0 ? (
            <>
              <img
                src={movie.photos[currentPhotoIndex].getDirectURL()}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {movie.photos.length > 1 && (
                <div className="absolute bottom-4 right-4 flex gap-2">
                  {movie.photos.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 transition-all duration-300 ${
                        index === currentPhotoIndex 
                          ? 'bg-retro-magenta shadow-[0_0_12px_rgba(255,0,128,0.9)] scale-125' 
                          : 'bg-retro-teal/60 hover:bg-retro-teal'
                      }`}
                      style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-retro-purple/20 to-muted">
              <Film className="w-24 h-24 text-retro-teal/40" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        </div>

        <div 
          className="p-6 retro-spacing-md cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={handleCardClick}
        >
          <h3 className="text-xl retro-heading text-retro-magenta line-clamp-2 retro-glow-magenta mb-4">
            {movie.title}
          </h3>
          
          <p className="text-sm retro-body text-foreground/90 line-clamp-3 leading-relaxed mb-4">
            {movie.description}
          </p>

          {movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres.map((genre) => (
                <Badge
                  key={genre}
                  variant="outline"
                  className="bg-retro-purple/30 border-2 border-retro-teal text-retro-teal text-xs retro-subheading px-3 py-1"
                >
                  {genre.toUpperCase()}
                </Badge>
              ))}
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-2 bg-retro-purple/30 hover:bg-retro-purple/50 border-3 border-retro-teal text-retro-teal retro-subheading transition-all h-11"
          >
            <Info className="w-5 h-5 mr-2" />
            ПОДРОБНЕЕ
          </Button>
        </div>
      </CardContent>

      {/* Only show delete button if user is the owner */}
      {isOwner && (
        <CardFooter className="p-6 pt-0">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="w-full bg-destructive hover:bg-destructive/90 border-3 border-destructive text-white retro-subheading transition-all h-11"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 className="w-5 h-5 mr-2" />
                УДАЛИТЬ
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="retro-panel shadow-retro-lg max-w-md">
              <div className="retro-grid absolute inset-0 pointer-events-none opacity-10" />
              
              <AlertDialogHeader className="relative z-10">
                <AlertDialogTitle className="text-3xl retro-heading text-retro-magenta retro-glow-magenta">
                  УДАЛИТЬ ФИЛЬМ?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-base retro-body text-foreground/90 mt-4">
                  Вы уверены, что хотите удалить "{movie.title}" из коллекции? Это действие нельзя отменить.
                </AlertDialogDescription>
              </AlertDialogHeader>
              
              <AlertDialogFooter className="relative z-10 mt-6">
                <AlertDialogCancel className="bg-background border-3 border-retro-teal text-retro-teal hover:bg-muted retro-subheading px-6 h-12">
                  ОТМЕНА
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={deleteMovie.isPending}
                  className="bg-destructive hover:bg-destructive/90 text-white retro-heading px-6 h-12"
                >
                  {deleteMovie.isPending ? 'УДАЛЕНИЕ...' : 'УДАЛИТЬ'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      )}
    </Card>
  );
}
