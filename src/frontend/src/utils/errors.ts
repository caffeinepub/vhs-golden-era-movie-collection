/**
 * Normalizes backend errors into user-facing messages
 * Maps authorization-related failures to clear English messages
 * @param error The error thrown by the backend
 * @returns A user-friendly error message
 */
export function normalizeError(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    // Check for authorization-related errors
    if (message.includes('unauthorized') || message.includes('not authorized')) {
      return 'You are not authorized to perform this action.';
    }
    
    // Check for authentication-related errors
    if (message.includes('only authenticated') || message.includes('only users')) {
      return 'You must be logged in to perform this action.';
    }
    
    // Check for ownership-related errors
    if (message.includes('only movie creator') || message.includes('only owner')) {
      return 'You can only modify movies that you created.';
    }
    
    // Return the original message for other errors
    return error.message;
  }
  
  return 'An unexpected error occurred.';
}
