import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getTokenFromServerCookie } from '@/lib/auth';
import { verifyTokenWithBackend } from '@/services/iam/auth.service';

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
      const verifyData = await verifyTokenWithBackend(token);
      if (!verifyData?.is_valid) {
        const response = NextResponse.redirect(new URL('/sign-in', request.url));
        response.cookies.delete('auth_token');
        return response;
      }
    } catch (error) {
      console.error('Token verification error:', error);
      // On error, redirect to login
      const response = NextResponse.redirect(new URL('/sign-in', request.url));
      response.cookies.delete('auth_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
