"use client";

import { Card, CardContent } from "@/components/ui/card";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { OrDivider } from "@/components/auth/OrDivider";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpPrompt } from "@/components/auth/SignUpPrompt";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { Background } from "@/components/ui/background";

export default function SignIn() {
  return (
    <Background>
      <div className="w-full max-w-sm">
        <AuthHeader title="Welcome back" subtitle="Sign in to your account" />
        <Card>
          <CardContent className="space-y-6">
            <GoogleButton />
            <OrDivider />
            <SignInForm />
            <SignUpPrompt />
          </CardContent>
        </Card>
      </div>
    </Background>
  );
}