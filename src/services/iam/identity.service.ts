import { isAxiosError } from 'axios';
import axiosConfig from '../axios.config';
import { API_PATHS } from '@/lib/paths';

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

const isApiConfigured = (): boolean => Boolean(axiosConfig.defaults.baseURL);

const normalizeError = (error: unknown, fallback: string): string => {
  if (isAxiosError(error)) {
    if (error.response) {
      return apiMessage(error.response.data) ?? fallback;
    }
    if (error.request) {
      return 'No response from the server. Check your connection.';
    }
  }

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

    if (!isApiConfigured()) {
      return {
        success: false,
        message: 'API URL is not configured.',
      };
    }

    try {
      const response = await axiosConfig.post(API_PATHS.forgotPassword, {
        email: email.trim(),
      });

      return {
        success: true,
        message: apiMessage(response.data) ?? 'Se ha enviado el correo si existe una cuenta registrada.',
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

    if (!isApiConfigured()) {
      return {
        success: false,
        message: 'API URL is not configured.',
      };
    }

    try {
      const response = await axiosConfig.post(API_PATHS.resetPassword, {
        token,
        new_password: newPassword,
      });

      return {
        success: true,
        message: apiMessage(response.data) ?? 'Contraseña actualizada correctamente.',
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: normalizeError(error, 'No se pudo restablecer la contraseña. Intenta más tarde.'),
      };
    }
  },
};
