import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BackgroundMusic() {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element with synthwave music URL
    // Using a royalty-free synthwave track from a CDN
    const audio = new Audio('https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    // Auto-play with user interaction fallback
    const playAudio = () => {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Auto-play blocked, will play on first user interaction
          document.addEventListener('click', () => {
            audio.play().then(() => setIsPlaying(true));
          }, { once: true });
        });
    };

    playAudio();

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = 0.3;
        if (!isPlaying) {
          audioRef.current.play().then(() => setIsPlaying(true));
        }
      } else {
        audioRef.current.volume = 0;
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <Button
      onClick={toggleMute}
      size="icon"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-vhs-purple/80 hover:bg-vhs-purple border-2 border-vhs-pink/50 vhs-glow-button shadow-lg"
      aria-label={isMuted ? 'Включить музыку' : 'Выключить музыку'}
    >
      {isMuted ? (
        <VolumeX className="w-6 h-6 text-vhs-pink" />
      ) : (
        <Volume2 className="w-6 h-6 text-vhs-pink animate-pulse" />
      )}
    </Button>
  );
}
