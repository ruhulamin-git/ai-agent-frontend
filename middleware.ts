import { NextResponse } from "next/server";

import { ASSESS_TOKEN } from "@/utils/constants";

import type { NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
  const token = request.cookies.get(ASSESS_TOKEN)?.value ?? null;
  const { pathname } = request.nextUrl;
  const isAuthPath = pathname.startsWith("/auth");
  const isOAuthPath = pathname.startsWith("/oauth");
  const isOnboardingPath = pathname.startsWith("/onboarding");

  const isAgentsPath = pathname.startsWith("/agents");

  if (token && (isAuthPath || isOnboardingPath || isOAuthPath)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Define public paths that don't require token
  const isPublicPath =
    pathname === "/" ||
    isAuthPath ||
    isOAuthPath ||
    isOnboardingPath ||
    isAgentsPath ||
    pathname.startsWith("/marketplace") ||
    pathname.startsWith("/subscription") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/privacy") ||
    pathname.startsWith("/docs") ||
    pathname.startsWith("/release-notes") ||
    pathname.startsWith("/start-building") ||
    pathname.startsWith("/verify-email") ||
    pathname.startsWith("/terms");

  if (!token && !isPublicPath) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)"],
};
