import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Eye, EyeOff, CheckCircle, AlertTriangle } from "lucide-react";
import { ValidatedInput } from "./ValidatedInput";
import { useSignUp } from "@/hooks/useSignUp";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export function SignUpForm() {
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { signUp, isLoading } = useSignUp();

  const handleEmailChange = (value: string, isValid: boolean) => {
    setEmail(value);
    setEmailError(''); // Clear server error
    updateFormValidity(value, password, confirmPassword, isValid && !!password && !!confirmPassword && confirmPassword === password && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
  };

  const handlePasswordChange = (value: string, isValid: boolean) => {
    setPassword(value);
    setPasswordError(''); // Clear server error
    if (confirmPassword && value !== confirmPassword) {
      setConfirmError("Passwords do not match");
    } else if (confirmPassword) {
      setConfirmError("");
    } else {
      setConfirmError("");
    }
    updateFormValidity(email, value, confirmPassword, isValid && !!email && !!confirmPassword && confirmPassword === value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value && password !== value) {
      setConfirmError("Passwords do not match");
    } else if (value) {
      setConfirmError("");
    } else {
      setConfirmError("");
    }
    updateFormValidity(email, password, value, !!email && !!password && !!value && value === password && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && password.length >= 8);
  };

  const updateFormValidity = (emailVal: string, passVal: string, confVal: string, valid: boolean) => {
    setIsFormValid(valid);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setConfirmError('');
    setEmailError('');
    setPasswordError('');

    const result = await signUp({ email, password });

    if (result.success) {
      setShowNotification(true);
      // Reset form
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      // Hide notification after 5 seconds
      setTimeout(() => setShowNotification(false), 5000);
    } else {
      // Handle specific errors if needed
      setShowErrorNotification(true);
      setErrorMessage(result.error || 'An error occurred');
      // Hide error notification after 5 seconds
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
        label="Enter your email"
        required
        onValueChange={handleEmailChange}
      />
      {emailError && <p className="text-sm text-destructive mt-1">{emailError}</p>}
      <ValidatedInput
        id="password"
        name="password"
        type="password"
        placeholder="Enter your password"
        label="Password"
        required
        onValueChange={handlePasswordChange}
      />
      {passwordError && <p className="text-sm text-destructive mt-1">{passwordError}</p>}
      <div className="space-y-1">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            onKeyDown={(e) => {
              if (e.key === ' ') e.preventDefault();
            }}
            required
            className={`pr-10 ${confirmError ? "border-destructive" : ""}`}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {confirmError && <p className="text-sm text-destructive">{confirmError}</p>}
      </div>
      <Button type="submit" className="w-full mt-4" disabled={!isFormValid || isLoading}>
        {isLoading ? (
          <Spinner aria-label="Creating account" />
        ) : (
          'Sign up'
        )}
      </Button>
      </form>
      {showErrorNotification && (
        <Alert
          className="fixed top-4 right-4 z-50 w-full max-w-xs px-3 py-1 text-xs shadow-lg bg-destructive/10 border-destructive/20 dark:bg-destructive/20 dark:border-destructive/30 sm:max-w-sm sm:px-2.5 sm:py-1.5 sm:text-sm sm:right-4 md:right-6 lg:right-8 xl:right-10"
        >
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
      {showNotification && (
        <Alert
          className="fixed top-4 right-4 z-50 w-full max-w-xs px-3 py-1 text-xs shadow-lg bg-success/10 border-success/20 dark:bg-success/20 dark:border-success/30 sm:max-w-sm sm:px-2.5 sm:py-1.5 sm:text-sm sm:right-4 md:right-6 lg:right-8 xl:right-10"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success" />
            <div className="flex flex-col gap-0 leading-tight">
              <AlertTitle className="text-success text-xs sm:text-sm">
                Success
              </AlertTitle>
              <AlertDescription className="text-success/80 text-xs sm:text-sm leading-tight">
                Account created successfully! Please check your email to verify your account.
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}
    </>
  );
}
