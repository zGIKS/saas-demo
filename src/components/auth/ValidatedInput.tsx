"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";

interface ValidatedInputProps {
  id: string;
  name: string;
  type: "email" | "password";
  placeholder: string;
  required?: boolean;
  label: string;
  maxLength?: number;
  disabled?: boolean;
  onValueChange?: (value: string, isValid: boolean) => void;
}

export function ValidatedInput({
  id,
  name,
  type,
  placeholder,
  required = false,
  label,
  maxLength = type === "email" ? 254 : 128,
  disabled = false,
  onValueChange,
}: ValidatedInputProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const sanitizeValue = (val: string) => val.replace(/\s/g, '').slice(0, maxLength);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8; // Minimum 8 characters for password
  };

  const validate = (val: string) => {
    let isValid = true;
    let errorMsg = "";

    if (required && !val) {
      errorMsg = `${label} is required`;
      isValid = false;
    } else if (type === "email" && val && !validateEmail(val)) {
      errorMsg = "Please enter a valid email address";
      isValid = false;
    } else if (type === "password" && val && !validatePassword(val)) {
      errorMsg = "Password must be at least 8 characters long";
      isValid = false;
    }

    return { isValid, errorMsg };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeValue(e.target.value);
    setValue(sanitized);

    const { isValid, errorMsg } = validate(sanitized);
    if (touched) {
      setError(errorMsg);
    }
    onValueChange?.(sanitized, isValid);
  };

  const handleBlur = () => {
    setTouched(true);
    const { errorMsg } = validate(value);
    setError(errorMsg);
  };

  useEffect(() => {
    // Do not set initial error, only on blur or after touched
  }, [required, value, label, onValueChange]);

  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (type === "email" && e.key === ' ') {
              e.preventDefault();
            }
          }}
          required={required}
          className={`pr-10 ${error ? "border-destructive" : ""}`}
          maxLength={maxLength}
          disabled={disabled}
        />
        {type === "password" && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}