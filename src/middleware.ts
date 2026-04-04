import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require OWNER role - these will show access denied page
const OWNER_ONLY_ROUTES = [
  '/list-apartment',
  '/test',
  '/profile/referrals',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only check OWNER-only routes
  // Note: We can't verify JWT here because token is in localStorage (client-side only)
  // The actual authentication check happens in the page components
  // This middleware only shows a user-friendly access denied page for OWNER routes
  
  const isOwnerOnlyRoute = OWNER_ONLY_ROUTES.some(route => pathname.startsWith(route));

  if (isOwnerOnlyRoute) {
    // For OWNER-only routes, let the page component handle the check
    // The page will redirect if user is not authenticated or not an OWNER
    return NextResponse.next();
  }

  // Allow all other routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - auth (login page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|assets|public|auth).*)',
  ],
};
