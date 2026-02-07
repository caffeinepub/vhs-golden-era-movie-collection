import { useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Header from './components/Header';
import Footer from './components/Footer';
import MovieGrid from './components/MovieGrid';
import AddMovieDialog from './components/AddMovieDialog';
import VHSEffects from './components/VHSEffects';
import BackgroundMusic from './components/BackgroundMusic';

function App() {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="relative min-h-screen overflow-hidden">
        <VHSEffects />
        <BackgroundMusic />
        
        <div className="relative z-10">
          <Header 
            selectedGenre={selectedGenre}
            onGenreChange={setSelectedGenre}
          />
          
          <main className="container mx-auto px-4 py-12 min-h-[calc(100vh-200px)]">
            <MovieGrid selectedGenre={selectedGenre} />
          </main>
          
          <Footer />
        </div>
        
        <AddMovieDialog />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
