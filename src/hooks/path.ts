// API paths for hooks
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