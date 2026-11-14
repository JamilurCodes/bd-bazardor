
import Hero from "@/components/Hero";
import ProductSections from "@/components/products/ProductSections";
import { getProducts } from "@/lib/products-api";

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <Hero />
      <ProductSections products={products} />
    </div>
  );
}
