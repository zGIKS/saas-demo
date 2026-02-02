'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { ValidatedInput } from '@/components/auth/ValidatedInput';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useForgotPassword } from '@/hooks/useForgotPassword';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { requestReset, status, message, reset } = useForgotPassword();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowErrorNotification(false);
    setShowSuccessNotification(false);
    if (!emailValid || status === 'loading') return;
    await requestReset(email);
  };

  const isLoading = status === 'loading';

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (status === 'error' && message) {
      setErrorMessage(message);
      setShowErrorNotification(true);
      const timer = setTimeout(() => setShowErrorNotification(false), 5000);
      return () => clearTimeout(timer);
    } else if (status === 'success' && message) {
      setSuccessMessage(message);
      setShowSuccessNotification(true);
      const timer = setTimeout(() => setShowSuccessNotification(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [status, message]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ValidatedInput
          id="forgot-email"
          name="email"
          type="email"
          placeholder="Enter your email"
          label="Email"
          required
          onValueChange={(value, isValid) => {
            setEmail(value);
            setEmailValid(isValid);
            if (status !== 'idle') {
              reset();
            }
          }}
        />
        <Button type="submit" className="w-full" disabled={!emailValid || isLoading}>
          {isLoading ? <Spinner aria-label="Sending recovery link" /> : 'Send recovery link'}
        </Button>
      </form>

      {showErrorNotification && (
        <Alert className="fixed top-4 right-4 z-50 w-full max-w-xs px-3 py-1 text-xs shadow-lg bg-destructive/10 border-destructive/20 dark:bg-destructive/20 dark:border-destructive/30 sm:max-w-sm sm:px-2.5 sm:py-1.5 sm:text-sm sm:right-4 md:right-6 lg:right-8 xl:right-10">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <div className="flex flex-col gap-0 leading-tight">
              <AlertTitle className="text-xs sm:text-sm">
                Error
              </AlertTitle>
              <AlertDescription className="text-xs sm:text-sm leading-tight">
                {errorMessage}
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}

      {showSuccessNotification && (
        <Alert variant="default" className="fixed top-4 right-4 z-50 w-full max-w-xs px-3 py-1 text-xs shadow-lg sm:max-w-sm sm:px-2.5 sm:py-1.5 sm:text-sm sm:right-4 md:right-6 lg:right-8 xl:right-10">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <div className="flex flex-col gap-0 leading-tight">
              <AlertTitle className="text-xs sm:text-sm">
                Success
              </AlertTitle>
              <AlertDescription className="text-xs sm:text-sm leading-tight">
                {successMessage}
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}
    </>
  );
}