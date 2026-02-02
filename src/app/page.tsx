"use client";

import { Card, CardContent } from "@/components/ui/card";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { OrDivider } from "@/components/auth/OrDivider";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { LoginPrompt } from "@/components/auth/LoginPrompt";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { Background } from "@/components/ui/background";

export default function Home() {
  return (
    <Background>
      <div className="w-full max-w-sm">
        <AuthHeader title="Welcome" subtitle="Create your account to get started" />
        <Card>
          <CardContent className="space-y-6">
            <GoogleButton />
            <OrDivider />
            <SignUpForm />
            <LoginPrompt />
          </CardContent>
        </Card>
      </div>
    </Background>
  );
}
