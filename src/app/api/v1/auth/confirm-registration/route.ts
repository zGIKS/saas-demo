import { NextRequest, NextResponse } from 'next/server';
import { getAuthSdk } from '@/services/iam/auth.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token || !token.trim()) {
      return NextResponse.json({ error: 'Verification token is required' }, { status: 400 });
    }

    const { sdk, error } = getAuthSdk();
    if (!sdk) {
      return NextResponse.json({ error: error || 'Auth SDK is not configured.' }, { status: 500 });
    }

    await sdk.auth.confirmRegistration(token.trim());

    return NextResponse.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Confirm registration route error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Email verification failed' },
      { status: 400 }
    );
  }
}
