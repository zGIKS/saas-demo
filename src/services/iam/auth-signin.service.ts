import { setTokenCookie, setRefreshTokenCookie } from '@/lib/auth';
import { getAuthSdk } from './auth.service';

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  data?: unknown;
  message?: string;
}

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

export const signInService = {
  async signIn(data: SignInData): Promise<AuthResult> {
    try {
      // Validate input before API call
      if (!data.email || !data.password) {
        return {
          success: false,
          message: 'Email and password are required',
        };
      }

      const { sdk, error } = getAuthSdk();
      if (!sdk) {
        return {
          success: false,
          message: error || 'Auth SDK is not configured.',
        };
      }

      const response = await sdk.auth.signIn({
        email: data.email.trim(),
        password: data.password,
      });

      if (response?.token) {
        setTokenCookie(response.token);
      }
      if (response?.refresh_token) {
        setRefreshTokenCookie(response.refresh_token);
      }

      return {
        success: true,
        data: response,
      };
    } catch (error: unknown) {
      console.error('Sign in service error:', error);

      return {
        success: false,
        message: getErrorMessage(error, 'An unexpected error occurred. Please try again.'),
      };
    }
  },
};
