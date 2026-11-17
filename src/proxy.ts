
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  let session: Awaited<ReturnType<typeof auth.api.getSession>> | null = null;

  try {
    session = await auth.api.getSession({
      headers: request.headers,
    });
  } catch (error) {
    console.error(
      "[proxy] Session lookup failed:",
      error instanceof Error ? error.message : error,
    );
  }

  if (session?.user) {
    return NextResponse.next();
  }

  const requestedPath =
    request.nextUrl.pathname + request.nextUrl.search;

  const signInUrl = new URL("/signin", request.url);

  signInUrl.searchParams.set("callbackUrl", requestedPath);

  return NextResponse.redirect(signInUrl);
}

export const config = {
  // Product routes are checked inside the page
  // so invalid products can return a proper 404.
  // Keep proxy protection for profile routes.
  matcher: ["/profile/:path*"],
};