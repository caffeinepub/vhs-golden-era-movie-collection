import { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Film } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Movie } from '../backend';

interface MovieDetailDialogProps {
  movie: Movie | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPhotoIndex?: number;
}

export default function MovieDetailDialog({
  movie,
  open,
  onOpenChange,
  initialPhotoIndex = 0,
}: MovieDetailDialogProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(initialPhotoIndex);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 50;
  const hasMultiplePhotos = movie ? movie.photos.length > 1 : false;

  useEffect(() => {
    if (open && movie) {
      setCurrentPhotoIndex(initialPhotoIndex);
    }
  }, [open, movie, initialPhotoIndex]);

  useEffect(() => {
    if (!open || !hasMultiplePhotos || !movie) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentPhotoIndex((prev) => (prev - 1 + movie.photos.length) % movie.photos.length);
      } else if (e.key === 'ArrowRight') {
        setCurrentPhotoIndex((prev) => (prev + 1) % movie.photos.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, hasMultiplePhotos, movie, currentPhotoIndex]);

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
  };

  if (!movie) return null;

  const nextPhoto = () => {
    if (hasMultiplePhotos) {
      setCurrentPhotoIndex((prev) => (prev + 1) % movie.photos.length);
    }
  };

  const prevPhoto = () => {
    if (hasMultiplePhotos) {
      setCurrentPhotoIndex((prev) => (prev - 1 + movie.photos.length) % movie.photos.length);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current || !hasMultiplePhotos) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextPhoto();
    } else if (isRightSwipe) {
      prevPhoto();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[98vw] sm:max-w-[90vw] lg:max-w-[85vw] xl:max-w-[1400px] 2xl:max-w-[1600px] max-h-[95vh] overflow-y-auto retro-panel p-0 shadow-retro-lg">
        <div className="retro-grid absolute inset-0 pointer-events-none opacity-15" />
        
        <DialogClose className="absolute right-8 top-8 z-50 rounded-sm opacity-90 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-retro-magenta focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-8 w-8 text-retro-magenta" />
          <span className="sr-only">Закрыть</span>
        </DialogClose>

        <div className="relative">
          {/* Image Section */}
          <div 
            ref={imageContainerRef}
            className="relative bg-muted/30 overflow-hidden flex items-center justify-center min-h-[55vh] max-h-[75vh] p-8 touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {movie.photos.length > 0 ? (
              <>
                <img
                  src={movie.photos[currentPhotoIndex].getDirectURL()}
                  alt={movie.title}
                  className="max-w-full max-h-[70vh] w-auto h-auto object-contain select-none"
                  style={{ display: 'block' }}
                  draggable={false}
                />
                
                {hasMultiplePhotos && (
                  <>
                    <Button
                      onClick={prevPhoto}
                      variant="ghost"
                      size="icon"
                      className="absolute left-8 top-1/2 -translate-y-1/2 bg-card/95 hover:bg-card border-3 border-retro-teal text-retro-teal transition-all hover:scale-110 w-16 h-16 shadow-retro"
                      aria-label="Предыдущее фото"
                    >
                      <ChevronLeft className="w-8 h-8" />
                    </Button>
                    
                    <Button
                      onClick={nextPhoto}
                      variant="ghost"
                      size="icon"
                      className="absolute right-8 top-1/2 -translate-y-1/2 bg-card/95 hover:bg-card border-3 border-retro-teal text-retro-teal transition-all hover:scale-110 w-16 h-16 shadow-retro"
                      aria-label="Следующее фото"
                    >
                      <ChevronRight className="w-8 h-8" />
                    </Button>

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
                      {movie.photos.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPhotoIndex(index)}
                          className={`w-5 h-5 transition-all ${
                            index === currentPhotoIndex
                              ? 'bg-retro-magenta scale-125 shadow-[0_0_16px_rgba(255,0,128,0.9)]'
                              : 'bg-retro-teal/60 hover:bg-retro-teal'
                          }`}
                          style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
                          aria-label={`Перейти к фото ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-retro-purple/20 to-muted min-h-[55vh]">
                <Film className="w-48 h-48 text-retro-teal/40" />
              </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-70 pointer-events-none" />
          </div>

          {/* Content Section */}
          <div className="p-12 retro-spacing-lg relative bg-card">
            <DialogHeader>
              <DialogTitle className="text-5xl retro-heading text-retro-magenta retro-glow-magenta mb-3">
                {movie.title}
              </DialogTitle>
            </DialogHeader>

            {movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {movie.genres.map((genre) => (
                  <Badge
                    key={genre}
                    variant="outline"
                    className="bg-retro-purple/30 border-3 border-retro-teal text-retro-teal text-base retro-subheading px-5 py-2"
                  >
                    {genre.toUpperCase()}
                  </Badge>
                ))}
              </div>
            )}

            <div className="retro-spacing-sm">
              <h3 className="text-2xl retro-subheading text-retro-teal retro-glow-teal">
                ОПИСАНИЕ
              </h3>
              <p className="text-lg retro-body text-foreground/90 whitespace-pre-wrap">
                {movie.description}
              </p>
            </div>

            {movie.photos.length > 0 && (
              <div className="text-base text-retro-amber retro-subheading retro-glow-amber">
                ► ФОТО {currentPhotoIndex + 1} / {movie.photos.length} ◄
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
