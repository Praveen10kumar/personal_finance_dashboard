import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createMiddleware, shield, detectBot } from '@arcjet/next';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/account(.*)',
  '/transaction(.*)',
]);

// Create Arcjet middleware
const arcjet = createMiddleware({
  key: process.env.ARCJET_KEY || 'aj_test_key',
  rules: [
    shield({ mode: 'LIVE' }),
    detectBot({
      mode: 'LIVE',
      allow: ['CATEGORY:SEARCH_ENGINE', 'GO_HTTP'],
    }),
  ],
});

export async function middleware(request) {
  const response = NextResponse.next();
  
  const clerkResult = await clerkMiddleware({
    afterAuth(auth, req, evt) {
      const { userId } = auth;
      if (!userId && isProtectedRoute(req)) {
        return evt.redirectToSignIn();
      }
      return response;
    }
  })(request);

  if (clerkResult !== response) {
    return clerkResult;
  }
  
  return arcjet()(request);
}

// Fix the matcher pattern - simplify it to avoid regex issues
export const config = {
  matcher: [
    // Protected routes
    '/dashboard/:path*',
    '/account/:path*',
    '/transaction/:path*',
    // API routes
    '/api/:path*',
    '/trpc/:path*',
  ],
};
