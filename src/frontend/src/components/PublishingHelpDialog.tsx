import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { HelpCircle, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';

export default function PublishingHelpDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-retro-teal hover:text-retro-amber transition-colors retro-subheading text-sm"
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          HELP
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] bg-card border-4 border-retro-magenta shadow-retro-lg">
        <DialogHeader>
          <DialogTitle className="text-3xl retro-heading text-retro-magenta retro-glow-magenta">
            PUBLISHING GUIDE
          </DialogTitle>
          <DialogDescription className="text-retro-teal retro-subheading text-base">
            How to publish your changes and troubleshoot common issues
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-foreground">
            {/* Publish Changes Section */}
            <section>
              <h3 className="text-xl retro-heading text-retro-amber mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Publish Changes
              </h3>
              <div className="space-y-3 text-sm retro-subheading leading-relaxed">
                <p>
                  Your Caffeine project has two environments:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong className="text-retro-teal">Draft:</strong> Your working version where you make and test changes
                  </li>
                  <li>
                    <strong className="text-retro-teal">Live:</strong> The published version that visitors see
                  </li>
                </ul>
                <p className="mt-4">
                  <strong>To publish your changes:</strong>
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Open your project in the Caffeine dashboard</li>
                  <li>Test your changes in the Draft preview</li>
                  <li>Click the <strong className="text-retro-magenta">"Publish"</strong> or <strong className="text-retro-magenta">"Promote to Live"</strong> button</li>
                  <li>Wait for the deployment to complete (usually 1-2 minutes)</li>
                  <li>Visit your Live URL to verify the changes</li>
                </ol>
                <p className="mt-4 text-retro-amber">
                  <strong>Important:</strong> Always test in Draft before publishing to Live.
                </p>
              </div>
            </section>

            <Separator className="bg-retro-teal/30" />

            {/* Troubleshooting Section */}
            <section>
              <h3 className="text-xl retro-heading text-retro-amber mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Troubleshooting
              </h3>

              {/* Stopped Canister */}
              <div className="space-y-3 mb-6">
                <h4 className="text-base retro-heading text-retro-magenta">
                  "The backend canister is currently stopped"
                </h4>
                <div className="text-sm retro-subheading leading-relaxed space-y-2">
                  <p>
                    This error means your Live site is trying to connect to a backend canister that has been stopped or is no longer available.
                  </p>
                  <p>
                    <strong className="text-retro-teal">Why this happens:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>The backend canister was redeployed with a new ID</li>
                    <li>The canister ran out of cycles and stopped</li>
                    <li>Live is pointing to an older version of the backend</li>
                  </ul>
                  <p className="mt-3">
                    <strong className="text-retro-teal">How to fix:</strong>
                  </p>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Verify that Draft works correctly (if Draft works, the backend is fine)</li>
                    <li>Make sure the backend canister is running and has cycles</li>
                    <li>Publish Draft to Live again to update the connection</li>
                    <li>Clear your browser cache and reload the Live URL</li>
                  </ol>
                  <p className="mt-3 text-retro-amber">
                    <strong>Note:</strong> If Draft works but Live doesn't, publishing again will fix the connection.
                  </p>
                </div>
              </div>

              <Separator className="bg-retro-teal/20 my-4" />

              {/* Login Popup Issues */}
              <div className="space-y-3">
                <h4 className="text-base retro-heading text-retro-magenta">
                  Login popup shows blank page (about:blank)
                </h4>
                <div className="text-sm retro-subheading leading-relaxed space-y-2">
                  <p>
                    If the Internet Identity login window opens as a blank white page, your browser is blocking the popup.
                  </p>
                  <p>
                    <strong className="text-retro-teal">How to fix in Chrome:</strong>
                  </p>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Look for a popup blocked icon in the address bar (usually on the right)</li>
                    <li>Click it and select "Always allow popups from this site"</li>
                    <li>Refresh the page and try logging in again</li>
                  </ol>
                  <p className="mt-3">
                    <strong className="text-retro-teal">Alternative method:</strong>
                  </p>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Open Chrome Settings → Privacy and security → Site settings</li>
                    <li>Click "Pop-ups and redirects"</li>
                    <li>Add your site to the "Allowed to send pop-ups" list</li>
                  </ol>
                  <p className="mt-3">
                    <strong className="text-retro-teal">Still not working?</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Try opening the site in Incognito/Private mode</li>
                    <li>Disable browser extensions (AdBlock, VPN, etc.) temporarily</li>
                    <li>Try a different browser (Firefox, Safari, Edge)</li>
                  </ul>
                </div>
              </div>
            </section>

            <Separator className="bg-retro-teal/30" />

            {/* Additional Resources */}
            <section>
              <h3 className="text-xl retro-heading text-retro-amber mb-3">
                Need More Help?
              </h3>
              <div className="text-sm retro-subheading leading-relaxed space-y-2">
                <p>
                  For detailed documentation, visit:
                </p>
                <a
                  href="https://docs.caffeine.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-retro-magenta hover:text-retro-amber transition-colors retro-glow-magenta"
                >
                  Caffeine Documentation
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
