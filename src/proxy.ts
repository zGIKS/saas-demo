import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getTokenFromServerCookie } from '@/lib/auth';

export async function proxy(request: NextRequest) {
  // Get the token from cookies
  const token = getTokenFromServerCookie(request);

  // Routes that require protection
  const protectedPaths = ['/dashboard'];
  const isProtected = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected) {
    if (!token) {
      // No token, redirect to sign-in
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // Optional: Verify token with backend
    try {
      const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/verify?token=${token}`, {
        method: 'GET',
      });

      if (!verifyRes.ok) {
        // Token invalid, clear cookie and redirect
        const response = NextResponse.redirect(new URL('/sign-in', request.url));
        response.cookies.delete('auth_token');
        return response;
      }

      const verifyData = await verifyRes.json();
      if (!verifyData.is_valid) {
        const response = NextResponse.redirect(new URL('/sign-in', request.url));
        response.cookies.delete('auth_token');
        return response;
      }
    } catch (error) {
      console.error('Token verification error:', error);
      // On error, redirect to login
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};