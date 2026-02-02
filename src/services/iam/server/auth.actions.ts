'use server';

import { AuthController } from '../controller/auth.controller';
import { NextRequest } from 'next/server';

export async function signUpAction(formData: FormData) {
  try {
    // Convert FormData to the format expected by controller
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Create a mock request object
    const mockRequest = {
      json: async () => ({ email, password }),
    } as NextRequest;

    const response = await AuthController.signUp(mockRequest);

    // Convert NextResponse to plain object for client
    const responseData = await response.json();

    if (response.status >= 400) {
      return { success: false, error: responseData.error };
    }

    return { success: true, data: responseData };
  } catch (error) {
    console.error('Server action error:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function signInAction(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const mockRequest = {
      json: async () => ({ email, password }),
    } as NextRequest;

    const response = await AuthController.signIn(mockRequest);
    const responseData = await response.json();

    if (response.status >= 400) {
      return { success: false, error: responseData.error };
    }

    return { success: true, data: responseData };
  } catch (error) {
    console.error('Server action error:', error);
    return { success: false, error: 'Internal server error' };
  }
}