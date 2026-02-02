import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Eye, EyeOff, AlertTriangle } from "lucide-react";
import { ValidatedInput } from "./ValidatedInput";
import { useSignIn } from "@/hooks/useSignIn";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { signIn, isLoading } = useSignIn();

  const handleEmailChange = (value: string, isValid: boolean) => {
    setEmail(value);
    updateFormValidity(value, password, isValid);
  };

  const updateFormValidity = (emailVal: string, passVal: string, valid: boolean) => {
    setIsFormValid(valid && !!emailVal && !!passVal && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal) && passVal.length >= 8);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const result = await signIn({ email, password });

    if (result.success) {
      // Redirect handled by useSignIn hook
    } else {
      setShowErrorNotification(true);
      setErrorMessage(result.error || 'Sign in failed');
      setTimeout(() => setShowErrorNotification(false), 5000);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-3">
        <ValidatedInput
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          label="Email"
          required
          onValueChange={handleEmailChange}
        />

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                const value = e.target.value;
                setPassword(value);
                updateFormValidity(email, value, !!email && !!value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && value.length >= 8);
              }}
              required
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <Button type="submit" className="w-full mt-4" disabled={!isFormValid || isLoading}>
          {isLoading ? (
            <Spinner aria-label="Signing in" />
          ) : (
            'Sign in'
          )}
        </Button>
        <div className="text-right">
          <Link href="/forgot-password" className="text-sm text-primary hover:underline">
            Forgot your password?
          </Link>
        </div>
      </form>

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
    </>
  );
}
