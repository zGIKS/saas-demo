'use client';

import { Background } from '@/components/ui/background';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { Card, CardContent } from '@/components/ui/card';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <Background>
      <div className="w-full max-w-sm space-y-4">
        <AuthHeader
          title="Recover Password"
          subtitle="We will send you a link if the email is registered."
        />
        <Card>
          <CardContent className="space-y-4">
            <ForgotPasswordForm />
          </CardContent>
        </Card>
      </div>
    </Background>
  );
}
