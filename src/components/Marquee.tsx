import MarqueeText from "react-marquee-text";
import "react-marquee-text/dist/styles.css";
import { getProducts } from "@/lib/products-api";

export interface Market {
  market: string;
  division: string;
  min: number;
  max: number;
}

export interface Change {
  dir: string;
  pct: number;
}

/** Shape of a product as returned by the BazarDor API. */
export interface MarketProduct {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: Change;
  markets: Market[];
}

/** Formats a price with Bengali numerals, or a fallback message for invalid values. */
function formatPrice(price: number): string {
  if (!Number.isFinite(price)) {
    return "দাম পাওয়া যায়নি";
  }

  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * Builds the arrow, color, and percentage shown for a price change.
 * Rising prices render in green and falling prices in red.
 * Returns null when the change data is missing or the direction is unknown.
 */
function getPriceChange(change?: Change) {
  if (!change || !Number.isFinite(Number(change.pct))) {
    return null;
  }

  const direction = String(change.dir).toLowerCase();

  const isUp = ["up", "increase", "increased", "rise", "rising"].includes(
    direction,
  );

  const isDown = ["down", "decrease", "decreased", "fall", "falling"].includes(
    direction,
  );

  if (!isUp && !isDown) {
    return null;
  }

  return {
    arrow: isUp ? "▲" : "▼",
    color: isUp ? "text-green-600" : "text-red-500",
    percentage: formatPrice(Math.abs(Number(change.pct))),
    label: isUp ? "দাম বেড়েছে" : "দাম কমেছে",
  };
}

/** Formats the product's unit for display alongside its price. */
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
    bottle: "বতল",
    can: "ক্যান",
    gm: "গ্রাম",
    gram: "গ্রাম",
    ml: "এমএল",
    milliliter: "এমএল",
  };

  const normalizedUnit = unit.trim().toLowerCase();

  if (!normalizedUnit) {
    return "টাকা/একক";
  }

  const bengaliUnit = unitMap[normalizedUnit] || normalizedUnit;
  return `টাকা/${bengaliUnit.replace(/^প্রতি\s*/, "")}`;
}

/** Renders the scrolling market-price ticker from the latest product data. */
export default async function Marquee() {
  // Revalidation is handled by the API helper (next: { revalidate: 300 }).
  let products: MarketProduct[] = [];

  try {
    products = await getProducts();
  } catch (error) {
    console.error("Unable to load the market-price ticker:", error);
  }

  // Nothing to scroll when the API returns no products.
  if (products.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="আজকের বাজারদর"
      className="w-full overflow-hidden border-y border-[#e5ebe6] bg-[#f9fbf9] text-[#252d27]"
    >
      <div className="mx-auto flex min-h-11.5 w-full items-stretch">
        <div className="min-w-0 flex-1 overflow-hidden">
          <MarqueeText
            className="flex h-full items-stretch infinite whitespace-nowrap"
            direction="right"
            duration={20}
            pauseOnHover
          >
            {products.map((product) => {
              const change = getPriceChange(product.change);

              return (
                <div
                  key={product.id ?? product.slug}
                  className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap border-r border-[#e8ede9] px-4 py-2.5 text-sm sm:px-5 sm:text-base"
                >
                  <span aria-hidden="true" className="text-base">
                    {product.categoryIcon || "🛒"}
                  </span>

                  <span className="font-semibold">{product.nameBn}</span>

                  <span className="font-normal text-[#303831]">
                    {formatPrice(product.today)} {formatUnit(product.unit)}
                  </span>

                  {change && (
                    <span
                      className={`inline-flex items-center gap-1 font-semibold ${change.color}`}
                      aria-label={`${change.label}, ${change.percentage} শতাংশ`}
                    >
                      {change.arrow} {change.percentage}%
                    </span>
                  )}
                </div>
              );
            })}
          </MarqueeText>
        </div>
      </div>
    </section>
  );
}
