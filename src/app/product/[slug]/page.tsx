
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getProducts } from "@/lib/products-api";

interface ProductDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(price);
}

// Maps English units to Bengali.
function formatUnit(unit: string): string {
  const unitMap: Record<string, string> = {
    kg: "কেজি",
    kilogram: "কেজি",
    liter: "লিটার",
    litre: "লিটার",
    dozen: "ডজন",
    piece: "পিস",
    pcs: "পিস",
    packet: "প্যাকেট",
    pkt: "প্যাকেট",
    bottle: "বোতল",
    can: "ক্যান",
    gm: "গ্রাম",
    gram: "গ্রাম",
    ml: "এমএল",
    milliliter: "এমএল",
  };

  const normalized = unit.trim().toLowerCase();

  return unitMap[normalized] || unit;
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { slug } = await params;

  // Step 1: Fetch products and find the requested product.
  const products = await getProducts();

  const product = products.find((item) => item.slug === slug);

  // Step 2: Return 404 before checking authentication.
  if (!product) {
    notFound();
  }

  // Step 3: Check authentication only for valid products.
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    const requestedPath = `/product/${slug}`;

    redirect(
      `/signin?callbackUrl=${encodeURIComponent(requestedPath)}`
    );
  }

  // The API image can be a URL or an emoji.
  const productImage =
    typeof product.image === "string"
      ? product.image.trim()
      : "";

  const isImageUrl = /^https?:\/\//i.test(productImage);

  const fallbackIcon =
    productImage || product.categoryIcon || "🛒";

  const markets = product.markets ?? [];

  // Recognize different API price-change directions.
  const UP_DIRECTIONS = [
    "up",
    "increase",
    "increased",
    "rise",
    "rising",
  ];

  const DOWN_DIRECTIONS = [
    "down",
    "decrease",
    "decreased",
    "fall",
    "falling",
  ];

  const changeDirection =
    typeof product.change?.dir === "string"
      ? product.change.dir.trim().toLowerCase()
      : "";

  const changePercentage =
    typeof product.change?.pct === "number" &&
    Number.isFinite(product.change.pct)
      ? Math.abs(product.change.pct)
      : 0;

  const priceIncreased =
    changePercentage > 0 &&
    UP_DIRECTIONS.includes(changeDirection);

  const priceDecreased =
    changePercentage > 0 &&
    DOWN_DIRECTIONS.includes(changeDirection);

  const priceUnchanged =
    !priceIncreased && !priceDecreased;

  const changeColor = priceIncreased
    ? "text-green-600"
    : priceDecreased
      ? "text-red-600"
      : "text-base-content/60";

  const changeSymbol = priceIncreased
    ? "▲"
    : priceDecreased
      ? "▼"
      : "—";

  // Calculate minimum and maximum market prices.
  const minPrice =
    markets.length > 0
      ? Math.min(...markets.map((market) => market.min))
      : product.today;

  const maxPrice =
    markets.length > 0
      ? Math.max(...markets.map((market) => market.max))
      : product.today;

  // Calculate the average of each market's price midpoint.
  const avgPrice =
    markets.length > 0
      ? markets.reduce(
          (sum, market) =>
            sum + (market.min + market.max) / 2,
          0
        ) / markets.length
      : product.today;

  return (
    <div className="mx-auto min-h-[60vh] w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex flex-wrap items-center gap-2 text-sm text-base-content/60"
      >
        <Link href="/" className="transition hover:text-primary">
          হোম
        </Link>

        <span aria-hidden="true">/</span>

        <span>{product.categoryNameBn}</span>

        <span aria-hidden="true">/</span>

        <span
          className="font-medium text-base-content"
          aria-current="page"
        >
          {product.nameBn}
        </span>
      </nav>

      {/* Product overview */}
      <section className="mb-8">
        <div className="rounded-2xl border border-[#e5e7e0] bg-[#fbfdfb] p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="flex flex-col items-center justify-center gap-4 lg:col-span-4">
              <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#eff4ef] sm:size-32">
                {isImageUrl ? (
                  <Image
                    src={productImage}
                    alt={product.nameBn}
                    width={128}
                    height={128}
                    sizes="(max-width: 640px) 96px, 128px"
                    className="size-full object-contain p-3"
                    unoptimized
                  />
                ) : (
                  <span
                    className="text-4xl sm:text-5xl"
                    aria-hidden="true"
                  >
                    {fallbackIcon}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-center lg:col-span-8">
              <div className="mb-2 flex items-center gap-2">
                <span aria-hidden="true" className="text-base">
                  {product.categoryIcon || "🛒"}
                </span>

                <span className="text-sm font-medium text-[#68716a]">
                  {product.categoryNameBn}
                </span>
              </div>

              <h1 className="mb-3 text-3xl font-bold text-[#202a23] sm:text-4xl">
                {product.nameBn}
              </h1>

              <p className="mb-6 text-sm text-base-content/60">
                প্রতি {formatUnit(product.unit)} — {product.categoryNameBn}
              </p>

              {/* Today's price */}
              <div className="rounded-2xl border border-[#e5e7e0] bg-[#fbfdfb] p-5">
                <p className="mb-2 text-sm text-base-content/60">
                  আজকের দাম
                </p>

                <div className="mb-2 flex flex-wrap items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#202a23]">
                    ৳{formatPrice(product.today)}
                  </span>

                  <span className="text-base font-medium text-base-content/60">
                    / {formatUnit(product.unit)}
                  </span>
                </div>

                <div
                  className={`flex items-center gap-1 font-medium ${changeColor}`}
                >
                  <span aria-hidden="true">{changeSymbol}</span>

                  <span>{formatPrice(changePercentage)}%</span>

                  <span className="ml-1 text-xs text-base-content/50">
                    {priceUnchanged
                      ? "দামের কোনো পরিবর্তন নেই"
                      : "গত দিনের তুলনায়"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Price summary */}
      <section className="mb-8">
        <h2 className="mb-6 text-xl font-bold text-[#202a23]">
          দামের সারাংশ
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#e5e7e0] bg-[#fbfdfb] p-6 text-center">
            <p className="mb-1 text-sm text-[#68716a]">
              সর্বনিম্ন দাম
            </p>

            <p className="text-xl font-semibold text-green-600">
              ৳{formatPrice(minPrice)}
            </p>
          </div>

          <div className="rounded-2xl border border-[#e5e7e0] bg-[#fbfdfb] p-6 text-center">
            <p className="mb-1 text-sm text-[#68716a]">
              সর্বোচ্চ দাম
            </p>

            <p className="text-xl font-semibold text-red-600">
              ৳{formatPrice(maxPrice)}
            </p>
          </div>

          <div className="rounded-2xl border border-[#e5e7e0] bg-[#fbfdfb] p-6 text-center">
            <p className="mb-1 text-sm text-[#68716a]">
              গড় দাম
            </p>

            <p className="text-xl font-semibold text-green-600">
              ৳{formatPrice(avgPrice)}
            </p>
          </div>
        </div>
      </section>

      {/* Market-wise price table */}
      <section>
        <h2 className="mb-6 text-xl font-bold text-[#202a23]">
          বাজারভিত্তিক আজকের দাম
        </h2>

        {markets.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-[#e5e7e0]">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[#e5e7e0] bg-[#f8faf8]">
                  <th className="px-4 py-3 text-sm font-medium text-[#68716a]">
                    বাজার
                  </th>

                  <th className="px-4 py-3 text-sm font-medium text-[#68716a]">
                    বিভাগ
                  </th>

                  <th className="px-4 py-3 text-sm font-medium text-[#68716a]">
                    সর্বনিম্ন
                  </th>

                  <th className="px-4 py-3 text-sm font-medium text-[#68716a]">
                    সর্বোচ্চ
                  </th>

                  <th className="px-4 py-3 text-sm font-medium text-[#68716a]">
                    গড়
                  </th>
                </tr>
              </thead>

              <tbody>
                {markets.map((market) => {
                  const marketAverage =
                    (market.min + market.max) / 2;

                  return (
                    <tr
                      key={`${market.market}-${market.division}`}
                      className="border-b border-[#e5e7e0] transition hover:bg-[#f1f5f1]"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-[#202a23]">
                        {market.market}
                      </td>

                      <td className="px-4 py-3 text-sm text-base-content/60">
                        {market.division}
                      </td>

                      <td className="px-4 py-3 text-sm text-[#202a23]">
                        ৳{formatPrice(market.min)}
                      </td>

                      <td className="px-4 py-3 text-sm text-[#202a23]">
                        ৳{formatPrice(market.max)}
                      </td>

                      <td className="px-4 py-3 text-sm text-[#202a23]">
                        ৳{formatPrice(marketAverage)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl border border-[#e5e7e0] bg-[#fbfdfb] p-8 text-center">
            <p className="text-base-content/60">
              এই পণ্যের বাজারভিত্তিক তথ্য পাওয়া যায়নি।
            </p>
          </div>
        )}
      </section>
    </div>
  );
}