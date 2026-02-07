import { useEffect, useRef } from 'react';

export default function VHSEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.02;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Retro scan line effect
      if (Math.random() > 0.95) {
        const scanY = Math.random() * canvas.height;
        const scanHeight = Math.random() * 3 + 1;
        ctx.fillStyle = `rgba(0, 255, 255, ${Math.random() * 0.15})`;
        ctx.fillRect(0, scanY, canvas.width, scanHeight);
      }

      // Horizontal glitch lines
      if (Math.random() > 0.98) {
        const glitchY = Math.random() * canvas.height;
        const glitchHeight = Math.random() * 4 + 2;
        ctx.fillStyle = `rgba(255, 0, 128, ${Math.random() * 0.2})`;
        ctx.fillRect(0, glitchY, canvas.width, glitchHeight);
      }

      // Random pixel noise
      if (Math.random() > 0.96) {
        for (let i = 0; i < 5; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const size = Math.random() * 2 + 1;
          ctx.fillStyle = `rgba(255, 200, 0, ${Math.random() * 0.3})`;
          ctx.fillRect(x, y, size, size);
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {/* Neon Grid Background */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url(/assets/generated/neon-grid-bg.dim_1920x1080.png)',
          opacity: 0.25,
          mixBlendMode: 'screen',
        }}
      />
      
      {/* Geometric Pattern Overlay */}
      <div 
        className="fixed inset-0 z-0"
        style={{ 
          backgroundImage: 'url(/assets/generated/geo-pattern-overlay.dim_1920x1080.png)',
          opacity: 0.08,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Animated Canvas Effects */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ mixBlendMode: 'screen', opacity: 0.6 }}
      />

      {/* Retro Grid Overlay */}
      <div className="fixed inset-0 z-0 retro-grid pointer-events-none opacity-30" />
    </>
  );
}
