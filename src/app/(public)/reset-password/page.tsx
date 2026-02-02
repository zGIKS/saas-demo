'use client';

import { Suspense, useEffect, useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Background } from '@/components/ui/background';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ValidatedInput } from '@/components/auth/ValidatedInput';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { ROUTE_PATHS } from '@/lib/paths';
import { useResetPassword } from '@/hooks/useResetPassword';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { resetPassword, status, message } = useResetPassword();

  const isLoading = status === 'loading';
  const isSuccess = status === 'success';
  const hasToken = Boolean(token);

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        router.push(ROUTE_PATHS.signIn);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, router]);

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowErrorNotification(false);

    if (!token) {
      setErrorMessage('The token is invalid or has expired.');
      setShowErrorNotification(true);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setShowErrorNotification(true);
      return;
    }

    if (!passwordValid) {
      setErrorMessage('Password must be at least 8 characters long.');
      setShowErrorNotification(true);
      return;
    }

    await resetPassword(token, password);
  };

  return (
    <Background>
      <div className="w-full max-w-sm space-y-4">
        <AuthHeader
          title="New Password"
          subtitle="You can close this window after saving and sign in again."
        />
        <Card>
          <CardContent className="space-y-4">
            {!hasToken && (
              <Alert variant="destructive">
                <AlertTitle>Missing Token</AlertTitle>
                <AlertDescription>
                  The link you are using has no token or has expired. Request another from the recovery form.
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <ValidatedInput
                id="new-password"
                name="password"
                type="password"
                placeholder="Enter your password"
                label="New Password"
                required
                disabled={!hasToken || isSuccess}
                onValueChange={(value, isValid) => {
                  setPassword(value);
                  setPasswordValid(isValid);
                }}
              />

              <ValidatedInput
                id="confirm-password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                label="Confirm Password"
                required
                disabled={!hasToken || isSuccess}
                onValueChange={(value) => {
                  setConfirmPassword(value);
                }}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={!hasToken || isLoading || isSuccess || !passwordValid}
              >
                {isLoading ? <Spinner aria-label="Saving password" /> : 'Save new password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {showErrorNotification && (
        <Alert className="fixed top-4 right-4 z-50 w-full max-w-xs px-3 py-1 text-xs shadow-lg bg-destructive/10 border-destructive/20 dark:bg-destructive/20 dark:border-destructive/30 sm:max-w-sm sm:px-2.5 sm:py-1.5 sm:text-sm sm:right-4 md:right-6 lg:right-8 xl:right-10">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <div className="flex flex-col gap-0 leading-tight">
              <AlertTitle className="text-destructive text-xs sm:text-sm">
                Error
              </AlertTitle>
              <AlertDescription className="text-destructive/80 text-xs sm:text-sm leading-tight">
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
    </Background>
  );
}

function ResetPasswordFallback() {
  return (
    <Background>
      <div className="w-full max-w-sm space-y-4">
        <AuthHeader
          title="New Password"
          subtitle="You can close this window after saving and sign in again."
        />
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <Spinner aria-label="Loading..." />
          </CardContent>
        </Card>
      </div>
    </Background>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
