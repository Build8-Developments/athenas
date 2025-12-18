import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle dashboard routes - skip i18n but check auth
  if (pathname.startsWith("/dashboard")) {
    // Allow access to login page without auth
    if (pathname === "/dashboard/login") {
      // If already logged in, redirect to dashboard
      const token = request.cookies.get("auth-token")?.value;
      if (token) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      return NextResponse.next();
    }

    // Check authentication for other dashboard routes
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      // Redirect to login if not authenticated
      const loginUrl = new URL("/dashboard/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Token exists, allow access
    return NextResponse.next();
  }

  // Skip API routes from i18n middleware
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Apply i18n middleware for all other routes
  return intlMiddleware(request);
}

export const config = {
  // Include dashboard in matcher so auth middleware runs
  matcher: ["/((?!_next|_vercel|api|.*\\..*).*)"],
};
