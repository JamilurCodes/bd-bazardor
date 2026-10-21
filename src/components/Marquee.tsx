
import MarqueeText from "react-marquee-text";
import "react-marquee-text/dist/styles.css";

/*
 * Defines the structure of market price information returned by the API.
 */
export interface Market {
  market: string;
  division: string;
  min: number;
  max: number;
}

/*
 * Represents the direction and percentage of a product's price change.
 */
export interface Change {
  dir: string;
  pct: number;
}

/*
 * Defines the complete structure of a product returned by the Bazar Dor API.
 */
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

/*
 * Supports the possible API response structures, including nested data arrays.
 */
interface ApiResponse {
  data?: MarketProduct[] | { data?: MarketProduct[] };
}

/*
 * Formats numeric prices using Bengali numerals.
 * Returns a fallback message when the supplied price is invalid.
 */
function formatPrice(price: number): string {
  if (!Number.isFinite(price)) {
    return "দাম পাওয়া যায়নি";
  }

  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(price);
}

/*
 * Determines the arrow, color, and percentage used to represent price changes.
 * Increasing prices appear in red, while decreasing prices appear in green.
 * Returns null when the change data is missing or the direction is unknown.
 */
function getPriceChange(change?: Change) {
  if (
    !change ||
    !Number.isFinite(Number(change.pct))
  ) {
    return null;
  }

  const direction = String(change.dir).toLowerCase();

  const isUp = [
    "up",
    "increase",
    "increased",
    "rise",
    "rising",
  ].includes(direction);

  const isDown = [
    "down",
    "decrease",
    "decreased",
    "fall",
    "falling",
  ].includes(direction);

  if (!isUp && !isDown) {
    return null;
  }

  return {
    arrow: isUp ? "▲" : "▼",
    color: isUp ? "text-red-600" : "text-green-700",
    percentage: formatPrice(Math.abs(Number(change.pct))),
    label: isUp ? "দাম বেড়েছে" : "দাম কমেছে",
  };
}

/*
 * Formats the product's unit for display alongside its price.
 * Uses a generic fallback when the API does not provide a unit.
 */
function formatUnit(unit: string): string {
  const normalizedUnit = unit.trim();

  if (!normalizedUnit) {
    return "টাকা/একক";
  }

  return `টাকা/${normalizedUnit.replace(/^প্রতি\s*/, "")}`;
}

/*
 * Fetches product prices on the server and renders the scrolling market ticker.
 * Next.js revalidates the cached API response every five minutes.
 */
export default async function Marquee() {
  let products: MarketProduct[] = [];

  try {
    /*
     * Fetch the latest product data from the Bazar Dor API.
     */
    const response = await fetch(
      "https://openapi.programming-hero.com/api/bazardor/products",
      {
        next: { revalidate: 300 },
      }
    );

    if (response.ok) {
      const result: ApiResponse | MarketProduct[] =
        await response.json();

      /*
       * Normalize the response into a product array.
       * Supports a direct array, data array, or nested data array.
       */
      products = Array.isArray(result)
        ? result
        : Array.isArray(result.data)
          ? result.data
          : Array.isArray(result.data?.data)
            ? result.data.data
            : [];
    }
  } catch (error) {
    /*
     * Log unexpected request errors and stop rendering the ticker.
     */
    console.error("Failed to load market prices:", error);
    return null;
  }

  /*
   * Do not render the ticker when the API returns no products.
   */
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
                  {/* Product category icon */}
                  <span aria-hidden="true" className="text-base">
                    {product.categoryIcon || "🛒"}
                  </span>

                  {/* Bengali product name */}
                  <span className="font-semibold">
                    {product.nameBn}
                  </span>

                  {/* Current price and measurement unit */}
                  <span className="font-normal text-[#303831]">
                    {formatPrice(product.today)}{" "}
                    {formatUnit(product.unit)}
                  </span>

                  {/* Price-change indicator, displayed when valid */}
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
