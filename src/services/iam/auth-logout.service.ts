import { AxiosError } from 'axios';
import axiosConfig from '../axios.config';

export interface LogoutResult {
  success: boolean;
  message?: string;
}

export const logoutService = {
  async logout(refreshToken: string): Promise<LogoutResult> {
    try {
      await axiosConfig.post('/api/v1/auth/logout', {
        refresh_token: refreshToken,
      });

      return {
        success: true,
      };
    } catch (error: unknown) {
      console.error('Logout service error:', error);

      const isAxiosError = (err: unknown): err is AxiosError => {
        return (err as AxiosError).response !== undefined;
      };

      if (isAxiosError(error) && error.response) {
        const { status } = error.response;
        if (status === 401) {
          return {
            success: false,
            message: 'Invalid refresh token',
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
        message: 'Failed to logout',
      };
    }
  },
};