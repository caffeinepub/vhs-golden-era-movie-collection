import { Smartphone } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function InstallHelpDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-card/90 border-3 border-retro-teal text-retro-teal hover:bg-retro-teal/20 hover:text-retro-magenta hover:border-retro-magenta retro-subheading px-6 h-12 transition-all"
        >
          <Smartphone className="w-5 h-5 mr-2" />
          INSTALL ON PHONE
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-md border-4 border-retro-magenta shadow-retro">
        <div className="retro-grid absolute inset-0 pointer-events-none opacity-10" />
        
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-3xl retro-heading text-retro-magenta retro-glow-magenta mb-4">
            INSTALL ON YOUR PHONE
          </DialogTitle>
          <DialogDescription className="text-retro-teal retro-body text-base">
            Add this app to your home screen for quick access
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 relative z-10 mt-6">
          {/* Android Instructions */}
          <div className="border-3 border-retro-teal bg-card/50 p-6 retro-border-clip">
            <h3 className="text-2xl retro-heading text-retro-teal retro-glow-teal mb-4">
              ► ANDROID (CHROME)
            </h3>
            <ol className="space-y-3 text-retro-amber retro-body list-decimal list-inside">
              <li>Open this site in <strong>Chrome browser</strong></li>
              <li>Tap the <strong>three dots menu</strong> (⋮) in the top right</li>
              <li>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong></li>
              <li>Tap <strong>"Install"</strong> or <strong>"Add"</strong> to confirm</li>
              <li>The app icon will appear on your home screen</li>
            </ol>
          </div>

          {/* iOS Instructions */}
          <div className="border-3 border-retro-magenta bg-card/50 p-6 retro-border-clip">
            <h3 className="text-2xl retro-heading text-retro-magenta retro-glow-magenta mb-4">
              ► iOS (SAFARI)
            </h3>
            <ol className="space-y-3 text-retro-amber retro-body list-decimal list-inside">
              <li>Open this site in <strong>Safari browser</strong></li>
              <li>Tap the <strong>Share button</strong> (□↑) at the bottom</li>
              <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
              <li>Edit the name if you want, then tap <strong>"Add"</strong></li>
              <li>The app icon will appear on your home screen</li>
            </ol>
          </div>

          {/* Benefits */}
          <div className="border-3 border-retro-amber bg-card/50 p-6 retro-border-clip">
            <h3 className="text-2xl retro-heading text-retro-amber retro-glow-amber mb-4">
              ► WHY INSTALL?
            </h3>
            <ul className="space-y-2 text-retro-teal retro-body list-disc list-inside">
              <li>Quick access from your home screen</li>
              <li>Full-screen experience without browser UI</li>
              <li>Works offline after first visit</li>
              <li>Feels like a native app</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
