import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { auth } from "@/lib/auth";

// Protect product-detail routes, preserving the requested URL
// so sign-in can send the visitor back afterwards.
export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

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