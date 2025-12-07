// Secret management for browser environment
// For production, secrets should be handled server-side

/**
 * Get API key from environment
 * In development: uses import.meta.env
 * In production: should use serverless function
 */
export function getApiKey(): string {
  // Check Vite environment variables
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn('API key not configured. Using proxy endpoint.');
    return ''; // Proxy will handle authentication
  }
  
  return apiKey;
}

/**
 * Check if using API proxy
 */
export function useProxy(): boolean {
  return !import.meta.env.VITE_GEMINI_API_KEY;
}
