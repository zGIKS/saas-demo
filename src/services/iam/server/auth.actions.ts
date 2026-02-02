'use server';

import { getAuthSdk } from '../auth.service';

export async function signUpAction(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { sdk, error } = getAuthSdk();
    if (!sdk) {
      return { success: false, error: error || 'Auth SDK is not configured.' };
    }

    await sdk.auth.signUp({ email, password });

    return { success: true, data: { message: 'Identity registered successfully' } };
  } catch (error) {
    console.error('Server action error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    };
  }
}

export async function signInAction(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { sdk, error } = getAuthSdk();
    if (!sdk) {
      return { success: false, error: error || 'Auth SDK is not configured.' };
    }

    const response = await sdk.auth.signIn({ email, password });

    return { success: true, data: response };
  } catch (error) {
    console.error('Server action error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    };
  }
}
