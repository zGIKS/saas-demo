'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface VerificationPageProps {
  isSuccess: boolean;
  message?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonAction?: () => void;
}

export function VerificationPage({
  isSuccess,
  message,
  title,
  description,
  buttonText,
  buttonAction,
}: VerificationPageProps) {
  const router = useRouter();

  const defaultTitle = isSuccess ? 'Excellent!' : 'Oops, something went wrong';
  const defaultDescription = isSuccess
    ? 'Your email has been verified successfully.'
    : (message || 'The verification link is invalid or has expired.');
  const defaultButtonText = isSuccess ? 'Go to sign in' : 'Go back home';
  const defaultButtonAction = () => router.push(isSuccess ? '/sign-in' : '/');

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>{title || defaultTitle}</CardTitle>
          <CardDescription>
            {description || defaultDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button
            onClick={buttonAction || defaultButtonAction}
            className="w-full"
          >
            {buttonText || defaultButtonText}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}