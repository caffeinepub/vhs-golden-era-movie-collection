import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { BackendAvailabilityProvider, useBackendAvailability } from './context/BackendAvailabilityContext';
import Header from './components/Header';
import Footer from './components/Footer';
import MovieGrid from './components/MovieGrid';
import AddMovieDialog from './components/AddMovieDialog';
import VHSEffects from './components/VHSEffects';
import BackgroundMusic from './components/BackgroundMusic';
import BackendUnavailableScreen from './components/BackendUnavailableScreen';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60000,
    },
  },
});

function AppContent() {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const { state, errorMessage, retry } = useBackendAvailability();

  useEffect(() => {
    // Register service worker for PWA offline support
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('[SW] Registered:', registration.scope);
          })
          .catch((error) => {
            console.error('[SW] Registration failed:', error);
          });
      });
    }
  }, []);

  // Show backend unavailable screen when backend is down
  if (state === 'unavailable' && errorMessage) {
    return <BackendUnavailableScreen errorMessage={errorMessage} onRetry={retry} />;
  }

  return (
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
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <BackendAvailabilityProvider>
          <AppContent />
        </BackendAvailabilityProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
