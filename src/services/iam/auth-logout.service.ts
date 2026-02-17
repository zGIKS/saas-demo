import { getAuthSdk } from './auth.service';

export interface LogoutResult {
  success: boolean;
  message?: string;
}

export const logoutService = {
  async logout(refreshToken: string): Promise<LogoutResult> {
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

      await sdk.auth.logout(refreshToken);

      return {
        success: true,
      };
    } catch (error: unknown) {
      console.error('Logout service error:', error);

      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to logout',
      };
    }
  },
};
