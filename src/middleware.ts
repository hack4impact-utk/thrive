import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const pathname = req.nextUrl.pathname;

  const isInfoPage = pathname.startsWith("/info");
  const isProtectedRoute = pathname.startsWith("/dashboard");

  const infoFilled = req.auth?.user?.infoFilled;
  const role = req.auth?.user?.role as "admin" | "manager" | undefined;

  const allowedRoles = ["admin", "manager"];

  if (isProtectedRoute && !isLoggedIn) {
    return Response.redirect(new URL("/", req.url));
  }

  if (isProtectedRoute && role && !allowedRoles.includes(role)) {
    return Response.redirect(new URL("/", req.url));
  }

  if (isLoggedIn && !infoFilled && !isInfoPage) {
    return Response.redirect(new URL("/info", req.url));
  }

  if (isLoggedIn && infoFilled && isInfoPage) {
    return Response.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: ["/((?!_next|api/auth|favicon.ico|logo.svg).*)"],
};
