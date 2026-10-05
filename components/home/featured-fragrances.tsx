import { ProductCard } from "@/components/products/product-card";
import { getPublishedProducts } from "@/lib/products/repository";
import { SectionHeading } from "@/components/shared/section-heading";

type Product = Awaited<ReturnType<typeof getPublishedProducts>>[number];

export function FeaturedFragrances({ products }: { products: Product[] }) {
  const featured = products
    .filter((product) => product.badges?.includes("Featured"))
    .slice(0, 4);

  return (
    <section className="bg-[#f6f1e8]">
      <SectionHeading
        label="The collection"
        title="Featured fragrances"
        description="Discover carefully selected scents that deserve a place in your collection."
      />

      <div className="page-shell grid grid-cols-1 gap-x-6 gap-y-12 pb-24 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((product) => (
          <ProductCard product={product} key={product.slug} />
        ))}
      </div>
    </section>
  );
}
