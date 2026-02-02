import { useState } from 'react';
import { identityService } from '@/services/iam/identity.service';

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
    const result = await identityService.requestPasswordReset(email);

    if (result.success) {
      setStatus('success');
      setMessage(result.message ?? 'Revisa tu bandeja. Si el correo existe, recibirás un enlace.');
      return true;
    }

    setStatus('error');
    setMessage(result.message ?? 'No se pudo procesar la solicitud.');
    return false;
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
