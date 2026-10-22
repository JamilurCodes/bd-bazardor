import ProductCard from "./ProductCard";
import type { Product } from "@/lib/type";

interface ProductSectionsProps {
  products: Product[];
}

/**
 * Displays products in three sections:
 * 1. Products with increasing prices.
 * 2. Products with decreasing prices.
 * 3. The complete product catalog.
 *
 * Price changes are taken directly from the existing API.
 */
export default function ProductSections({ products }: ProductSectionsProps) {
  // Show the six products with the largest price increases.
  const risingProducts = products
    .filter((product) => product.change.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  // Show the six products with the largest price decreases.
  const fallingProducts = products
    .filter((product) => product.change.dir === "down")
    .sort((a, b) => Math.abs(b.change.pct) - Math.abs(a.change.pct))
    .slice(0, 6);

  /**
   * Renders a responsive product grid.
   * One column on mobile, two on small screens,
   * and three on large screens.
   */
  const renderProducts = (items: Product[]) => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );

  return (
    <main className="space-y-10 py-8">
      {/* Section A: Rising prices */}
      <section aria-labelledby="rising-products-heading">
        <div className="mb-5">
          <h2
            id="rising-products-heading"
            className="text-xl font-bold sm:text-2xl"
          >
            <span className="text-red-600">▲</span> আজ দাম বেড়েছে
          </h2>
        </div>

        {risingProducts.length > 0 ? (
          renderProducts(risingProducts)
        ) : (
          <p className="text-sm text-base-content/60">
            আজ দাম বেড়েছে এমন কোনো পণ্য পাওয়া যায়নি।
          </p>
        )}
      </section>

      {/* Section B: Falling prices */}
      <section aria-labelledby="falling-products-heading">
        <div className="mb-5">
          <h2
            id="falling-products-heading"
            className="text-xl font-bold sm:text-2xl"
          >
            <span className="text-green-600">▼</span> আজ দাম কমেছে
          </h2>
        </div>

        {fallingProducts.length > 0 ? (
          renderProducts(fallingProducts)
        ) : (
          <p className="text-sm text-base-content/60">
            আজ দাম কমেছে এমন কোনো পণ্য পাওয়া যায়নি।
          </p>
        )}
      </section>

      {/* Section C: All products */}
      <section aria-labelledby="all-products-heading">
        <div className="mb-5">
          <h2
            id="all-products-heading"
            className="text-xl font-bold sm:text-2xl"
          >
            সব পণ্য
          </h2>

          <p className="mt-1 text-sm text-base-content/60">
            মোট ৩৩টি পণ্য দেখানো হচ্ছে
          </p>
        </div>

        {products.length > 0 ? (
          renderProducts(products)
        ) : (
          <p className="text-sm text-base-content/60">
            কোনো পণ্য পাওয়া যায়নি।
          </p>
        )}
      </section>
    </main>
  );
}
