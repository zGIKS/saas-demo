import { getAuthSdk } from './auth.service';

export interface SignUpData {
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

export const signUpService = {
  async signUp(data: SignUpData): Promise<AuthResult> {
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

      const response = await sdk.auth.signUp({
        email: data.email.trim(),
        password: data.password,
      });

      return {
        success: true,
        data: response,
      };
    } catch (error: unknown) {
      console.error('Sign up service error:', error);

      return {
        success: false,
        message: getErrorMessage(error, 'An unexpected error occurred. Please try again.'),
      };
    }
  },
};
