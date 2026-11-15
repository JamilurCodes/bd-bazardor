import SignUpForm from "@/components/auth/SignUpForm";
import { getEnabledSocialProviders } from "@/lib/social-providers";

export default function SignUpPage() {
  // The server decides which social providers exist so the client form
  // only renders buttons for providers with real credentials.
  const providers = getEnabledSocialProviders();

  return <SignUpForm providers={providers} />;
}
