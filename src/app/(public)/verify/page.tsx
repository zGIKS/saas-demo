'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useVerifyEmail } from '@/hooks/useVerifyEmail';
import { Spinner } from '@/components/ui/spinner';

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useVerifyEmail(token);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Redirecting to verification...</p>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner aria-label="Loading" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
