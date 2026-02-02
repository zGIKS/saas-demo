import { AxiosError } from 'axios';
import axiosConfig from '../axios.config';

export interface SignUpData {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  data?: unknown;
  message?: string;
}

interface ApiErrorData {
  message?: string;
}

// Helper to check if API is configured
const isApiConfigured = (): boolean => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  return !!(apiUrl && apiUrl.trim());
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

      // Check if API is configured
      if (!isApiConfigured()) {
        return {
          success: false,
          message: 'API configuration missing. Please set NEXT_PUBLIC_API_URL in your environment.',
        };
      }

      // Call external API for sign up
      const response = await axiosConfig.post('/api/v1/auth/sign-up', data);

      // Validate response structure
      if (!response.data || typeof response.data !== 'object') {
        console.error('Invalid API response structure');
        return {
          success: false,
          message: 'Invalid response from server',
        };
      }

      console.log('Sign up successful for:', data.email);

      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      console.error('Sign up service error:', error);

      // Type guard for AxiosError
      const isAxiosError = (err: unknown): err is AxiosError => {
        return (err as AxiosError).response !== undefined;
      };

      // Handle different error types
      if (isAxiosError(error) && error.response) {
        // API responded with error
        const { status, data } = error.response;
        const errorData = data as ApiErrorData;
        if (status === 400) {
          return {
            success: false,
            message: errorData?.message || 'Invalid request data',
          };
        } else if (status === 404) {
          return {
            success: false,
            message: errorData?.message || 'Endpoint not found. Check API configuration.',
          };
        } else if (status === 409) {
          return {
            success: false,
            message: errorData?.message || 'User already exists',
          };
        } else if (status >= 500) {
          return {
            success: false,
            message: 'Server error. Please try again later.',
          };
        } else {
          return {
            success: false,
            message: errorData?.message || `Request failed with status ${status}`,
          };
        }
      } else if (isAxiosError(error) && error.request) {
        // Network error
        return {
          success: false,
          message: 'Network error. Check your connection and try again.',
        };
      } else {
        // Other errors
        return {
          success: false,
          message: 'An unexpected error occurred. Please try again.',
        };
      }
    }
  },
};