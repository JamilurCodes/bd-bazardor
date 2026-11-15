import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { auth } from "@/lib/auth";

// Protect product-detail routes, preserving the requested URL
// so sign-in can send the visitor back afterwards.
export async function proxy(request: NextRequest) {
  let session: Awaited<ReturnType<typeof auth.api.getSession>> | null = null;

  try {
    session = await auth.api.getSession({
      headers: request.headers,
    });
  } catch {
    // MongoDB unreachable or the lookup failed — treat the visitor
    // as signed out so the route redirects instead of returning a 500.
  }

  // Signed-in visitors continue to the product page.
  if (session?.user) {
    return NextResponse.next();
  }

  // Keep both the product slug and any query string in the callback.
  const requestedPath =
    request.nextUrl.pathname + request.nextUrl.search;

  const signInUrl = new URL("/signin", request.url);

  signInUrl.searchParams.set("callbackUrl", requestedPath);

  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ["/product/:path*"],
};