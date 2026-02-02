import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthSdk } from '@/services/iam/auth.service';
import { setRefreshTokenCookie, setTokenCookie } from '@/lib/auth';
import { ROUTE_PATHS } from '@/lib/paths';

interface SignInData {
  email: string;
  password: string;
}

interface UseSignInReturn {
  signIn: (data: SignInData) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
  error: string | null;
}

export function useSignIn(): UseSignInReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const signIn = async (data: SignInData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { sdk, error } = getAuthSdk();
      if (!sdk) {
        const errorMessage = error || 'Auth SDK is not configured.';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      const result = await sdk.auth.signIn({
        email: data.email.trim(),
        password: data.password,
      });

      if (result?.token) {
        setTokenCookie(result.token);
      }
      if (result?.refresh_token) {
        setRefreshTokenCookie(result.refresh_token);
      }

      if (result) {
        // Redirect to dashboard
        router.push(ROUTE_PATHS.dashboard);
        return { success: true };
      }

      const errorMessage = 'Invalid credentials';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { signIn, isLoading, error };
}
