import { NextRequest } from 'next/server';
import { authService, SignUpData, SignInData } from '../auth.service';
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

      // For demo purposes, validate token format (UUID v4)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(token)) {
        return ResponseHandler.error('Invalid verification token format', 400);
      }

      // Mock verification logic: in a real app, verify against database
      // For demo, assume token is valid if it matches the format
      console.log('Email verification successful for token:', token);

      return ResponseHandler.success({
        message: 'Email verified successfully',
      });
    } catch (error) {
      console.error('Confirm registration controller error:', error);
      return ResponseHandler.serverError();
    }
  }
}