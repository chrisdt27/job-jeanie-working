// middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)', // Exclude static files
    '/',                      // Allow homepage
    '/dashboard(.*)',         // Protect dashboard and subroutes
    '/api/(.*)',              // Protect API routes
  ],
};
