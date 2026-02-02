import { useCallback, useState } from 'react';
import { buildApiUrl, API_PATHS } from '@/lib/paths';

export function useGoogleLogin() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const startGoogleLogin = useCallback(() => {
    if (typeof window === 'undefined') return;

    setIsRedirecting(true);
    window.location.href = buildApiUrl(API_PATHS.googleAuth);
  }, []);

  return { startGoogleLogin, isRedirecting };
}
