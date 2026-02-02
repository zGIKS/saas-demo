import { setRefreshTokenCookie, setTokenCookie } from '@/lib/auth';
import { getAuthSdk } from './auth.service';

export interface GoogleClaimData {
  code: string;
}

export interface AuthResult {
  success: boolean;
  data?: unknown;
  message?: string;
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'An unexpected error occurred while claiming the Google code.';
};

export const googleAuthService = {
  async claimCode(payload: GoogleClaimData): Promise<AuthResult> {
    if (!payload.code) {
      return { success: false, message: 'Missing Google exchange code.' };
    }

    try {
      const { sdk, error } = getAuthSdk();
      if (!sdk) {
        return {
          success: false,
          message: error || 'Auth SDK is not configured.',
        };
      }

      const response = await sdk.auth.claimGoogle(payload.code);

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
      console.error('Google claim error:', error);
      return {
        success: false,
        message: getErrorMessage(error),
      };
    }
  },
};
