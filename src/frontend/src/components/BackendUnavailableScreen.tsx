import { AlertCircle, RefreshCw, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface BackendUnavailableScreenProps {
  errorMessage: string;
  onRetry: () => Promise<void>;
}

export default function BackendUnavailableScreen({ errorMessage, onRetry }: BackendUnavailableScreenProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center justify-center px-4 py-16 max-w-2xl mx-auto">
        <div className="relative mb-12">
          <AlertCircle className="w-48 h-48 text-retro-magenta/40" />
          <div className="absolute inset-0 blur-3xl bg-retro-magenta/30" />
        </div>

        <h1 className="text-5xl md:text-6xl retro-heading text-retro-magenta mb-6 retro-glow-magenta text-center">
          БЭКЕНД НЕДОСТУПЕН
        </h1>

        <div className="bg-card/90 border-4 border-retro-teal p-8 mb-10 retro-border-clip shadow-retro-lg max-w-xl">
          <p className="text-xl retro-body text-retro-amber text-center leading-relaxed">
            {errorMessage}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
          <Button
            onClick={handleRetry}
            disabled={isRetrying}
            className="bg-retro-teal hover:bg-retro-teal/90 text-white retro-heading px-10 h-16 text-lg retro-glow-button disabled:opacity-50"
          >
            {isRetrying ? (
              <>
                <RotateCw className="w-6 h-6 mr-3 animate-spin" />
                ПОВТОРНАЯ ПОПЫТКА...
              </>
            ) : (
              <>
                <RotateCw className="w-6 h-6 mr-3" />
                ПОВТОРИТЬ
              </>
            )}
          </Button>

          <Button
            onClick={handleReload}
            variant="outline"
            className="bg-card/90 border-3 border-retro-magenta text-retro-magenta hover:bg-retro-magenta/20 hover:text-retro-magenta retro-heading px-10 h-16 text-lg"
          >
            <RefreshCw className="w-6 h-6 mr-3" />
            ПЕРЕЗАГРУЗИТЬ
          </Button>
        </div>

        <div className="mt-12 text-center">
          <p className="text-base retro-body text-retro-teal/70">
            Если проблема сохраняется, обратитесь к администратору
          </p>
        </div>
      </div>
    </div>
  );
}
