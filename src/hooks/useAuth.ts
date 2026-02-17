import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthSdk } from '@/services/iam/auth.service';
import {
  getTokenFromCookie,
  getRefreshTokenFromCookie,
  clearAuthCookies,
  setTokenCookie,
  setRefreshTokenCookie,
} from '@/lib/auth';
import { ROUTE_PATHS } from '@/lib/paths';

interface User {
  id: string;
}

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(async () => {
    try {
      const refreshToken = getRefreshTokenFromCookie();
      if (refreshToken) {
        const { sdk } = getAuthSdk();
        if (sdk) {
          await sdk.auth.logout(refreshToken);
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local logout even if backend call fails
    } finally {
      // Always clear local cookies and redirect
      clearAuthCookies();
      setUser(null);
      router.push(ROUTE_PATHS.signIn);
    }
  }, [router]);

  const refreshAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = getTokenFromCookie();
      if (token) {
        const { sdk } = getAuthSdk();
        if (!sdk) {
          await logout();
          return;
        }

        let verifyResult: { is_valid: boolean } | null = null;
        try {
          verifyResult = await sdk.auth.verifyToken(token);
        } catch (error) {
          console.warn('Token verification failed:', error);
          verifyResult = { is_valid: false };
        }

        if (verifyResult?.is_valid) {
          setUser({ id: 'authenticated' });
        } else {
          // Try refresh token
          const refreshToken = getRefreshTokenFromCookie();
          if (refreshToken) {
            try {
              const refreshResult = await sdk.auth.refreshToken(refreshToken);
              if (refreshResult?.token) {
                setTokenCookie(refreshResult.token);
              }
              if (refreshResult?.refresh_token) {
                setRefreshTokenCookie(refreshResult.refresh_token);
              }

              const newToken = refreshResult?.token || getTokenFromCookie();
              if (newToken) {
                const newVerifyResult = await sdk.auth.verifyToken(newToken);
                if (newVerifyResult?.is_valid) {
                  setUser({ id: 'authenticated' });
                } else {
                  await logout();
                }
              } else {
                await logout();
              }
            } catch (error) {
              console.error('Refresh token error:', error);
              await logout();
            }
          } else {
            await logout();
          }
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth refresh error:', error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
    refreshAuth,
  };
}
