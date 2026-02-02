import { useEffect } from 'react';
import { API_BASE_URL } from '@/lib/paths';
import { API_PATHS } from './path';

export function useVerifyEmail(token: string | null) {
  useEffect(() => {
    if (token) {
      // Redirect to backend for verification
      window.location.href = `${API_BASE_URL}${API_PATHS.confirmRegistration}?token=${encodeURIComponent(token)}`;
    }
  }, [token]);
}