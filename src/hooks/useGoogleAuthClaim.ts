import { useCallback, useState } from 'react';
import { getAuthSdk } from '@/services/iam/auth.service';
import { setRefreshTokenCookie, setTokenCookie } from '@/lib/auth';

export function useGoogleAuthClaim() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const claimCode = useCallback(async (code: string) => {
    if (!code) {
      const message = 'Google exchange code is missing.';
      setError(message);
      return { success: false, message };
    }

    setIsLoading(true);
    setError(null);

    try {
      const { sdk, error: sdkError } = getAuthSdk();
      if (!sdk) {
        const message = sdkError || 'Auth SDK is not configured.';
        setError(message);
        return { success: false, message };
      }

      const result = await sdk.auth.claimGoogle(code);

      if (result?.token) {
        setTokenCookie(result.token);
      }
      if (result?.refresh_token) {
        setRefreshTokenCookie(result.refresh_token);
      }

      return { success: true, data: result };
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
