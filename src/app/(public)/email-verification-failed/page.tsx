'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { VerificationPage } from '@/components/auth/verify/VerificationPage';
import { Spinner } from '@/components/ui/spinner';

function EmailVerificationFailedContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message') || 'The verification link is invalid or has expired.';

  return <VerificationPage isSuccess={false} message={message} />;
}

export default function EmailVerificationFailedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner aria-label="Loading" />
      </div>
    }>
      <EmailVerificationFailedContent />
    </Suspense>
  );
}