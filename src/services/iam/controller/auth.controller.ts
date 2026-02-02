import { NextRequest, NextResponse } from 'next/server';
import { authService, getAuthSdk, SignUpData, SignInData } from '../auth.service';
import { ResponseHandler, ValidationHelper } from './auth.response';

export class AuthController {
  static async signUp(request: NextRequest) {
    try {
      const body = await request.json();
      const { email, password }: SignUpData = body;

      // Validation
      if (!email || !password) {
        return ResponseHandler.validationError('Email and password are required');
      }

      if (!ValidationHelper.isValidEmail(email)) {
        return ResponseHandler.validationError('Invalid email format');
      }

      if (!ValidationHelper.isValidPassword(password)) {
        return ResponseHandler.validationError('Password must be at least 8 characters long');
      }

      // Sanitize inputs
      const sanitizedData: SignUpData = {
        email: ValidationHelper.sanitizeEmail(email),
        password: ValidationHelper.sanitizePassword(password),
      };

      // Call service
      const result = await authService.signUp(sanitizedData);

      if (result.success) {
        return ResponseHandler.success({
          message: 'Identity registered successfully',
        }, 201);
      } else {
        return ResponseHandler.error(result.message || 'Failed to create account', 400);
      }
    } catch (error) {
      console.error('Sign-up controller error:', error);
      return ResponseHandler.serverError();
    }
  }

  static async signIn(request: NextRequest) {
    try {
      const body = await request.json();
      const { email, password }: SignInData = body;

      // Validation
      if (!email || !password) {
        return ResponseHandler.validationError('Email and password are required');
      }

      // Sanitize inputs
      const sanitizedData: SignInData = {
        email: ValidationHelper.sanitizeEmail(email),
        password: ValidationHelper.sanitizePassword(password),
      };

      // Call service
      const result = await authService.signIn(sanitizedData);

      if (result.success) {
        return ResponseHandler.success({
          message: 'Signed in successfully',
          data: result.data,
        });
      } else {
        return ResponseHandler.error(result.message || 'Invalid credentials', 401);
      }
    } catch (error) {
      console.error('Sign-in controller error:', error);
      return ResponseHandler.serverError();
    }
  }

  static async confirmRegistration(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const token = searchParams.get('token');

      // Validation
      if (!token || !token.trim()) {
        return ResponseHandler.validationError('Verification token is required');
      }

      const { sdk, error } = getAuthSdk();
      if (!sdk) {
        return ResponseHandler.error(error || 'Auth SDK is not configured.', 500);
      }

      const url = sdk.auth.getConfirmRegistrationUrl(token.trim());
      return NextResponse.redirect(url);
    } catch (error) {
      console.error('Confirm registration controller error:', error);
      return ResponseHandler.error(
        error instanceof Error ? error.message : 'Email verification failed',
        400
      );
    }
  }
}
