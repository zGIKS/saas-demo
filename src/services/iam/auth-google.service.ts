import { AxiosError } from 'axios';
import axiosConfig from '../axios.config';
import { setRefreshTokenCookie, setTokenCookie } from '@/lib/auth';

export interface GoogleClaimData {
  code: string;
}

export interface AuthResult {
  success: boolean;
  data?: unknown;
  message?: string;
}

const isApiConfigured = (): boolean => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  return !!(apiUrl && apiUrl.trim());
};

const getErrorMessage = (error: unknown): string => {
  if (!axiosConfig || !axiosConfig.defaults) {
    return 'API client is not configured properly.';
  }

  const isAxiosError = (err: unknown): err is AxiosError => {
    return (err as AxiosError).isAxiosError === true;
  };

  if (isAxiosError(error) && error.response) {
    const data = error.response.data as { message?: string } | undefined;
    return data?.message || 'Unable to complete Google login.';
  }

  if (isAxiosError(error) && error.request) {
    return 'Unable to reach the authentication server. Please check your connection.';
  }

  return 'An unexpected error occurred while claiming the Google code.';
};

export const googleAuthService = {
  async claimCode(payload: GoogleClaimData): Promise<AuthResult> {
    if (!payload.code) {
      return { success: false, message: 'Missing Google exchange code.' };
    }

    if (!isApiConfigured()) {
      return {
        success: false,
        message: 'API configuration missing. Please set NEXT_PUBLIC_API_URL before signing in.',
      };
    }

    try {
      const response = await axiosConfig.post('/api/v1/auth/google/claim', payload);

      if (response.data?.token) {
        setTokenCookie(response.data.token);
      }
      if (response.data?.refresh_token) {
        setRefreshTokenCookie(response.data.refresh_token);
      }

      return {
        success: true,
        data: response.data,
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
