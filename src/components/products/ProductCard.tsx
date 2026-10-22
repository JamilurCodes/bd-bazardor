import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/type";

/**
 * Formats numbers using Bengali numerals.
 * Example: 1250.5 becomes ১,২৫০.৫
 */
const formatNumber = (value: number): string =>
  new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(value);

interface ProductCardProps {
  product: Product;
}

/**
 * Displays a product's image, name, unit, current price,
 * and percentage change.
 *
 * Clicking the card opens the product's detail page.
 */
export default function ProductCard({ product }: ProductCardProps) {
  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";

  // Use distinct colors to communicate price movement.
  const changeStyle = isUp
    ? "bg-red-50 text-red-700"
    : isDown
      ? "bg-green-50 text-green-700"
      : "bg-base-200 text-base-content/70";

  const changeSymbol = isUp ? "▲" : isDown ? "▼" : "—";

  const formattedChange = formatNumber(Math.abs(product.change.pct));

  return (
    <Link
      href={`/product/${product.slug}`}
      aria-label={`${product.nameBn} পণ্যের বিস্তারিত দেখুন`}
      className="card h-full border border-base-200 bg-base-100 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <div className="card-body gap-4 p-4 sm:p-5">
        {/* Product image and basic information */}
        <div className="flex items-center gap-3">
          <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-base-200">
            {product.image &&
            typeof product.image === "string" &&
            /^https?:\/\//i.test(product.image) ? (
              <Image
                src={product.image}
                alt={product.nameBn}
                width={56}
                height={56}
                sizes="56px"
                className="size-full object-contain p-2"
              />
            ) : (
              <span className="text-3xl" aria-hidden="true">
                {product.image && !/^https?:\/\//i.test(product.image)
                  ? product.image
                  : product.categoryIcon || "🛒"}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 font-semibold leading-relaxed text-base-content">
              {product.nameBn}
            </h3>

            <p className="mt-1 text-sm text-base-content/60">
              প্রতি {product.unit}
            </p>
          </div>
        </div>

        {/* Current price and price movement */}
        <div>
          <p className="text-sm text-base-content/60">আজকের দাম</p>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xl font-bold text-base-content">
              {formatNumber(product.today)}{" "}
              <span className="text-sm font-medium">টাকা</span>
            </p>

            <span
              className={`badge border-0 px-2 py-3 text-xs font-semibold ${changeStyle}`}
              aria-label={`দামের পরিবর্তন ${formattedChange} শতাংশ`}
            >
              <span aria-hidden="true">{changeSymbol}</span> {formattedChange}%
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
