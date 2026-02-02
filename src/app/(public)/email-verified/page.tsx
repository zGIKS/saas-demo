'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { VerificationPage } from '@/components/auth/verify/VerificationPage';
import { Spinner } from '@/components/ui/spinner';

function EmailVerifiedContent() {
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';

  return <VerificationPage isSuccess={isSuccess} />;
}

export default function EmailVerifiedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner aria-label="Loading" />
      </div>
    }>
      <EmailVerifiedContent />
    </Suspense>
  );
}