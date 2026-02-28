import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
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
  initialPhotoIndex = 0 
}: MovieDetailDialogProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(initialPhotoIndex);

  useEffect(() => {
    if (open) {
      setCurrentPhotoIndex(initialPhotoIndex);
    }
  }, [open, initialPhotoIndex]);

  if (!movie) return null;

  const hasMultiplePhotos = movie.photos.length > 1;

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + movie.photos.length) % movie.photos.length);
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % movie.photos.length);
  };

  const handlePhotoClick = (index: number) => {
    setCurrentPhotoIndex(index);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="retro-panel border-4 border-retro-magenta shadow-retro-lg max-w-[95vw] lg:max-w-7xl max-h-[95vh] overflow-y-auto p-0">
        <div className="retro-grid absolute inset-0 pointer-events-none opacity-10" />
        
        <div className="relative z-10">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-6 right-6 z-20 bg-retro-magenta/90 hover:bg-retro-magenta text-white p-3 transition-colors retro-glow-button"
            aria-label="Закрыть"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] bg-gradient-to-br from-retro-purple/20 to-muted">
            {movie.photos.length > 0 && (
              <>
                <img
                  src={movie.photos[currentPhotoIndex].getDirectURL()}
                  alt={`${movie.title} - Фото ${currentPhotoIndex + 1}`}
                  className="w-full h-full object-contain"
                />

                {hasMultiplePhotos && (
                  <>
                    <Button
                      onClick={handlePrevPhoto}
                      className="absolute left-6 top-1/2 -translate-y-1/2 bg-retro-teal/90 hover:bg-retro-teal text-white p-4 retro-glow-button"
                      aria-label="Предыдущее фото"
                    >
                      <ChevronLeft className="w-8 h-8" />
                    </Button>

                    <Button
                      onClick={handleNextPhoto}
                      className="absolute right-6 top-1/2 -translate-y-1/2 bg-retro-teal/90 hover:bg-retro-teal text-white p-4 retro-glow-button"
                      aria-label="Следующее фото"
                    >
                      <ChevronRight className="w-8 h-8" />
                    </Button>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                      {movie.photos.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => handlePhotoClick(index)}
                          className={`w-5 h-5 transition-all duration-300 ${
                            index === currentPhotoIndex 
                              ? 'bg-retro-magenta shadow-[0_0_16px_rgba(255,0,128,1)] scale-125' 
                              : 'bg-retro-teal/60 hover:bg-retro-teal shadow-[0_0_8px_rgba(0,255,255,0.6)]'
                          }`}
                          style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
                          aria-label={`Перейти к фото ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          <div className="p-10 space-y-6">
            <DialogHeader>
              <DialogTitle className="text-5xl retro-heading text-retro-magenta retro-glow-magenta leading-tight">
                {movie.title}
              </DialogTitle>
            </DialogHeader>

            {movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {movie.genres.map((genre) => (
                  <Badge
                    key={genre}
                    variant="outline"
                    className="bg-retro-purple/20 border-3 border-retro-teal text-retro-teal text-base retro-subheading px-4 py-2"
                  >
                    {genre.toUpperCase()}
                  </Badge>
                ))}
              </div>
            )}

            <div className="space-y-3">
              <h3 className="text-2xl retro-heading text-retro-amber retro-glow-amber">
                ОПИСАНИЕ
              </h3>
              <p className="text-lg retro-body text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {movie.description || 'Описание отсутствует'}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
