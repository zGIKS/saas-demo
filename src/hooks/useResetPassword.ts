import { useState } from 'react';
import { getAuthSdk } from '@/services/iam/auth.service';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface UseResetPasswordReturn {
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  status: Status;
  message: string;
  clear: () => void;
}

export function useResetPassword(): UseResetPasswordReturn {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const resetPassword = async (token: string, newPassword: string) => {
    setStatus('loading');
    setMessage('');

    const { sdk, error } = getAuthSdk();
    if (!sdk) {
      const errorMessage = error || 'Auth SDK is not configured.';
      setStatus('error');
      setMessage(errorMessage);
      return false;
    }

    try {
      await sdk.auth.resetPassword(token, newPassword);

      setStatus('success');
      setMessage('Contraseña actualizada correctamente.');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'No se pudo restablecer la contraseña.';
      setStatus('error');
      setMessage(errorMessage);
      return false;
    }
  };

  const clear = () => {
    setStatus('idle');
    setMessage('');
  };

  return {
    resetPassword,
    status,
    message,
    clear,
  };
}
