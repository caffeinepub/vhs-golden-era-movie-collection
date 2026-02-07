import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Plus } from 'lucide-react';
import { useAddMovie } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';
import { normalizeError } from '../utils/errors';

export default function AddMovieDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [genreInput, setGenreInput] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);

  const addMovie = useAddMovie();
  const { identity } = useInternetIdentity();

  useEffect(() => {
    const handleOpen = () => {
      // Guard: Check if user is authenticated before opening dialog
      if (!identity) {
        toast.error('You must be logged in to add movies.');
        return;
      }
      setOpen(true);
    };
    window.addEventListener('openAddMovieDialog', handleOpen);
    return () => window.removeEventListener('openAddMovieDialog', handleOpen);
  }, [identity]);

  const handleAddGenre = () => {
    if (genreInput.trim() && !genres.includes(genreInput.trim())) {
      setGenres([...genres, genreInput.trim()]);
      setGenreInput('');
    }
  };

  const handleRemoveGenre = (genre: string) => {
    setGenres(genres.filter(g => g !== genre));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = 3 - photos.length;
    
    if (files.length > remainingSlots) {
      toast.error(`Можно добавить только ${remainingSlots} фото`);
      return;
    }

    setPhotos([...photos, ...files]);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
    setUploadProgress(uploadProgress.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Guard: Check authentication before submission
    if (!identity) {
      toast.error('You must be logged in to add movies.');
      setOpen(false);
      return;
    }

    if (!title.trim()) {
      toast.error('Введите название фильма');
      return;
    }

    if (genres.length === 0) {
      toast.error('Добавьте хотя бы один жанр');
      return;
    }

    try {
      const photoBlobs: ExternalBlob[] = [];
      
      for (let i = 0; i < photos.length; i++) {
        const file = photos[i];
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(prev => {
            const newProgress = [...prev];
            newProgress[i] = percentage;
            return newProgress;
          });
        });
        
        photoBlobs.push(blob);
      }

      await addMovie.mutateAsync({
        title,
        description,
        photos: photoBlobs,
        genres,
      });

      toast.success('Фильм добавлен в коллекцию!');
      
      setTitle('');
      setDescription('');
      setGenres([]);
      setPhotos([]);
      setUploadProgress([]);
      setOpen(false);
    } catch (error) {
      // Use error normalizer to show clear authorization messages
      const errorMessage = normalizeError(error);
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="retro-panel max-w-3xl max-h-[90vh] overflow-y-auto shadow-retro-lg">
        <div className="retro-grid absolute inset-0 pointer-events-none opacity-10" />
        
        <DialogHeader className="relative z-10 pb-6 border-b-3 border-retro-teal/50">
          <DialogTitle className="text-4xl retro-heading text-retro-magenta retro-glow-magenta">
            ДОБАВИТЬ ФИЛЬМ
          </DialogTitle>
          <DialogDescription className="text-base retro-body text-retro-teal mt-3">
            Заполните информацию о фильме для добавления в коллекцию
          </DialogDescription>
        </DialogHeader>

        <div className="retro-spacing-lg relative z-10 py-8">
          <div className="retro-spacing-sm">
            <Label htmlFor="title" className="text-lg retro-subheading text-retro-teal">
              НАЗВАНИЕ *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название фильма"
              className="bg-background border-3 border-retro-teal text-foreground placeholder:text-muted-foreground h-14 text-base font-bold"
            />
          </div>

          <div className="retro-spacing-sm">
            <Label htmlFor="description" className="text-lg retro-subheading text-retro-teal">
              ОПИСАНИЕ
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Краткое описание фильма"
              rows={5}
              className="bg-background border-3 border-retro-teal text-foreground placeholder:text-muted-foreground resize-none text-base retro-body"
            />
          </div>

          <div className="retro-spacing-sm">
            <Label className="text-lg retro-subheading text-retro-teal">ЖАНРЫ *</Label>
            <div className="flex gap-4">
              <Input
                value={genreInput}
                onChange={(e) => setGenreInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddGenre())}
                placeholder="Введите жанр"
                className="bg-background border-3 border-retro-teal text-foreground placeholder:text-muted-foreground h-14 text-base font-bold"
              />
              <Button
                type="button"
                onClick={handleAddGenre}
                className="bg-retro-purple/40 hover:bg-retro-purple/60 border-3 border-retro-teal text-retro-teal h-14 px-8"
              >
                <Plus className="w-6 h-6" />
              </Button>
            </div>
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-5">
                {genres.map((genre) => (
                  <Badge
                    key={genre}
                    className="bg-retro-purple/30 border-3 border-retro-teal text-retro-teal pr-2 py-2 text-sm retro-subheading"
                  >
                    {genre.toUpperCase()}
                    <button
                      onClick={() => handleRemoveGenre(genre)}
                      className="ml-3 hover:text-retro-magenta transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="retro-spacing-sm">
            <Label className="text-lg retro-subheading text-retro-teal">
              ФОТОГРАФИИ (до 3)
            </Label>
            <div className="space-y-5">
              {photos.length < 3 && (
                <label className="flex items-center justify-center w-full h-48 border-3 border-dashed border-retro-teal cursor-pointer hover:border-retro-magenta transition-all bg-muted/40">
                  <div className="text-center">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-retro-teal" />
                    <span className="text-base retro-subheading text-retro-teal">
                      НАЖМИТЕ ДЛЯ ЗАГРУЗКИ
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              )}

              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-5">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-48 object-cover border-3 border-retro-teal retro-border-clip"
                      />
                      {uploadProgress[index] !== undefined && uploadProgress[index] < 100 && (
                        <div className="absolute inset-0 bg-black/90 flex items-center justify-center">
                          <span className="text-retro-teal text-lg retro-heading">{uploadProgress[index]}%</span>
                        </div>
                      )}
                      <button
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute -top-3 -right-3 bg-destructive hover:bg-destructive/90 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-retro"
                        style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="relative z-10 pt-6 border-t-3 border-retro-teal/50">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="bg-background border-3 border-retro-teal text-retro-teal hover:bg-muted retro-subheading px-8 h-14 text-base"
          >
            ОТМЕНА
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={addMovie.isPending}
            className="bg-retro-magenta hover:bg-retro-magenta/90 text-white retro-heading retro-glow-button px-10 h-14 text-base"
          >
            {addMovie.isPending ? 'ДОБАВЛЕНИЕ...' : 'ДОБАВИТЬ'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
