import { signUpService, SignUpData as SignUpDataFromService, AuthResult as AuthResultFromService } from './auth-signup.service';
import { signInService, SignInData as SignInDataFromService } from './auth-signin.service';

// Re-export interfaces
export type SignUpData = SignUpDataFromService;
export type SignInData = SignInDataFromService;
export type AuthResult = AuthResultFromService;

export const authService = {
  ...signUpService,
  ...signInService,
};