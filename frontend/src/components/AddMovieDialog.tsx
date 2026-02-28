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
        toast.error('Вы должны войти в систему, чтобы добавлять фильмы.');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Guard: Check if user is authenticated before submitting
    if (!identity) {
      toast.error('Вы должны войти в систему, чтобы добавлять фильмы.');
      return;
    }

    if (!title.trim()) {
      toast.error('Пожалуйста, введите название фильма');
      return;
    }

    if (photos.length === 0) {
      toast.error('Пожалуйста, добавьте хотя бы одно фото');
      return;
    }

    try {
      // Convert files to ExternalBlobs with progress tracking
      const photoBlobs = await Promise.all(
        photos.map(async (file, index) => {
          const arrayBuffer = await file.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);
          return ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
            setUploadProgress(prev => {
              const newProgress = [...prev];
              newProgress[index] = percentage;
              return newProgress;
            });
          });
        })
      );

      await addMovie.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        photos: photoBlobs,
        genres,
      });

      toast.success('Фильм успешно добавлен в коллекцию!');
      
      // Reset form
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
      <DialogContent className="retro-panel border-3 border-retro-magenta shadow-retro-lg max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="retro-grid absolute inset-0 pointer-events-none opacity-10" />
        
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-3xl retro-heading text-retro-magenta retro-glow-magenta">
            ДОБАВИТЬ ФИЛЬМ
          </DialogTitle>
          <DialogDescription className="text-base retro-body text-foreground/90 mt-2">
            Добавьте новый фильм в вашу коллекцию 80-х
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-retro-teal retro-subheading text-base">
              НАЗВАНИЕ *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название фильма"
              className="bg-background/90 border-2 border-retro-teal focus:border-retro-magenta h-12 text-base"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-retro-teal retro-subheading text-base">
              ОПИСАНИЕ
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Введите описание фильма"
              className="bg-background/90 border-2 border-retro-teal focus:border-retro-magenta min-h-[120px] text-base"
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-retro-teal retro-subheading text-base">
              ЖАНРЫ
            </Label>
            <div className="flex gap-2">
              <Input
                value={genreInput}
                onChange={(e) => setGenreInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddGenre())}
                placeholder="Добавить жанр"
                className="bg-background/90 border-2 border-retro-teal focus:border-retro-magenta h-12 text-base"
              />
              <Button
                type="button"
                onClick={handleAddGenre}
                className="bg-retro-teal hover:bg-retro-teal/90 text-white retro-subheading px-6 h-12"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {genres.map((genre) => (
                  <Badge
                    key={genre}
                    variant="outline"
                    className="bg-retro-purple/20 border-2 border-retro-teal text-retro-teal text-sm retro-subheading pl-3 pr-2 py-1"
                  >
                    {genre}
                    <button
                      type="button"
                      onClick={() => handleRemoveGenre(genre)}
                      className="ml-2 hover:text-retro-magenta"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-retro-teal retro-subheading text-base">
              ФОТО * (макс. 3)
            </Label>
            <div className="border-2 border-dashed border-retro-teal hover:border-retro-magenta transition-colors p-6 text-center bg-background/50">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                className="hidden"
                id="photo-upload"
                disabled={photos.length >= 3}
              />
              <label
                htmlFor="photo-upload"
                className={`cursor-pointer flex flex-col items-center gap-3 ${
                  photos.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Upload className="w-12 h-12 text-retro-teal" />
                <span className="text-retro-teal retro-body text-base">
                  {photos.length >= 3 
                    ? 'Достигнут лимит фото' 
                    : 'Нажмите для загрузки фото'}
                </span>
              </label>
            </div>

            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Предпросмотр ${index + 1}`}
                      className="w-full h-32 object-cover border-2 border-retro-teal"
                    />
                    {uploadProgress[index] !== undefined && uploadProgress[index] < 100 && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <span className="text-retro-magenta retro-heading text-lg">
                          {uploadProgress[index]}%
                        </span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-2 right-2 bg-destructive hover:bg-destructive/90 text-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="bg-background border-3 border-retro-teal text-retro-teal hover:bg-muted retro-subheading h-12 px-8"
            >
              ОТМЕНА
            </Button>
            <Button
              type="submit"
              disabled={addMovie.isPending || !title.trim() || photos.length === 0}
              className="bg-retro-magenta hover:bg-retro-magenta/90 text-white retro-heading h-12 px-8 disabled:opacity-50"
            >
              {addMovie.isPending ? 'ДОБАВЛЕНИЕ...' : 'ДОБАВИТЬ ФИЛЬМ'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
