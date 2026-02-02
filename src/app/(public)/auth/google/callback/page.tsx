"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { useGoogleAuthClaim } from "@/hooks/useGoogleAuthClaim";
import { ROUTE_PATHS } from "@/lib/paths";

function GoogleCallbackContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const router = useRouter();
  const { claimCode } = useGoogleAuthClaim();

  useEffect(() => {
    if (!code) {
      router.replace(`${ROUTE_PATHS.signIn}?error=google_missing_code`);
      return;
    }

    let isCancelled = false;

    const exchangeCode = async () => {
      const result = await claimCode(code);
      if (isCancelled) return;

      if (result.success) {
        router.replace(ROUTE_PATHS.dashboard);
      } else {
        router.replace(`${ROUTE_PATHS.signIn}?error=google_claim_failed`);
      }
    };

    exchangeCode();

    return () => {
      isCancelled = true;
    };
  }, [code, claimCode, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-sm text-muted-foreground">
      <Spinner className="h-6 w-6 text-primary" aria-label="redirect" />
    </div>
  );
}

function GoogleCallbackFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-sm text-muted-foreground">
      <Spinner className="h-6 w-6 text-primary" aria-label="Loading..." />
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<GoogleCallbackFallback />}>
      <GoogleCallbackContent />
    </Suspense>
  );
}
