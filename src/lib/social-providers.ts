export type SocialProvider = "google" | "github";

/**
 * Which social providers are actually configured.
 *
 * Must run on the server only — it reads raw env vars. Mirrors the
 * conditions in src/lib/auth.ts so the UI never shows a provider that
 * Better Auth would reject for missing credentials.
 */
export function getEnabledSocialProviders(): SocialProvider[] {
  const providers: SocialProvider[] = [];

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push("google");
  }

  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    providers.push("github");
  }

  return providers;
}
