import ProductCard from "./ProductCard";
import type { ProductList } from "@/lib/type";

interface ProductSectionsProps {
  products: ProductList;
}

/**
 * Displays products in three sections: the largest price increases,
 * the largest price decreases, and the complete catalog.
 */
const UP_DIRECTIONS = ["up", "increase", "increased", "rise", "rising"];
const DOWN_DIRECTIONS = ["down", "decrease", "decreased", "fall", "falling"];

function isPriceUp(dir: string): boolean {
  return UP_DIRECTIONS.includes(String(dir).toLowerCase());
}

function isPriceDown(dir: string): boolean {
  return DOWN_DIRECTIONS.includes(String(dir).toLowerCase());
}

export default function ProductSections({ products }: ProductSectionsProps) {
  // The six products with the largest price increases.
  const risingProducts = products
    .filter((product) => isPriceUp(product.change.dir))
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  // The six products with the largest price decreases.
  const fallingProducts = products
    .filter((product) => isPriceDown(product.change.dir))
    .sort((a, b) => Math.abs(b.change.pct) - Math.abs(a.change.pct))
    .slice(0, 6);

  const renderProducts = (items: ProductList) => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );

  return (
    <div className="space-y-10 py-8">
      <section aria-labelledby="rising-products-heading">
        <div className="mb-5">
          <h2
            id="rising-products-heading"
            className="text-xl font-bold sm:text-2xl"
          >
            <span className="text-green-600">▲</span> আজ দাম বেড়েছে
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

      <section aria-labelledby="falling-products-heading">
        <div className="mb-5">
          <h2
            id="falling-products-heading"
            className="text-xl font-bold sm:text-2xl"
          >
            <span className="text-red-600">▼</span> আজ দাম কমেছে
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

      <section aria-labelledby="all-products-heading" id="সব-পণ্য">
        <div className="mb-5">
          <h2
            id="all-products-heading"
            className="text-xl font-bold sm:text-2xl"
          >
            সব পণ্য
          </h2>

          <p className="mt-1 text-sm text-base-content/60">
            মোট {new Intl.NumberFormat("bn-BD").format(products.length)}টি পণ্য দেখানো হচ্ছে
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
    </div>
  );
}
