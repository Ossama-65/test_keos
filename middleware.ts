import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('prospect_auth');
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  
  // Pages publiques du site e-commerce (pas besoin d'authentification)
  const publicPages = ['/', '/produits', '/contact'];
  const isPublicPage = publicPages.includes(request.nextUrl.pathname);
  
  // Pages du dashboard qui nécessitent une authentification
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');

  // Si pas authentifié et essaie d'accéder au dashboard, rediriger vers login
  if (!authCookie && isDashboardPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si authentifié et sur la page login, rediriger vers dashboard
  if (authCookie && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
