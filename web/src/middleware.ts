import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/learning",
  "/career",
  "/jobs",
  "/connect",
  "/messages",
  "/settings",
  "/teacher",
  "/mentor",
  "/recruiter",
  "/placement",
  "/admin",
  "/interview",
  "/onboarding",
];

// Routes accessible only when NOT authenticated
const authRoutes = ["/login", "/signup"];

// Role-based route restrictions
const roleRoutes: Record<string, string[]> = {
  "/teacher": ["TEACHER", "ADMIN", "SUPER_ADMIN"],
  "/mentor": ["MENTOR", "ADMIN", "SUPER_ADMIN"],
  "/recruiter": ["RECRUITER", "ADMIN", "SUPER_ADMIN"],
  "/placement": ["PLACEMENT_OFFICER", "ADMIN", "SUPER_ADMIN"],
  "/admin": ["ADMIN", "SUPER_ADMIN"],
};

function getTokenFromRequest(request: NextRequest): string | null {
  // Check cookie first
  const cookieToken = request.cookies.get("rvx_token")?.value;
  if (cookieToken) return decodeURIComponent(cookieToken);

  // Check Authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  return null;
}

function isTokenValid(token: string): boolean {
  if (!token || token.trim() === "") return false;

  try {
    // Basic JWT structure check (3 parts separated by dots)
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    // Check expiration
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return false;
    }

    return true;
  } catch {
    // If we can't decode, assume token is valid (API will reject if not)
    return token.length > 10;
  }
}

function getUserRoleFromToken(token: string): string | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload.role || null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const token = getTokenFromRequest(request);
  const isAuthenticated = token ? isTokenValid(token) : false;

  // Check if current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if current path is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect unauthenticated users to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && isAuthenticated) {
    const role = getUserRoleFromToken(token!);
    const roleRedirects: Record<string, string> = {
      CANDIDATE: "/dashboard",
      TEACHER: "/teacher",
      MENTOR: "/mentor",
      RECRUITER: "/recruiter",
      PLACEMENT_OFFICER: "/placement",
      ADMIN: "/admin",
      SUPER_ADMIN: "/admin",
    };
    const redirectTo = role ? (roleRedirects[role] || "/dashboard") : "/dashboard";
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  // Role-based access control
  if (isAuthenticated && token) {
    const userRole = getUserRoleFromToken(token);
    if (userRole) {
      for (const [route, allowedRoles] of Object.entries(roleRoutes)) {
        if (pathname.startsWith(route) && !allowedRoles.includes(userRole)) {
          // Redirect to appropriate dashboard
          const roleRedirects: Record<string, string> = {
            CANDIDATE: "/dashboard",
            TEACHER: "/teacher",
            MENTOR: "/mentor",
            RECRUITER: "/recruiter",
            PLACEMENT_OFFICER: "/placement",
          };
          const redirectTo = roleRedirects[userRole] || "/dashboard";
          return NextResponse.redirect(new URL(redirectTo, request.url));
        }
      }
    }
  }

  // Root redirect
  if (pathname === "/") {
    if (isAuthenticated && token) {
      const role = getUserRoleFromToken(token);
      const roleRedirects: Record<string, string> = {
        CANDIDATE: "/dashboard",
        TEACHER: "/teacher",
        MENTOR: "/mentor",
        RECRUITER: "/recruiter",
        PLACEMENT_OFFICER: "/placement",
        ADMIN: "/admin",
        SUPER_ADMIN: "/admin",
      };
      const redirectTo = role ? (roleRedirects[role] || "/dashboard") : "/dashboard";
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
