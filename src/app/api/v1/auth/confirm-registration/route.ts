import { NextRequest, NextResponse } from 'next/server';

const resolveBackendConfig = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE?.trim();
  const tenantAnonKey = process.env.NEXT_PUBLIC_TENANT_KEY?.trim();

  return {
    baseUrl: baseUrl ? baseUrl.replace(/\/$/, '') : null,
    tenantAnonKey: tenantAnonKey || null,
  };
};

const extractErrorMessage = async (response: Response): Promise<string> => {
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    try {
      const data = (await response.json()) as { message?: string; error?: string };
      return data?.message || data?.error || 'Email verification failed';
    } catch {
      return 'Email verification failed';
    }
  }

  try {
    const text = await response.text();
    return text ? text.slice(0, 160) : 'Email verification failed';
  } catch {
    return 'Email verification failed';
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token || !token.trim()) {
      return NextResponse.json({ error: 'Verification token is required' }, { status: 400 });
    }

    const { baseUrl, tenantAnonKey } = resolveBackendConfig();
    if (!baseUrl || !tenantAnonKey) {
      return NextResponse.json(
        { error: 'Backend configuration missing. Check NEXT_PUBLIC_API_BASE and NEXT_PUBLIC_TENANT_KEY.' },
        { status: 500 }
      );
    }

    const verifyUrl = `${baseUrl}/api/v1/identity/confirm-registration?token=${encodeURIComponent(token.trim())}&tenant_anon_key=${encodeURIComponent(tenantAnonKey)}`;
    const response = await fetch(verifyUrl, {
      method: 'GET',
      redirect: 'manual',
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (location) {
        return NextResponse.redirect(location);
      }
    }

    if (response.ok) {
      return NextResponse.redirect(new URL('/email-verified?success=true', request.url));
    }

    const message = await extractErrorMessage(response);
    return NextResponse.redirect(
      new URL(`/email-verification-failed?message=${encodeURIComponent(message)}`, request.url)
    );
  } catch (error) {
    console.error('Confirm registration route error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Email verification failed' },
      { status: 400 }
    );
  }
}
