import { useState } from 'react';
import { getAuthSdk } from '@/services/iam/auth.service';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface UseForgotPasswordReturn {
  requestReset: (email: string) => Promise<boolean>;
  status: Status;
  message: string;
  reset: () => void;
}

export function useForgotPassword(): UseForgotPasswordReturn {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const requestReset = async (email: string) => {
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
      const result = await sdk.auth.forgotPassword(email.trim());
      const message =
        (result && typeof result === 'object' && 'message' in result ? String(result.message) : undefined) ??
        'Revisa tu bandeja. Si el correo existe, recibirás un enlace.';

      setStatus('success');
      setMessage(message);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'No se pudo procesar la solicitud.';
      setStatus('error');
      setMessage(errorMessage);
      return false;
    }
  };

  const reset = () => {
    setStatus('idle');
    setMessage('');
  };

  return {
    requestReset,
    status,
    message,
    reset,
  };
}
