import { getAuthSdk } from './auth.service';

interface ApiErrorPayload {
  message?: string;
}

interface IdentityResult {
  success: boolean;
  message?: string;
}

const apiMessage = (data: unknown): string | undefined => {
  if (!data || typeof data !== 'object') return undefined;
  const message = (data as ApiErrorPayload).message;
  return typeof message === 'string' ? message : undefined;
};

const normalizeError = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

export const identityService = {
  async requestPasswordReset(email: string): Promise<IdentityResult> {
    if (!email || !email.trim()) {
      return {
        success: false,
        message: 'Email is required.',
      };
    }

    try {
      const { sdk, error } = getAuthSdk();
      if (!sdk) {
        return {
          success: false,
          message: error || 'Auth SDK is not configured.',
        };
      }

      const response = await sdk.auth.forgotPassword(email.trim());

      return {
        success: true,
        message: apiMessage(response) ?? 'Se ha enviado el correo si existe una cuenta registrada.',
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: normalizeError(error, 'No se pudo procesar la solicitud. Intenta de nuevo.'),
      };
    }
  },

  async resetPassword(token: string, newPassword: string): Promise<IdentityResult> {
    if (!token) {
      return {
        success: false,
        message: 'Token inválido.',
      };
    }

    if (!newPassword || newPassword.length < 8) {
      return {
        success: false,
        message: 'La nueva contraseña debe tener al menos 8 caracteres.',
      };
    }

    try {
      const { sdk, error } = getAuthSdk();
      if (!sdk) {
        return {
          success: false,
          message: error || 'Auth SDK is not configured.',
        };
      }

      const response = await sdk.auth.resetPassword(token, newPassword);

      return {
        success: true,
        message: apiMessage(response) ?? 'Contraseña actualizada correctamente.',
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: normalizeError(error, 'No se pudo restablecer la contraseña. Intenta más tarde.'),
      };
    }
  },
};
