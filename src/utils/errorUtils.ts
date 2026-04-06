/**
 * Normalize API error (e.g. axios err.response.data) to a single string.
 * Handles NestJS-style { message: string | string[], statusCode } and plain Error.
 */
export function getErrorMessage(err: unknown, fallback: string): string {
  if (err == null) return fallback;
  const data = (err as any)?.response?.data;
  if (data && typeof data === 'object') {
    const m = data.message;
    if (typeof m === 'string') return m;
    if (Array.isArray(m)) return m.join(', ');
  }
  if (typeof (err as Error)?.message === 'string') return (err as Error).message;
  return fallback;
}

/**
 * Safely convert error state to a string for rendering in React.
 * Prevents "Objects are not valid as a React child" when error is an object (e.g. { message, statusCode }).
 */
export function errorToDisplay(error: unknown): string {
  if (error == null) return '';
  if (typeof error === 'string') return error;
  if (Array.isArray(error)) return error.join(', ');
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const m = (error as { message?: unknown }).message;
    if (typeof m === 'string') return m;
    if (Array.isArray(m)) return m.join(', ');
  }
  return String(error);
}
