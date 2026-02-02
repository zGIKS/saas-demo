import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInService } from '@/services/iam/auth-signin.service';
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
      const result = await signInService.signIn(data);

      if (result.success) {
        // Redirect to dashboard
        router.push(ROUTE_PATHS.dashboard);
        return { success: true };
      } else {
        const errorMessage = result.message || 'Invalid credentials';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch {
      const errorMessage = 'Network error. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { signIn, isLoading, error };
}