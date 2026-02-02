import { useState } from 'react';
import { identityService } from '@/services/iam/identity.service';

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

    const result = await identityService.resetPassword(token, newPassword);

    if (result.success) {
      setStatus('success');
      setMessage(result.message ?? 'Contraseña actualizada correctamente.');
      return true;
    }

    setStatus('error');
    setMessage(result.message ?? 'No se pudo restablecer la contraseña.');
    return false;
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
