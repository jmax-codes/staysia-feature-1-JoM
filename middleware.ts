import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

// Define route access rules
const ROUTE_CONFIG = {
  // User-only routes
  user: ["/bookings", "/profile"],
  // Tenant-only routes
  tenant: ["/tenant/dashboard", "/tenant/properties", "/tenant/bookings"],
  // Public routes (no auth needed)
  public: ["/", "/properties", "/auth"],
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip auth checks for public routes
  if (
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static")
  ) {
    return NextResponse.next();
  }

  // Get session (lightweight JWT verification only)
  const session = await auth.api.getSession({ headers: await headers() });
  
  // Check if route requires authentication
  const requiresAuth = 
    ROUTE_CONFIG.user.some(route => pathname.startsWith(route)) ||
    ROUTE_CONFIG.tenant.some(route => pathname.startsWith(route));
  
  // No session and protected route - redirect to appropriate login
  if (!session && requiresAuth) {
    const isTenantRoute = ROUTE_CONFIG.tenant.some(route => pathname.startsWith(route));
    const loginPath = isTenantRoute ? "/auth/login/tenant" : "/auth/login/user";
    const url = new URL(loginPath, request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }
  
  // If session exists, perform role-based checks
  if (session?.user) {
    const userRole = session.user.role || "user";
    
    // Role-based access control
    const isTenantRoute = ROUTE_CONFIG.tenant.some(route => pathname.startsWith(route));
    const isUserRoute = ROUTE_CONFIG.user.some(route => pathname.startsWith(route));
    
    // Tenant trying to access user routes
    if (userRole === "tenant" && isUserRoute) {
      return NextResponse.redirect(new URL("/tenant/dashboard", request.url));
    }
    
    // User trying to access tenant routes
    if (userRole === "user" && isTenantRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};