import { useEffect } from 'react';
import { getAuthSdk } from '@/services/iam/auth.service';
import { ROUTE_PATHS } from '@/lib/paths';

export function useVerifyEmail(token: string | null) {
  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    const verify = async () => {
      const { sdk } = getAuthSdk();
      if (!sdk) {
        if (isMounted) {
          window.location.href = `${ROUTE_PATHS.emailVerificationFailed}?message=Auth%20SDK%20is%20not%20configured.`;
        }
        return;
      }

      try {
        const url = `/api/v1/auth/confirm-registration?token=${encodeURIComponent(token)}`;
        if (isMounted) {
          window.location.href = url;
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'The verification link is invalid or has expired.';
        if (isMounted) {
          window.location.href = `${ROUTE_PATHS.emailVerificationFailed}?message=${encodeURIComponent(message)}`;
        }
      }
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, [token]);
}
