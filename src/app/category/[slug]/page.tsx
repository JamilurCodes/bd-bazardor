import Link from "next/link";
import { notFound } from "next/navigation";

import ProductCard from "@/components/products/ProductCard";
import { getProducts } from "@/lib/products-api";
import type { Product } from "@/lib/type";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    sort?: string;
  }>;
}

type SortOption = "default" | "price-asc" | "price-desc";

function formatNumber(value: number): string {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Sorts a copy of the product list without mutating the API data.
 * Prices must be compared as numbers, never as strings.
 */
function sortProducts(products: Product[], sort: SortOption): Product[] {
  const result = [...products];

  switch (sort) {
    case "price-asc":
      return result.sort((a, b) => a.today - b.today);

    case "price-desc":
      return result.sort((a, b) => b.today - a.today);

    default:
      return result;
  }
}

/**
 * Category listing page with URL-based price sorting
 * (`?sort=price-asc|price-desc`) and a 404 for unknown categories.
 */
export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const [{ slug }, { sort: requestedSort }] = await Promise.all([
    params,
    searchParams,
  ]);

  const validSortOptions: SortOption[] = ["default", "price-asc", "price-desc"];

  const sort: SortOption = validSortOptions.includes(
    requestedSort as SortOption,
  )
    ? (requestedSort as SortOption)
    : "default";

  const allProducts = (await getProducts()) as unknown as Product[];

  const categoryProducts = allProducts.filter(
    (product) => product.category.toLowerCase() === slug.toLowerCase(),
  );

  // Unknown or empty categories must render the 404 page.
  if (categoryProducts.length === 0) {
    notFound();
  }

  const sortedProducts = sortProducts(categoryProducts, sort);
  const firstProduct = categoryProducts[0];

  const categoryName = firstProduct.categoryNameBn;
  const categoryIcon = firstProduct.categoryIcon || "🛒";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-6 sm:px-6 sm:pt-8">
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-2 text-sm text-[#68716a]"
      >
        <Link href="/" className="transition hover:text-[#07883e]">
          হোম
        </Link>

        <span aria-hidden="true">›</span>

        <span className="font-medium text-[#202a23]">{categoryName}</span>
      </nav>

      <section className="flex items-center gap-4 rounded-2xl border border-[#dfe7e0] bg-[#fbfdfb] p-5 sm:p-6">
        <div
          aria-hidden="true"
          className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-[#eff4ef] text-4xl"
        >
          {categoryIcon}
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-[#202a23] sm:text-3xl">
            {categoryName}
          </h1>

          <p className="mt-1 text-sm text-[#737d75] sm:text-base">
            প্রতিটি পণ্যের আজকের দাম ও পরিবর্তন
          </p>
        </div>
      </section>

      <section className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#dfe7e0] bg-[#fbfdfb] px-5 py-4">
        <p className="text-sm text-[#737d75]">
          মোট{" "}
          <span className="font-bold text-[#202a23]">
            {formatNumber(sortedProducts.length)}
          </span>{" "}
          টি পণ্য দেখানো হচ্ছে
        </p>

        <form
          action={`/category/${encodeURIComponent(slug)}`}
          method="GET"
          className="flex items-center gap-3"
        >
          <div className="relative">
            <select
              id="category-sort"
              name="sort"
              defaultValue={sort}
              className="appearance-none rounded-lg border border-[#cfd8d0] bg-white py-2 pl-3 pr-9 text-sm text-[#202a23] outline-none transition focus:border-[#07883e] focus:ring-2 focus:ring-[#07883e]/15"
            >
              <option value="default">ডিফল্ট</option>
              <option value="price-asc">দাম: কম থেকে বেশি</option>
              <option value="price-desc">দাম: বেশি থেকে কম</option>
            </select>

            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#68716a]"
            >
              <path
                d="m5 7.5 5 5 5-5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-[#07883e] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#067333] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#07883e]"
          >
            সাজান
          </button>
        </form>
      </section>

      <section className="mt-5" aria-label={`${categoryName} পণ্যসমূহ`}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
