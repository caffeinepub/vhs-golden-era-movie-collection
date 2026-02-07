import { Film, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetAllGenres } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';

interface HeaderProps {
  selectedGenre: string | null;
  onGenreChange: (genre: string | null) => void;
}

export default function Header({ selectedGenre, onGenreChange }: HeaderProps) {
  const { data: genres = [] } = useGetAllGenres();
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

  return (
    <header className="relative border-b-4 border-retro-magenta bg-card/95 backdrop-blur-md shadow-retro">
      <div className="retro-grid absolute inset-0 pointer-events-none opacity-20" />
      
      <div className="container mx-auto px-4 py-10 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Film className="w-16 h-16 text-retro-magenta" style={{ animation: 'retro-glow-pulse 2s infinite' }} />
              <div className="absolute inset-0 blur-2xl bg-retro-magenta/60" />
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl retro-heading text-retro-magenta retro-glow-magenta">
                КИНО 80-Х
              </h1>
              <p className="text-base md:text-lg text-retro-teal retro-subheading mt-2 retro-glow-teal">
                ► РЕТРО КОЛЛЕКЦИЯ ◄
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5 w-full md:w-auto">
            <Select value={selectedGenre || 'all'} onValueChange={(value) => onGenreChange(value === 'all' ? null : value)}>
              <SelectTrigger className="w-[240px] bg-background/90 border-3 border-retro-teal text-retro-teal hover:border-retro-amber transition-all shadow-retro font-bold text-base h-14">
                <SelectValue placeholder="ВСЕ ЖАНРЫ" />
              </SelectTrigger>
              <SelectContent className="bg-card border-3 border-retro-teal shadow-retro-lg">
                <SelectItem value="all" className="text-retro-teal hover:text-retro-magenta focus:text-retro-magenta font-bold text-base">
                  ВСЕ ЖАНРЫ
                </SelectItem>
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre} className="text-retro-teal hover:text-retro-magenta focus:text-retro-magenta font-bold text-base">
                    {genre.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={handleAddClick}
              className="bg-retro-magenta hover:bg-retro-magenta/90 text-white retro-heading retro-glow-button px-8 h-14 text-base"
            >
              <Plus className="w-6 h-6 mr-2" />
              ДОБАВИТЬ
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
