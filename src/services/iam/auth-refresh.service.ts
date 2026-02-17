import { setTokenCookie, setRefreshTokenCookie } from '@/lib/auth';
import { getAuthSdk } from './auth.service';

export interface RefreshResult {
  success: boolean;
  token?: string;
  refresh_token?: string;
  message?: string;
}

export const refreshTokenService = {
  async refreshToken(refreshToken: string): Promise<RefreshResult> {
    try {
      if (!refreshToken) {
        return { success: false, message: 'Refresh token is required.' };
      }

      const { sdk, error } = getAuthSdk();
      if (!sdk) {
        return {
          success: false,
          message: error || 'Auth SDK is not configured.',
        };
      }

      const response = await sdk.auth.refreshToken(refreshToken);

      // Update cookies with new tokens
      if (response?.token) {
        setTokenCookie(response.token);
      }
      if (response?.refresh_token) {
        setRefreshTokenCookie(response.refresh_token);
      }

      return {
        success: true,
        token: response?.token,
        refresh_token: response?.refresh_token,
      };
    } catch (error: unknown) {
      console.error('Refresh token service error:', error);

      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to refresh token',
      };
    }
  },
};
