/**
 * Normalizes various error types into user-friendly Russian messages
 */
export function normalizeError(error: unknown): string {
  // Handle null/undefined
  if (!error) {
    return 'Произошла неожиданная ошибка';
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Handle Error objects
  if (error instanceof Error) {
    const message = error.message;

    // Check for stopped canister (Reject code 5)
    if (message.includes('Reject code: 5') || message.includes('canister is stopped')) {
      return 'Бэкенд-канистер в данный момент остановлен. Пожалуйста, перезагрузите страницу после перезапуска канистера.';
    }

    // Check for actor initialization errors
    if (message.includes('Actor not available') || message.includes('Actor not initialized')) {
      return 'Подключение к бэкенду... Пожалуйста, подождите.';
    }

    // Check for authorization errors from backend traps
    if (message.includes('Unauthorized') || message.includes('Only authenticated users')) {
      return 'Вы должны войти в систему для выполнения этого действия.';
    }

    if (message.includes('Only movie creator can delete')) {
      return 'Только создатель фильма может его удалить.';
    }

    if (message.includes('Only users can')) {
      return 'Вы должны войти в систему для выполнения этого действия.';
    }

    // Return the original message if no specific pattern matched
    return message;
  }

  // Handle objects with message property
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return normalizeError((error as { message: unknown }).message);
  }

  // Fallback
  return 'Произошла неожиданная ошибка';
}

/**
 * Checks if an error indicates backend unavailability (stopped canister or actor init failure)
 */
export function isBackendUnavailableError(error: unknown): boolean {
  if (!error) return false;

  const message = typeof error === 'string' 
    ? error 
    : error instanceof Error 
      ? error.message 
      : typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message: unknown }).message)
        : '';

  return (
    message.includes('Reject code: 5') ||
    message.includes('canister is stopped') ||
    message.includes('Actor not available') ||
    message.includes('Actor not initialized')
  );
}
