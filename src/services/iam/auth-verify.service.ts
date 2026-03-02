import { verifyTokenWithBackend } from './auth.service';

export interface VerifyResult {
  is_valid: boolean;
  sub?: string;
  error?: string;
}

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

export const verifyService = {
  async verifyToken(token?: string): Promise<VerifyResult | null> {
    if (!token) {
      return {
        is_valid: false,
        error: 'Verification token is required',
      };
    }

    try {
      const response = await verifyTokenWithBackend(token);
      return response as VerifyResult;
    } catch (err) {
      console.error('Verify service error:', err);
      return {
        is_valid: false,
        error: getErrorMessage(err, 'Network error during verification'),
      };
    }
  },
};
