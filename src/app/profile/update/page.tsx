"use client";

import { useEffect, useRef, useState, type FormEventHandler } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

export default function ProfileUpdatePage() {
  const router = useRouter();
  const session = authClient.useSession();

  const [name, setName] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  const redirectStarted = useRef(false);
  const user = session.data?.user;
  const currentName = name || user?.name || "";

  // Don't redirect while the initial session request is still pending.
  useEffect(() => {
    if (!session.isPending && !user && !redirectStarted.current) {
      redirectStarted.current = true;

      toast.error("তথ্য আপডেট করতে আগে সাইন ইন করুন");

      router.replace(
        `/signin?callbackUrl=${encodeURIComponent("/profile/update")}`,
      );
    }
  }, [router, session.isPending, user]);

  const handleUpdate: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const cleanName = currentName.trim();

    if (!cleanName) {
      toast.error("আপনার নাম লিখুন");
      return;
    }

    if (cleanName.length < 2) {
      toast.error("নাম কমপক্ষে ২ অক্ষরের হতে হবে");
      return;
    }

    if (cleanName === user?.name) {
      toast("আপনার নামে কোনো পরিবর্তন করা হয়নি");
      return;
    }

    setUpdateLoading(true);

    try {
      const { error } = await authClient.updateUser({
        name: cleanName,
      });

      if (error) {
        toast.error(
          error.message || "প্রোফাইল আপডেট করতে সমস্যা হয়েছে",
        );
        return;
      }

      // Refetch so the header shows the new name immediately.
      await session.refetch();

      toast.success("আপনার প্রোফাইল সফলভাবে আপডেট হয়েছে");

      router.replace("/profile");
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "প্রোফাইল আপডেট করতে সমস্যা হয়েছে";

      toast.error(message);
    } finally {
      setUpdateLoading(false);
    }
  };

  if (session.isPending) {
    return (
      <div className="mx-auto min-h-[55vh] w-full max-w-3xl animate-pulse space-y-5 px-4 py-12 sm:px-6">
        <div className="h-8 w-48 rounded-lg bg-base-200" />
        <div className="h-52 rounded-2xl bg-base-200" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto min-h-[55vh] w-full max-w-3xl px-4 py-12 sm:px-6">
      <section className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-[#202a23] sm:text-3xl">
              নাম আপডেট করুন
            </h1>

            <p className="mt-1 text-sm text-[#737d75]">
              আপনার অ্যাকাউন্টের নাম পরিবর্তন করুন।
            </p>
          </div>

          <Link
            href="/profile"
            className="text-sm font-medium text-[#202a23] transition-colors hover:text-[#078640]"
          >
            ← প্রোফাইলে ফিরে যান
          </Link>
        </div>

        <div className="rounded-2xl border border-[#dfe7e0] bg-[#fbfdfb] p-5 sm:p-6">
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="profile-name"
                className="block text-sm font-semibold text-[#202a23]"
              >
                নতুন নাম
              </label>

              <input
                id="profile-name"
                type="text"
                autoComplete="name"
                required
                minLength={2}
                maxLength={100}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="আপনার নাম লিখুন"
                disabled={updateLoading}
                className="w-full rounded-xl border border-[#e5e7eb] bg-white px-4 py-3 text-[#111827] transition focus:border-[#059669] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 disabled:opacity-60"
              />
            </div>

            <button
              type="submit"
              disabled={updateLoading || !name.trim()}
              className="w-full rounded-xl bg-[#059669] py-3 font-medium text-white shadow-md transition hover:bg-[#047857] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updateLoading ? "আপডেট হচ্ছে..." : "আপডেট তথ্য"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}