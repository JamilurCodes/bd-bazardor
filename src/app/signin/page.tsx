import SignInForm from "@/components/auth/SignInForm";
import { getEnabledSocialProviders } from "@/lib/social-providers";

export default function SignInPage() {
  // The server decides which social providers exist so the client form
  // only renders buttons for providers with real credentials.
  const providers = getEnabledSocialProviders();

  return <SignInForm providers={providers} />;
}
