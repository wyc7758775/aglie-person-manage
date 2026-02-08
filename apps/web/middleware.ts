import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard'];
const PUBLIC_ROUTES = ['/', '/api/auth/login', '/api/auth/register', '/api/auth/logout', '/api/auth/refresh'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname === route);

  if (isProtectedRoute && !isPublicRoute) {
    const token = request.cookies.get('auth_access_token');
    
    if (!token) {
      const loginUrl = new URL('/', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
