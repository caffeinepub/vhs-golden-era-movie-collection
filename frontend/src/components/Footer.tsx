import { Heart } from 'lucide-react';
import PublishingHelpDialog from './PublishingHelpDialog';
import InstallHelpDialog from './InstallHelpDialog';

export default function Footer() {
  return (
    <footer className="relative border-t-4 border-retro-magenta bg-card/95 backdrop-blur-md mt-20 shadow-retro">
      <div className="retro-grid absolute inset-0 pointer-events-none opacity-15" />
      
      <div className="container mx-auto px-4 py-10 relative z-10">
        <div className="text-center retro-spacing-sm">
          <p className="text-retro-teal text-lg retro-subheading">
            © 2026. СОЗДАНО С{' '}
            <Heart className="inline w-6 h-6 text-retro-magenta" style={{ animation: 'retro-pulse 1.5s infinite' }} />{' '}
            ИСПОЛЬЗУЯ{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-retro-magenta hover:text-retro-amber transition-colors retro-glow-magenta"
            >
              CAFFEINE.AI
            </a>
          </p>
          <p className="text-retro-amber/80 text-base mt-4 retro-subheading retro-glow-amber">
            ◄◄ ПЕРЕМОТКА • ВОСПРОИЗВЕДЕНИЕ • УСКОРЕННАЯ ПЕРЕМОТКА ►►
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <PublishingHelpDialog />
            <InstallHelpDialog />
          </div>
        </div>
      </div>
    </footer>
  );
}
