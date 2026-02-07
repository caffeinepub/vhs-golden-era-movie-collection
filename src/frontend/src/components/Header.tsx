import { Film, Plus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetAllGenres } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import AuthControls from './AuthControls';

interface HeaderProps {
  selectedGenre: string | null;
  onGenreChange: (genre: string | null) => void;
}

export default function Header({ selectedGenre, onGenreChange }: HeaderProps) {
  const { data: genres, isLoading: genresLoading, error: genresError } = useGetAllGenres();
  const { identity } = useInternetIdentity();

  const handleAddClick = () => {
    // Check if user is authenticated before opening dialog
    if (!identity) {
      toast.error('You must be logged in to add movies.');
      return;
    }

    const event = new CustomEvent('openAddMovieDialog');
    window.dispatchEvent(event);
  };

  // Log genre loading errors
  if (genresError) {
    console.error('[Header] Error loading genres:', genresError);
  }

  return (
    <header className="relative border-b-4 border-retro-magenta bg-card/95 backdrop-blur-md shadow-retro">
      <div className="retro-grid absolute inset-0 pointer-events-none opacity-20" />
      
      <div className="container mx-auto px-4 py-10 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Film className="w-16 h-16 text-retro-magenta" style={{ animation: 'retro-glow-pulse 2s infinite' }} />
              <div className="absolute inset-0 blur-2xl bg-retro-magenta/60" />
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl retro-heading text-retro-magenta retro-glow-magenta">
                80s CINEMA
              </h1>
              <p className="text-base md:text-lg text-retro-teal retro-subheading mt-2 retro-glow-teal">
                ► RETRO COLLECTION ◄
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5 w-full lg:w-auto">
            {genresError ? (
              <div className="flex items-center gap-2 text-retro-magenta text-sm retro-subheading">
                <AlertCircle className="w-4 h-4" />
                <span>Genre loading failed</span>
              </div>
            ) : (
              <Select 
                value={selectedGenre || 'all'} 
                onValueChange={(value) => onGenreChange(value === 'all' ? null : value)}
                disabled={genresLoading || !genres}
              >
                <SelectTrigger className="w-full sm:w-[240px] bg-background/90 border-3 border-retro-teal text-retro-teal hover:border-retro-amber transition-all shadow-retro font-bold text-base h-14 disabled:opacity-50">
                  <SelectValue placeholder={genresLoading ? "LOADING..." : "ALL GENRES"} />
                </SelectTrigger>
                <SelectContent className="bg-card border-3 border-retro-teal shadow-retro-lg">
                  <SelectItem value="all" className="text-retro-teal hover:text-retro-magenta focus:text-retro-magenta font-bold text-base">
                    ALL GENRES
                  </SelectItem>
                  {genres && genres.map((genre) => (
                    <SelectItem key={genre} value={genre} className="text-retro-teal hover:text-retro-magenta focus:text-retro-magenta font-bold text-base">
                      {genre.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Button
                onClick={handleAddClick}
                className="bg-retro-magenta hover:bg-retro-magenta/90 text-white retro-heading retro-glow-button px-8 h-14 text-base flex-1 sm:flex-none"
              >
                <Plus className="w-6 h-6 mr-2" />
                ADD
              </Button>

              <AuthControls />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
