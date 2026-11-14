"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { authClient } from "@/lib/auth-client";
import { getSafeCallbackUrl } from "@/lib/safe-callback";

type SocialProvider = "google" | "github";

export default function SignInPage() {
  const router = useRouter();
  const session = authClient.useSession();
 
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const callbackUrl =
    typeof window !== "undefined"
      ? getSafeCallbackUrl(
          new URLSearchParams(window.location.search).get("callbackUrl"),
        )
      : "/";
  const callbackReady = typeof window !== "undefined";

  // Visitors redirected from a product page get a hint why they are here.
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const requestedUrl = params.get("callbackUrl");
    const safeUrl = getSafeCallbackUrl(requestedUrl);

    if (requestedUrl && safeUrl.startsWith("/product/")) {
      toast("বিস্তারিত দাম দেখতে আগে সাইন ইন করুন");
    }
  }, []);

  // Signed-in users skip the form and go to their intended page.
  useEffect(() => {
    if (callbackReady && !session.isPending && session.data?.user) {
      router.replace(callbackUrl);
      router.refresh();
    }
  }, [
    callbackReady,
    callbackUrl,
    router,
    session.isPending,
    session.data?.user,
  ]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = formData.email.trim();

    if (!email || !formData.password) {
      toast.error("ইমেইল ও পাসওয়ার্ড লিখুন");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password: formData.password,
        rememberMe: true,
        callbackURL: callbackUrl,
      });

      if (error) {
        toast.error(error.message || "সাইন ইন করতে সমস্যা হয়েছে");
        return;
      }

      toast.success("সফলভাবে সাইন ইন করা হয়েছে");

      router.replace(callbackUrl);
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "সাইন ইন করতে সমস্যা হয়েছে";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: SocialProvider) => {
    setLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: callbackUrl,
      });

      if (error) {
        toast.error(error.message || "সাইন ইন করতে সমস্যা হয়েছে");
        return;
      }

      toast.success("সফলভাবে সাইন ইন করা হয়েছে");

      router.replace(callbackUrl);
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "সাইন ইন করতে সমস্যা হয়েছে";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Don't flash the form while the session or callback URL is still resolving.
  if (session.isPending || !callbackReady) {
    return (
      <div className="mx-auto flex min-h-[55vh] w-full max-w-md items-center justify-center px-4">
        <div className="w-full animate-pulse space-y-4">
          <div className="mx-auto h-8 w-40 rounded-lg bg-base-200" />
          <div className="h-64 rounded-2xl bg-base-200" />
        </div>
      </div>
    );
  }

  if (session.data?.user) {
    return null;
  }

  return (
    <div className="flex min-h-[65vh] items-center justify-center bg-[#f3f4f6] px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold text-[#111827]">
            সাইন ইন করুন
          </h1>

          <p className="text-sm text-[#6b7280]">
            আপনার অ্যাকাউন্টে প্রবেশ করে বাজারের বিস্তারিত দাম দেখুন।
          </p>
        </div>

        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="signin-email"
                className="block text-sm font-medium text-[#374151]"
              >
                ইমেইল
              </label>

              <input
                id="signin-email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    email: event.target.value,
                  })
                }
                disabled={loading}
                className="w-full rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 text-[#111827] transition focus:border-[#059669] focus:outline-none focus:ring-2 focus:ring-[#059669]/20"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="signin-password"
                className="block text-sm font-medium text-[#374151]"
              >
                পাসওয়ার্ড
              </label>

              <input
                id="signin-password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="আপনার পাসওয়ার্ড লিখুন"
                value={formData.password}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    password: event.target.value,
                  })
                }
                disabled={loading}
                className="w-full rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 text-[#111827] transition focus:border-[#059669] focus:outline-none focus:ring-2 focus:ring-[#059669]/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#059669] py-3 font-medium text-white shadow-md transition hover:bg-[#047857] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "চলছে..." : "সাইন ইন করুন"}
            </button>
          </form>

          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e5e7eb]" />
            </div>

            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-[#6b7280]">অথবা</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => void handleSocialSignIn("google")}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#e5e7eb] bg-white py-3 text-sm font-medium text-[#374151] transition hover:bg-[#f9fafb] disabled:opacity-60"
            >
              <FcGoogle className="text-lg" />
              Google দিয়ে সাইন ইন
            </button>

            <button
              type="button"
              onClick={() => void handleSocialSignIn("github")}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#e5e7eb] bg-white py-3 text-sm font-medium text-[#374151] transition hover:bg-[#f9fafb] disabled:opacity-60"
            >
              <FaGithub className="text-lg" />
              GitHub দিয়ে সাইন ইন
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-[#6b7280]">
            অ্যাকাউন্ট নেই?{" "}
            <Link
              href="/signup"
              className="font-medium text-[#059669] hover:underline"
            >
              সাইন আপ করুন
            </Link>
          </p>

          <p className="mt-4 text-center text-sm text-[#6b7280]">
            <Link
              href="/"
              className="font-medium text-[#059669] hover:underline"
            >
              ← হোম পেজে ফিরে যান
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
