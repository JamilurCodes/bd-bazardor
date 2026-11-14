"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const session = authClient.useSession();

  const redirectStarted = useRef(false);

  const user = session.data?.user;

  // Wait for Better Auth to finish checking the session before
  // redirecting, so signed-in users aren't sent away mid-load.
  useEffect(() => {
    if (!session.isPending && !user && !redirectStarted.current) {
      redirectStarted.current = true;

      toast.error("প্রোফাইল দেখতে আগে সাইন ইন করুন");

      router.replace(
        `/signin?callbackUrl=${encodeURIComponent("/profile")}`,
      );
    }
  }, [router, session.isPending, user]);

  const handleSignOut = async () => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        throw new Error(error.message || "সাইন আউট করা যায়নি");
      }

      toast.success("সাইন আউট সফল হয়েছে");

      router.replace("/");
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "সাইন আউট করতে সমস্যা হয়েছে";

      toast.error(message);
    }
  };

  if (session.isPending) {
    return (
      <div className="mx-auto min-h-[55vh] w-full max-w-3xl animate-pulse space-y-5 px-4 py-12 sm:px-6">
        <div className="h-8 w-48 rounded-lg bg-base-200" />
        <div className="h-36 rounded-2xl bg-base-200" />
        <div className="h-28 rounded-2xl bg-base-200" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const displayName = user.name?.trim() || "ব্যবহারকারী";

  const initials =
    displayName
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <div className="mx-auto min-h-[55vh] w-full max-w-3xl px-4 py-12 sm:px-6">
      <section className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#202a23] sm:text-3xl">
            আমার প্রোফাইল
          </h1>

          <p className="mt-1 text-sm text-[#737d75]">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 rounded-2xl border border-[#dfe7e0] bg-[#fbfdfb] p-5 sm:flex-row sm:p-6">
          <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#eff4ef]">
            {user.image ? (
              <Image
                src={user.image}
                alt={displayName}
                width={64}
                height={64}
                className="size-full object-cover"
                unoptimized
              />
            ) : (
              <span className="flex size-full items-center justify-center text-xl font-bold text-[#202a23]">
                {initials}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <h2 className="break-word text-xl font-bold text-[#202a23]">
              {displayName}
            </h2>

            <p className="mt-1 break-all text-sm text-[#68716a]">
              {user.email}
            </p>
          </div>

          <button
            type="button"
            onClick={() => void handleSignOut()}
            className="rounded-xl border border-[#e84a4a] px-4 py-2 text-sm font-medium text-[#e84a4a] transition hover:bg-[#fdecea]"
          >
            সাইন আউট
          </button>
        </div>

        <div className="rounded-2xl border border-[#dfe7e0] bg-[#fbfdfb] p-5 sm:p-6">
          <h3 className="mb-2 text-base font-semibold text-[#202a23]">
            ব্যক্তিগত তথ্য আপডেট
          </h3>

          <p className="text-sm leading-6 text-[#68716a]">
            আপনার অ্যাকাউন্টের নাম পরিবর্তন করতে নিচের বাটনে ক্লিক করুন।
          </p>

          <Link
            href="/profile/update"
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#059669] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#047857]"
          >
            নাম আপডেট করুন →
          </Link>
        </div>
      </section>
    </div>
  );
}