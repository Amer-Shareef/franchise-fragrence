import { ProductCard } from "@/components/products/product-card";
import { getPublishedProducts } from "@/lib/products/repository";
import { SectionHeading } from "@/components/shared/section-heading";

type Product = Awaited<ReturnType<typeof getPublishedProducts>>[number];

export function BestSellers({ products }: { products: Product[] }) {
  const bestSellers = products
    .filter((product) => product.badges?.includes("Best seller"))
    .slice(0, 4);

  return (
    <section className="bg-[#f6f1e8]">
      <SectionHeading
        label="The most sought after"
        title="Best sellers"
        description="Explore fragrances that continue to make an impression."
      />

      <div className="page-shell grid grid-cols-1 gap-x-6 gap-y-12 pb-24 sm:grid-cols-2 lg:grid-cols-4">
        {bestSellers.map((product) => (
          <ProductCard product={product} key={product.slug} />
        ))}
      </div>
    </section>
  );
}
