"use client";

interface ErrorPageProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function ErrorPage({
  reset,
}: ErrorPageProps) {
  return (
    <div className="flex min-h-[55vh] items-center justify-center px-4 py-12">
      <section className="w-full max-w-xl rounded-2xl border border-[#dfe7e0] bg-[#fbfdfb] px-6 py-10 text-center shadow-sm sm:px-10">
        <div
          aria-hidden="true"
          className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-[#eff4ef] text-4xl"
        >
          🧺
        </div>

        <p className="mt-6 text-sm font-semibold text-[#07883e]">
          তথ্য লোড করা যায়নি
        </p>

        <h1 className="mt-3 text-2xl font-extrabold text-[#202a23]">
          দুঃখিত! সাময়িক সমস্যা হয়েছে।
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#68716a]">
          বাজারের তথ্য আনতে সমস্যা হচ্ছে। আপনার ইন্টারনেট সংযোগ
          পরীক্ষা করে আবার চেষ্টা করুন।
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#07883e] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#066f34]"
        >
          আবার চেষ্টা করুন
        </button>
      </section>
    </div>
  );
}