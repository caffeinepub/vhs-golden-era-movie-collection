/**
 * Normalizes backend errors into user-facing messages
 * Maps authorization-related failures and canister state errors to clear English messages
 * @param error The error thrown by the backend
 * @returns A user-friendly error message
 */
export function normalizeError(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    // Check for stopped canister (Reject code 5)
    if (
      (message.includes('reject code: 5') || message.includes('reject code 5')) &&
      (message.includes('canister') && message.includes('stopped'))
    ) {
      console.error('[normalizeError] Stopped canister error:', error.message);
      return 'The backend canister is currently stopped. Please reload the page after the canister has been restarted.';
    }
    
    // Check for actor initialization errors
    if (message.includes('actor not initialized') || message.includes('actor not available')) {
      console.error('[normalizeError] Actor initialization error:', error.message);
      return 'Connection is being established. Please wait a moment and try again.';
    }
    
    // Check for access control initialization errors
    if (message.includes('access control') || message.includes('initialization failed')) {
      console.error('[normalizeError] Access control initialization error:', error.message);
      return 'Failed to initialize security system. Please reload the page.';
    }
    
    // Check for authorization-related errors
    if (message.includes('unauthorized') || message.includes('not authorized')) {
      console.error('[normalizeError] Authorization error:', error.message);
      return 'You are not authorized to perform this action.';
    }
    
    // Check for authentication-related errors
    if (message.includes('only authenticated') || message.includes('only users')) {
      console.error('[normalizeError] Authentication error:', error.message);
      return 'You must be logged in to perform this action.';
    }
    
    // Check for ownership-related errors
    if (message.includes('only movie creator') || message.includes('only owner')) {
      console.error('[normalizeError] Ownership error:', error.message);
      return 'You can only modify movies that you created.';
    }
    
    // Log and return the original message for other errors
    console.error('[normalizeError] Unhandled error:', error.message);
    return error.message;
  }
  
  console.error('[normalizeError] Unknown error type:', error);
  return 'An unexpected error occurred. Please try again.';
}
