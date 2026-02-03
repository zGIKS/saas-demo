import { NextRequest, NextResponse } from 'next/server';
import { getAuthSdk } from '@/services/iam/auth.service';

const resolveBackendConfig = () => {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE?.trim() ?? process.env.NEXT_PUBLIC_API_URL?.trim();
  const anonKey =
    process.env.NEXT_PUBLIC_TENANT_KEY?.trim() ?? process.env.NEXT_PUBLIC_ANON_KEY?.trim();

  return {
    baseUrl: baseUrl ? baseUrl.replace(/\/$/, '') : null,
    anonKey: anonKey || null,
  };
};

const extractErrorMessage = async (response: Response): Promise<string> => {
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    try {
      const data = (await response.json()) as { message?: string; error?: string };
      return data?.message || data?.error || 'Google auth failed';
    } catch {
      return 'Google auth failed';
    }
  }

  try {
    const text = await response.text();
    return text ? text.slice(0, 160) : 'Google auth failed';
  } catch {
    return 'Google auth failed';
  }
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get('provider');

  if (provider !== 'google') {
    return NextResponse.json({ error: 'Unsupported provider' }, { status: 400 });
  }

  const { baseUrl, anonKey } = resolveBackendConfig();
  if (!baseUrl || !anonKey) {
    return NextResponse.json(
      { error: 'Backend configuration missing. Check NEXT_PUBLIC_API_BASE and NEXT_PUBLIC_TENANT_KEY.' },
      { status: 500 }
    );
  }

  const googleUrl = `${baseUrl}/api/v1/auth/google`;
  const response = await fetch(googleUrl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${anonKey}`,
    },
    redirect: 'manual',
  });

  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get('location');
    if (location) {
      return NextResponse.redirect(location);
    }
  }

  if (response.ok) {
    try {
      const data = (await response.json()) as { url?: string };
      if (data?.url) {
        return NextResponse.redirect(data.url);
      }
    } catch {
      // fall through
    }
  }

  const message = await extractErrorMessage(response);
  return NextResponse.redirect(
    new URL(`/sign-in?error=${encodeURIComponent(message)}`, request.url)
  );
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
