/**
 * Next.js Middleware for Authentication
 * 
 * This middleware runs on every request and handles route protection.
 * It checks for authentication tokens and redirects unauthenticated users
 * to the login page for protected routes.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = [
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
];

// Define API routes that don't require authentication
const publicApiRoutes = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/password/reset-request',
  '/api/auth/password/reset-complete',
  '/api/auth/email/verify',
  '/api/auth/health',
];

/**
 * Check if a route is public (doesn't require authentication)
 */
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => pathname.startsWith(route)) ||
         publicApiRoutes.some(route => pathname.startsWith(route));
}

/**
 * Check if user has a valid authentication token
 */
function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get('auth_token')?.value;
  return !!token;
}

/**
 * Middleware function that runs on every request
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/_next/') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  // Check if the route is public
  if (isPublicRoute(pathname)) {
    // If user is authenticated and trying to access auth pages, redirect to home
    if (isAuthenticated(request) && pathname.startsWith('/auth/')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // For protected routes, check authentication
  if (!isAuthenticated(request)) {
    // Store the attempted URL to redirect back after login
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // User is authenticated, allow access
  return NextResponse.next();
}

/**
 * Configure which routes the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
};
