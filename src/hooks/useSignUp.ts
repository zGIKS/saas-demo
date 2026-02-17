'use client';

import { useState } from 'react';
import { authService } from '@/services/iam/auth.service';

interface SignUpData {
  email: string;
  password: string;
}

interface UseSignUpReturn {
  signUp: (data: SignUpData) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
  error: string | null;
}

export function useSignUp(): UseSignUpReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signUp = async (data: SignUpData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.signUp(data);

      if (result.success) {
        return { success: true };
      } else {
        const errorMessage = result.message || 'Failed to create account';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { signUp, isLoading, error };
}
