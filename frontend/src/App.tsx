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
import { useActor } from './hooks/useActor';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
  },
});

function AppContent() {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const { state, errorMessage, retry, retryCountdown } = useBackendAvailability();
  const { actor, isFetching: actorFetching } = useActor();

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

  // Show backend unavailable screen when backend is genuinely down
  if (state === 'unavailable' && errorMessage) {
    return (
      <BackendUnavailableScreen
        errorMessage={errorMessage}
        onRetry={retry}
        retryCountdown={retryCountdown}
      />
    );
  }

  // Show a minimal loading state while actor is initializing
  if (actorFetching || (!actor && state === 'checking')) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-retro-teal border-t-transparent rounded-full animate-spin" />
          <p className="retro-heading text-retro-teal text-xl tracking-widest animate-pulse">
            ЗАГРУЗКА...
          </p>
        </div>
      </div>
    );
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
