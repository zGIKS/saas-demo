import { AxiosError } from 'axios';
import axiosConfig from '../axios.config';
import { setTokenCookie, setRefreshTokenCookie } from '@/lib/auth';

export interface RefreshResult {
  success: boolean;
  token?: string;
  refresh_token?: string;
  message?: string;
}

export const refreshTokenService = {
  async refreshToken(refreshToken: string): Promise<RefreshResult> {
    try {
      const response = await axiosConfig.post('/api/v1/auth/refresh-token', {
        refresh_token: refreshToken,
      });

      // Update cookies with new tokens
      if (response.data.token) {
        setTokenCookie(response.data.token);
      }
      if (response.data.refresh_token) {
        setRefreshTokenCookie(response.data.refresh_token);
      }

      return {
        success: true,
        token: response.data.token,
        refresh_token: response.data.refresh_token,
      };
    } catch (error: unknown) {
      console.error('Refresh token service error:', error);

      const isAxiosError = (err: unknown): err is AxiosError => {
        return (err as AxiosError).response !== undefined;
      };

      if (isAxiosError(error) && error.response) {
        const { status } = error.response;
        if (status === 401) {
          return {
            success: false,
            message: 'Invalid or expired refresh token',
          };
        } else if (status === 400) {
          return {
            success: false,
            message: 'Bad request',
          };
        }
      }

      return {
        success: false,
        message: 'Failed to refresh token',
      };
    }
  },
};