import { NextResponse } from 'next/server';

export class ResponseHandler {
  static success(data: unknown, status = 200) {
    return NextResponse.json(data, { status });
  }

  static error(message: string, status = 400) {
    return NextResponse.json({ error: message }, { status });
  }

  static validationError(message: string) {
    return this.error(message, 400);
  }

  static unauthorized(message = 'Unauthorized') {
    return this.error(message, 401);
  }

  static forbidden(message = 'Forbidden') {
    return this.error(message, 403);
  }

  static notFound(message = 'Not found') {
    return this.error(message, 404);
  }

  static serverError(message = 'Internal server error') {
    return this.error(message, 500);
  }
}

export class ValidationHelper {
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPassword(password: string): boolean {
    return password.length >= 8;
  }

  static sanitizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  static sanitizePassword(password: string): string {
    return password.trim();
  }
}