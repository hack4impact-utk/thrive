import { NextResponse } from "next/server";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";

export default withAuth(
  function handleAuthorizationChecks(request: NextRequestWithAuth) {
    const isLoggedIn = !!request.nextauth.token;
    const pathname = request.nextUrl.pathname;

    const isInfoPage = pathname.startsWith("/info");
    const isProtectedRoute = pathname.startsWith("/dashboard");

    const infoFilled = request.nextauth.token?.user?.infoFilled;
    const role = request.nextauth.token?.user?.role as
      | "admin"
      | "manager"
      | undefined;

    const allowedRoles = ["admin", "manager"];

    if (isProtectedRoute && !isLoggedIn) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (isProtectedRoute && role && !allowedRoles.includes(role)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (isLoggedIn && !infoFilled && !isInfoPage) {
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
