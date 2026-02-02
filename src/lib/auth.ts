export const TOKEN_COOKIE_NAME = 'auth_token';
export const REFRESH_TOKEN_COOKIE_NAME = 'refresh_token';

// Client-side functions
export const getTokenFromCookie = (): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${TOKEN_COOKIE_NAME}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

export const setTokenCookie = (token: string, maxAge: number = 3600) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${TOKEN_COOKIE_NAME}=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
};

export const getRefreshTokenFromCookie = (): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${REFRESH_TOKEN_COOKIE_NAME}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

export const setRefreshTokenCookie = (refreshToken: string, maxAge: number = 86400 * 7) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${REFRESH_TOKEN_COOKIE_NAME}=${refreshToken}; path=/; max-age=${maxAge}; SameSite=Lax`;
};

export const clearAuthCookies = () => {
  if (typeof document === 'undefined') return;
  document.cookie = `${TOKEN_COOKIE_NAME}=; path=/; max-age=0`;
  document.cookie = `${REFRESH_TOKEN_COOKIE_NAME}=; path=/; max-age=0`;
};

// Server-side functions (for middleware)
export const getTokenFromServerCookie = (request: Request): string | null => {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;
  const value = `; ${cookieHeader}`;
  const parts = value.split(`; ${TOKEN_COOKIE_NAME}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

export const getRefreshTokenFromServerCookie = (request: Request): string | null => {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;
  const value = `; ${cookieHeader}`;
  const parts = value.split(`; ${REFRESH_TOKEN_COOKIE_NAME}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};