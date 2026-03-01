import { NextRequest, NextResponse } from 'next/server';
import { getAuthSdk } from '@/services/iam/auth.service';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get('provider');

  if (provider !== 'google') {
    return NextResponse.json({ error: 'Unsupported provider' }, { status: 400 });
  }

  const { sdk, error } = getAuthSdk();
  if (!sdk) {
    return NextResponse.json(
      { error: error || 'Auth SDK is not configured.' },
      { status: 500 }
    );
  }

  return NextResponse.redirect(sdk.auth.getGoogleAuthUrl());
}

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

    const result = await sdk.auth.signIn({
      email: String(email).trim(),
      password: String(password),
    });

    return NextResponse.json({ message: 'Signed in successfully', data: result });
  } catch (error) {
    console.error('Sign-in route error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
