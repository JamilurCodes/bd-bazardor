import Link from "next/link";

/**
 * Shared 404 page. Next.js renders this when notFound() is called
 * or when a URL does not match an available route.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-16 items-center justify-center bg-[#f0f5f0] px-4 py-12">
      <section
        aria-labelledby="not-found-title"
        className="w-full max-w-xl rounded-2xl border border-[#dfe7e0] bg-[#fbfdfb] px-6 py-10 text-center shadow-sm sm:px-10 sm:py-12"
      >
        <div
          aria-hidden="true"
          className="mx-auto flex size-24 items-center justify-center rounded-2xl bg-[#eff4ef] text-5xl"
        >
          🧺
        </div>

        <p className="mt-6 text-sm font-semibold tracking-wide text-[#07883e]">
          ৪০৪ · পৃষ্ঠা খুঁজে পাওয়া যায়নি
        </p>

        <h1
          id="not-found-title"
          className="mt-3 text-2xl font-extrabold text-[#202a23] sm:text-3xl"
        >
          দুঃখিত! পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#68716a] sm:text-base">
          আপনি যে পণ্য বা পৃষ্ঠাটি খুঁজছেন, সেটি হয়তো সরিয়ে ফেলা হয়েছে অথবা
          ঠিকানাটি সঠিক নয়।
        </p>

        <Link
          href="/"
          className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#07883e] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#066f34] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#07883e]"
        >
          হোম পেজে ফিরে যান
        </Link>
      </section>
    </main>
  );
}
