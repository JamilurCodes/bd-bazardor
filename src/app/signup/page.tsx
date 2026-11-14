"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { authClient } from "@/lib/auth-client";

type SocialProvider = "google" | "github";

export default function SignUpPage() {
  const router = useRouter();
  const session = authClient.useSession();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  // A user who already has a session does not need to register again.
  useEffect(() => {
    if (!session.isPending && session.data?.user) {
      router.replace("/");
    }
  }, [router, session.isPending, session.data?.user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();

    if (!name || !email || !formData.password) {
      toast.error("সবগুলো প্রয়োজনীয় তথ্য পূরণ করুন");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("পাসওয়ার্ড দুটি মিলছে না");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password: formData.password,
      });

      if (error) {
        // Keys must match Better Auth's exact English error messages.
        const errorMessageMap: Record<string, string> = {
          "Email already in use": "এই ইমেইলটি ইতিমধ্যে ব্যবহৃত হয়েছে",
          "Invalid email": "ইমেইল ঠিকানাটি সঠিক নয়",
          "Password too short": "পাসওয়ার্ডটি খুব ছোট",
        };

        toast.error(
          (error.message && errorMessageMap[error.message]) ||
            error.message ||
            "অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে",
        );

        return;
      }

      toast.success("অ্যাকাউন্ট তৈরি হয়েছে। এবার সাইন ইন করুন।");
      router.replace("/signin");
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignUp = async (provider: SocialProvider) => {
    setLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "সাইন আপ করতে সমস্যা হয়েছে");
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "সাইন আপ করতে সমস্যা হয়েছে";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (session.isPending) {
    return (
      <div className="mx-auto flex min-h-[55vh] w-full max-w-md items-center justify-center px-4">
        <div className="w-full animate-pulse space-y-4">
          <div className="mx-auto h-8 w-48 rounded-lg bg-base-200" />
          <div className="h-72 rounded-2xl bg-base-200" />
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
            অ্যাকাউন্ট তৈরি করুন
          </h1>

          <p className="text-sm text-[#6b7280]">
            বাজারের বিস্তারিত দাম দেখতে বিনামূল্যে সাইন আপ করুন।
          </p>
        </div>

        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="signup-name"
                className="block text-sm font-medium text-[#374151]"
              >
                নাম
              </label>

              <input
                id="signup-name"
                type="text"
                autoComplete="name"
                required
                placeholder="আপনার নাম লিখুন"
                value={formData.name}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    name: event.target.value,
                  })
                }
                disabled={loading}
                className="w-full rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 text-[#111827] transition focus:border-[#059669] focus:outline-none focus:ring-2 focus:ring-[#059669]/20"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="signup-email"
                className="block text-sm font-medium text-[#374151]"
              >
                ইমেইল
              </label>

              <input
                id="signup-email"
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
                htmlFor="signup-password"
                className="block text-sm font-medium text-[#374151]"
              >
                পাসওয়ার্ড
              </label>

              <input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                placeholder="কমপক্ষে ৮ অক্ষর"
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

            <div className="space-y-2">
              <label
                htmlFor="signup-confirm-password"
                className="block text-sm font-medium text-[#374151]"
              >
                পাসওয়ার্ড নিশ্চিত করুন
              </label>

              <input
                id="signup-confirm-password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                placeholder="পাসওয়ার্ড আবার লিখুন"
                value={formData.confirmPassword}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    confirmPassword: event.target.value,
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
              {loading ? "চলছে..." : "অ্যাকাউন্ট তৈরি করুন"}
            </button>
          </form>

          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e5e7eb]" />
            </div>

            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-[#6b7280]">
                অথবা
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => void handleSocialSignUp("google")}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#e5e7eb] bg-white py-3 text-sm font-medium text-[#374151] transition hover:bg-[#f9fafb] disabled:opacity-60"
            >
              <FcGoogle className="text-lg" />
              Google দিয়ে সাইন আপ
            </button>

            <button
              type="button"
              onClick={() => void handleSocialSignUp("github")}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#e5e7eb] bg-white py-3 text-sm font-medium text-[#374151] transition hover:bg-[#f9fafb] disabled:opacity-60"
            >
              <FaGithub className="text-lg" />
              GitHub দিয়ে সাইন আপ
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-[#6b7280]">
            অ্যাকাউন্ট আছে?{" "}
            <Link
              href="/signin"
              className="font-medium text-[#059669] hover:underline"
            >
              সাইন ইন করুন
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