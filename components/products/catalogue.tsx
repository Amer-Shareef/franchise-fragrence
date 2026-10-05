import { ProductCard } from "./product-card";
import type { Product } from "@/types/product";

export function Catalogue({ products }: { products: Product[] }) {
  if (!products.length) {
    return (
      <div className="rounded-sm border border-[#dcd2c3] bg-[#eae1d2]/60 px-6 py-20 text-center">
        <p className="eyebrow">Your search</p>

        <h2 className="display mt-3 text-3xl text-[#242b27] sm:text-4xl">
          No fragrances found
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6d756e]">
          Try adjusting your selection or explore the full collection.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 sm:gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-14">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
