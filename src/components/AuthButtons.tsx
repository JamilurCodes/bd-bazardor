"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

export default function AuthButtons() {
  const router = useRouter();
  const session = authClient.useSession();

  const menuRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const user = session.data?.user;

  // Close the dropdown when clicking outside or pressing Escape.
  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleSignOut = async () => {
    setSigningOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        throw new Error(error.message || "সাইন আউট করা যায়নি");
      }

      toast.success("সাইন আউট সফল হয়েছে");

      setOpen(false);
      router.replace("/");
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "সাইন আউট করতে সমস্যা হয়েছে";

      toast.error(message);
    } finally {
      setSigningOut(false);
    }
  };

  // A skeleton prevents a brief wrong "sign in / sign up" flash
  // while the session is still loading.
  if (session.isPending) {
    return (
      <div
        aria-label="অ্যাকাউন্ট লোড হচ্ছে"
        className="h-10 w-28 animate-pulse rounded-xl bg-[#e9f0e9]"
      />
    );
  }

  if (!user) {
    return (
      <div className="flex shrink-0 items-center gap-3">
        <Link
          href="/signin"
          className="text-sm font-medium text-[#202820] transition-colors hover:text-[#078640]"
        >
          সাইন ইন
        </Link>

        <Link
          href="/signup"
          className="rounded-xl bg-[#078c43] px-5 py-3 text-sm font-semibold text-white shadow-[0_3px_5px_rgba(0,0,0,0.18)] transition-colors hover:bg-[#067638] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078c43]"
        >
          সাইন আপ
        </Link>
      </div>
    );
  }

  const displayName = user.name?.trim() || "ব্যবহারকারী";

  const initials =
    displayName
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const renderAvatar = () => (
    <div className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#eff4ef]">
      {user.image ? (
        <Image
          src={user.image}
          alt={displayName}
          width={32}
          height={32}
          className="size-full object-cover"
          unoptimized
        />
      ) : (
        <span className="flex size-full items-center justify-center bg-[#e2e8f0] text-sm font-semibold text-[#202a23]">
          {initials}
        </span>
      )}

      <span
        aria-hidden="true"
        className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white bg-[#10b981]"
      />
    </div>
  );

  return (
    <div ref={menuRef} className="relative flex shrink-0 items-center">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="true"
        aria-expanded={open}
        className="flex shrink-0 items-center gap-2 rounded-xl border border-[#e5e7e0] bg-[#f8faf8] px-3 py-2 transition-colors hover:bg-[#f1f5f1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078640]"
      >
        {renderAvatar()}

        <span className="hidden max-w-32 truncate text-sm font-medium text-[#202a23] sm:block">
          {displayName}
        </span>

        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`size-4 text-base-content/50 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-[#dfe7e0] bg-[#fbfdfb] p-3 shadow-xl shadow-black/10">
          <div className="mb-3 flex items-center gap-3 border-b border-[#e5e7e0] pb-3">
            {renderAvatar()}

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[#202a23]">
                {displayName}
              </p>

              <p className="truncate text-xs text-[#68716a]">
                {user.email}
              </p>
            </div>
          </div>

          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#202a23] transition-colors hover:bg-[#f1f5f1]"
          >
            <span aria-hidden="true">👤</span>
            আমার প্রোফাইল
          </Link>

          <button
            type="button"
            onClick={() => void handleSignOut()}
            disabled={signingOut}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-[#e84a4a] transition-colors hover:bg-[#fdecea] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span aria-hidden="true">←</span>
            {signingOut ? "সাইন আউট হচ্ছে..." : "সাইন আউট"}
          </button>
        </div>
      )}
    </div>
  );
}