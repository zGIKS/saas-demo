import { useCallback, useState } from 'react';
import { googleAuthService, AuthResult } from '@/services/iam/auth-google.service';

export function useGoogleAuthClaim() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const claimCode = useCallback(async (code: string): Promise<AuthResult> => {
    if (!code) {
      const message = 'Google exchange code is missing.';
      setError(message);
      return { success: false, message };
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await googleAuthService.claimCode({ code });
      if (!result.success) {
        setError(result.message || 'No se pudo reclamar el código de Google.');
      }
      return result;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred during the Google login flow.';
      console.error('Google claim hook error:', err);
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { claimCode, isLoading, error };
}
