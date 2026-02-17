import { useCallback, useState } from 'react';

export function useGoogleLogin() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const startGoogleLogin = useCallback(() => {
    if (typeof window === 'undefined') return;

    setIsRedirecting(true);
    window.location.href = '/api/v1/auth/sign-in?provider=google';
  }, []);

  return { startGoogleLogin, isRedirecting };
}
