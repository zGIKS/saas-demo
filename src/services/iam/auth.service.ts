import { AuthSDK } from 'auth-sdk';
import axiosConfig from '../axios.config';

export interface SignUpData {
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  data?: unknown;
  message?: string;
}

let sdkInstance: AuthSDK | null = null;

const resolveSdkConfig = (): { apiKey: string; baseUrl: string } | { error: string } => {
  const apiKey =
    process.env.NEXT_PUBLIC_TENANT_KEY?.trim() ?? process.env.NEXT_PUBLIC_ANON_KEY?.trim();
  if (!apiKey) {
    return {
      error:
        'NEXT_PUBLIC_TENANT_KEY is not set. Please configure your tenant anon key (or NEXT_PUBLIC_ANON_KEY).',
    };
  }

  const baseUrlRaw =
    process.env.NEXT_PUBLIC_API_BASE?.trim() ?? process.env.NEXT_PUBLIC_API_URL?.trim();
  const baseUrl = baseUrlRaw ? baseUrlRaw.replace(/\/$/, '') : undefined;
  if (!baseUrl) {
    return {
      error: 'NEXT_PUBLIC_API_BASE is not set. Please configure the backend URL (or NEXT_PUBLIC_API_URL).',
    };
  }

  return { apiKey, baseUrl };
};

export const getAuthSdk = (): { sdk: AuthSDK | null; error?: string } => {
  if (sdkInstance) {
    return { sdk: sdkInstance };
  }

  const config = resolveSdkConfig();
  if ('error' in config) {
    return { sdk: null, error: config.error };
  }

  sdkInstance = new AuthSDK({
    apiKey: config.apiKey,
    baseUrl: config.baseUrl,
    credentialHeader: 'authorization',
  });

  return { sdk: sdkInstance };
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

export const authService = {
  async signUp(data: SignUpData): Promise<AuthResult> {
    if (!data.email || !data.password) {
      return {
        success: false,
        message: 'Email and password are required',
      };
    }

    const config = resolveSdkConfig();
    if ('error' in config) {
      return { success: false, message: config.error };
    }

    try {
      const response = await axiosConfig.post('/api/v1/identity/sign-up', {
        email: data.email.trim(),
        password: data.password,
      }, {
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
        },
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (err) {
      console.error('Sign up service error:', err);
      return {
        success: false,
        message: getErrorMessage(err, 'Failed to create account'),
      };
    }
  },

  async signIn(data: SignInData): Promise<AuthResult> {
    if (!data.email || !data.password) {
      return {
        success: false,
        message: 'Email and password are required',
      };
    }

    const { sdk, error } = getAuthSdk();
    if (!sdk) {
      return { success: false, message: error || 'Auth SDK is not configured.' };
    }

    try {
      const result = await sdk.auth.signIn({
        email: data.email.trim(),
        password: data.password,
      });

      return {
        success: true,
        data: result,
      };
    } catch (err) {
      console.error('Sign in service error:', err);
      return {
        success: false,
        message: getErrorMessage(err, 'Invalid credentials'),
      };
    }
  },
};
