import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut } from 'lucide-react';

export default function AuthControls() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';
  const disabled = isLoggingIn;

  const handleAuth = async () => {
    if (isAuthenticated) {
      // Log out and clear all cached data
      console.log('[AuthControls] Logging out and clearing cache');
      await clear();
      queryClient.clear();
    } else {
      // Log in
      try {
        console.log('[AuthControls] Initiating login');
        await login();
        console.log('[AuthControls] Login successful');
      } catch (error: any) {
        console.error('[AuthControls] Login error:', error);
        // Handle case where user is already authenticated
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <div className="flex items-center gap-4">
      {isAuthenticated && (
        <span className="text-sm retro-subheading text-retro-teal hidden md:block">
          AUTHENTICATED
        </span>
      )}
      <Button
        onClick={handleAuth}
        disabled={disabled}
        className={`${
          isAuthenticated
            ? 'bg-retro-teal/20 hover:bg-retro-teal/30 border-3 border-retro-teal text-retro-teal'
            : 'bg-retro-magenta hover:bg-retro-magenta/90 text-white retro-glow-button'
        } retro-heading px-6 h-12 text-sm transition-all disabled:opacity-50`}
      >
        {isLoggingIn ? (
          <>LOGGING IN...</>
        ) : isAuthenticated ? (
          <>
            <LogOut className="w-4 h-4 mr-2" />
            LOG OUT
          </>
        ) : (
          <>
            <LogIn className="w-4 h-4 mr-2" />
            LOG IN
          </>
        )}
      </Button>
    </div>
  );
}
