import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('prospect_auth');
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  const isDashboardPage = !isAuthPage && request.nextUrl.pathname !== '/';

  // If not authenticated and trying to access dashboard, redirect to login
  if (!authCookie && isDashboardPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If authenticated and on login page, redirect to dashboard
  if (authCookie && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

