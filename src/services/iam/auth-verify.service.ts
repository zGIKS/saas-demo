import { AxiosError } from 'axios';
import axiosConfig from '../axios.config';

export interface VerifyResult {
  is_valid: boolean;
  sub?: string;
  error?: string;
}

interface ApiErrorData {
  message?: string;
}

export const verifyService = {
  async verifyToken(token?: string): Promise<VerifyResult | null> {
    try {
      // For verify endpoint, we need to pass token as query param, not use Authorization header
      const config = token ? {
        params: { token },
        headers: { 'Authorization': undefined } // Remove Authorization header for this request
      } : {};

      const response = await axiosConfig.get('/api/v1/auth/verify', config);

      return response.data as VerifyResult;
    } catch (error: unknown) {
      console.error('Verify service error:', error);

      const isAxiosError = (err: unknown): err is AxiosError => {
        return (err as AxiosError).response !== undefined;
      };

      if (isAxiosError(error) && error.response) {
        const { data } = error.response;
        const errorData = data as ApiErrorData;
        return {
          is_valid: false,
          error: errorData?.message || 'Verification failed',
        };
      }

      return {
        is_valid: false,
        error: 'Network error during verification',
      };
    }
  },
};