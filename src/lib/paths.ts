// API configuration and paths
export const API_BASE_URL = (() => {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
  if (!base) {
    throw new Error('NEXT_PUBLIC_API_URL environment variable is not set');
  }
  return base.startsWith('http') ? base : `http://${base}`;
})();

export const API_PATHS = {
  // Auth endpoints
  signUp: '/api/v1/auth/sign-up',
  signIn: '/api/v1/auth/sign-in',
  confirmRegistration: '/api/v1/identity/confirm-registration',
  googleAuth: '/api/v1/auth/google',
  googleCallback: '/api/v1/auth/google/callback',
  logout: '/api/v1/auth/logout',
  refreshToken: '/api/v1/auth/refresh-token',
  verify: '/api/v1/auth/verify',

  // Identity endpoints
  forgotPassword: '/api/v1/identity/forgot-password',
  resetPassword: '/api/v1/identity/reset-password',
} as const;

// Frontend route paths
export const ROUTE_PATHS = {
  // Public routes
  home: '/',
  signIn: '/sign-in',
  signUp: '/sign-up',
  verify: '/verify',
  emailVerified: '/email-verified',
  emailVerificationFailed: '/email-verification-failed',

  // Protected routes
  dashboard: '/dashboard',
} as const;

// Protected route patterns for middleware
export const PROTECTED_ROUTE_PATTERNS = [
  ROUTE_PATHS.dashboard,
] as const;

// Helper to build full URLs
export const buildApiUrl = (path: string): string => {
  if (!API_BASE_URL) {
    throw new Error('API base URL is not configured');
  }

  const url = new URL(path, API_BASE_URL);
  return url.toString();
};
