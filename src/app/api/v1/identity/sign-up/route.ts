import { NextRequest, NextResponse } from 'next/server';
import { getAuthSdk } from '@/services/iam/auth.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body ?? {};

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const { sdk, error } = getAuthSdk();
    if (!sdk) {
      return NextResponse.json({ error: error || 'Auth SDK is not configured.' }, { status: 500 });
    }

    await sdk.auth.signUp({
      email: String(email).trim(),
      password: String(password),
    });

    return NextResponse.json({ message: 'Identity registered successfully' }, { status: 201 });
  } catch (error) {
    console.error('Sign-up route error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}