import { AuthSDK } from 'asphanyx-sdk';

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

export interface VerifyTokenResult {
  is_valid: boolean;
  sub?: string;
  tid?: string;
  role?: string;
  error?: string;
}

let sdkInstance: AuthSDK | null = null;

const resolveSdkConfig = (): { tenantAnonKey: string; baseUrl: string } | { error: string } => {
  const tenantAnonKey = process.env.NEXT_PUBLIC_TENANT_KEY?.trim();
  if (!tenantAnonKey) {
    return {
      error: 'NEXT_PUBLIC_TENANT_KEY is not set. Please configure your tenant anon key.',
    };
  }

  const baseUrlRaw = process.env.NEXT_PUBLIC_API_BASE?.trim();
  const baseUrl = baseUrlRaw ? baseUrlRaw.replace(/\/$/, '') : undefined;
  if (!baseUrl) {
    return {
      error: 'NEXT_PUBLIC_API_BASE is not set. Please configure the backend URL.',
    };
  }

  return { tenantAnonKey, baseUrl };
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
    tenantAnonKey: config.tenantAnonKey,
    baseUrl: config.baseUrl,
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

    const { sdk, error } = getAuthSdk();
    if (!sdk) {
      return { success: false, message: error || 'Auth SDK is not configured.' };
    }

    try {
      const response = await sdk.auth.signUp({
        email: data.email.trim(),
        password: data.password,
      });

      return {
        success: true,
        data: response,
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

export const verifyTokenWithBackend = async (token: string): Promise<VerifyTokenResult> => {
  const config = resolveSdkConfig();
  if ('error' in config) {
    throw new Error(config.error);
  }

  const response = await fetch(`${config.baseUrl}/api/v1/auth/verify`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Token verification failed with status ${response.status}`);
  }

  const payload = (await response.json()) as VerifyTokenResult;
  return payload;
};
