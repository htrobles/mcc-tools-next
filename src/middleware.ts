import { auth } from '@/lib/auth';

export default auth((req) => {
  const isLoggedIn = !!req.auth;

  // Protect all routes except auth pages
  if (!isLoggedIn && !req.nextUrl.pathname.startsWith('/auth')) {
    return Response.redirect(new URL('/auth/signin', req.nextUrl));
  }
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - auth (auth pages)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
