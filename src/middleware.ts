import { NextResponse } from "next/server";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";

export default withAuth(
  function handleAuthorizationChecks(request: NextRequestWithAuth) {
    const isLoggedIn = !!request.nextauth.token;
    const pathname = request.nextUrl.pathname;

    const isKioskPage = pathname.startsWith("/kiosk");
    const isInfoPage = pathname.startsWith("/info");
    const isApiRoute = pathname.startsWith("/api");
    const isProtectedRoute = pathname.startsWith("/dashboard");
    const isAdminOnlyDashboardRoute = pathname.startsWith(
      "/dashboard/events-library",
    );

    const infoFilled = request.nextauth.token?.user?.infoFilled;
    const role = request.nextauth.token?.user?.role as
      | "admin"
      | "manager"
      | "kiosk"
      | undefined;

    const allowedRoles = ["admin", "manager"];

    // Kiosk-only pages: block all other roles
    if (isKioskPage && role !== "kiosk") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Kiosk accounts: redirect away from all non-kiosk pages
    if (isLoggedIn && role === "kiosk" && !isKioskPage) {
      return NextResponse.redirect(new URL("/kiosk", request.url));
    }

    if (isProtectedRoute && !isLoggedIn) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (isProtectedRoute && role && !allowedRoles.includes(role)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (isAdminOnlyDashboardRoute && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (isLoggedIn && !infoFilled && !isInfoPage && !isApiRoute && role !== "kiosk") {
      return NextResponse.redirect(new URL("/info", request.url));
    }

    if (isLoggedIn && infoFilled && isInfoPage) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  },
  {
    callbacks: {
      authorized: () => true,
    },
  },
);

export const config = {
  matcher: ["/((?!_next|api/auth|favicon.ico|logo.svg).*)"],
};
