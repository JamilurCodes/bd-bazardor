
/**
 * Global route loading UI. The skeleton mirrors the homepage and
 * category-page layout to reduce layout shift when content appears.
 */
export default function Loading() {
  return (
    <main
      aria-label="পণ্যের তথ্য লোড হচ্ছে"
      aria-busy="true"
      className="mx-auto min-h-screen w-full max-w-6xl space-y-10 px-4 py-8 sm:px-6"
    >
      {/* Hero skeleton */}
      <section className="flex flex-col justify-between gap-6 rounded-2xl border border-[#dfe7e0] bg-[#fbfdfb] p-6 sm:flex-row sm:items-center sm:p-8">
        <div className="flex-1 space-y-4">
          <div className="h-8 w-40 animate-pulse rounded-full bg-[#e4eee5]" />

          <div className="h-9 w-full max-w-lg animate-pulse rounded-lg bg-[#e4eee5]" />

          <div className="h-4 w-full max-w-xl animate-pulse rounded bg-[#e9f0e9]" />

          <div className="h-4 w-4/5 max-w-md animate-pulse rounded bg-[#e9f0e9]" />

          <div className="h-11 w-32 animate-pulse rounded-xl bg-[#d9e8dc]" />
        </div>

        <div className="hidden size-40 shrink-0 animate-pulse rounded-2xl bg-[#e9f0e9] sm:block" />
      </section>

      {/* Price increases and decreases sections */}
      {[0, 1].map((section) => (
        <section key={section} className="space-y-4">
          <div className="space-y-2">
            <div className="h-7 w-56 animate-pulse rounded bg-[#e1ebe2]" />
            <div className="h-4 w-64 animate-pulse rounded bg-[#e9f0e9]" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((card) => (
              <ProductCardSkeleton key={card} />
            ))}
          </div>
        </section>
      ))}

      {/* All products section */}
      <section id="সব-পণ্য" className="space-y-5">
        <div className="space-y-2">
          <div className="h-7 w-36 animate-pulse rounded bg-[#e1ebe2]" />
          <div className="h-4 w-72 max-w-full animate-pulse rounded bg-[#e9f0e9]" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((card) => (
            <ProductCardSkeleton key={card} />
          ))}
        </div>
      </section>
    </main>
  );
}

/**
 * Reusable product-card skeleton, proportioned like the real cards:
 * icon and product details on top, price information below.
 */
function ProductCardSkeleton() {
  return (
    <div className="min-h-36 animate-pulse rounded-2xl border border-[#dfe7e0] bg-[#fbfdfb] p-4">
      <div className="flex items-center gap-3">
        <div className="size-14 shrink-0 rounded-xl bg-[#e9f0e9]" />

        <div className="flex-1 space-y-2">
          <div className="h-5 w-3/4 rounded bg-[#e1ebe2]" />
          <div className="h-4 w-1/2 rounded bg-[#e9f0e9]" />
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="h-3 w-20 rounded bg-[#e9f0e9]" />
          <div className="h-6 w-28 rounded bg-[#e1ebe2]" />
        </div>

        <div className="h-7 w-16 rounded-full bg-[#e9f0e9]" />
      </div>
    </div>
  );
}
