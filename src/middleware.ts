import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isInfoPage = req.nextUrl.pathname.startsWith("/info");
  const infoFilled = req.auth?.user?.infoFilled;

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
