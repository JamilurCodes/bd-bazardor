/**
 * Returns a safe, same-site path for post-login navigation.
 *
 * Prevents open redirects: protocol-relative (`//host`), backslash
 * tricks, and cross-origin URLs all fall back to the homepage.
 */
export function getSafeCallbackUrl(value: string | null): string {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\")
  ) {
    return "/";
  }

  try {
    const baseUrl = new URL("https://bazardor.invalid");
    const requestedUrl = new URL(value, baseUrl);

    if (requestedUrl.origin !== baseUrl.origin) {
      return "/";
    }

    return (
      requestedUrl.pathname +
      requestedUrl.search +
      requestedUrl.hash
    );
  } catch {
    return "/";
  }
}