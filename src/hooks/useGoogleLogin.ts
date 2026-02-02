import { useCallback, useState } from 'react';
import { getAuthSdk } from '@/services/iam/auth.service';

export function useGoogleLogin() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const startGoogleLogin = useCallback(() => {
    if (typeof window === 'undefined') return;

    const { sdk } = getAuthSdk();
    if (!sdk) {
      console.error('Auth SDK is not configured.');
      return;
    }

    setIsRedirecting(true);
    const url = sdk.auth.getGoogleAuthUrl();
    window.location.href = url;
  }, []);

  return { startGoogleLogin, isRedirecting };
}
