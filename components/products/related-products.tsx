import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ProductDetail } from "./product-detail-types";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";

export function RelatedProducts({ products }: { products?: ProductDetail[] }) {
  if (!products?.length) return null;

  return (
    <section className="border-t border-[#dcd2c3] pt-12">
      <div className="mb-8">
        <p className="eyebrow">Continue exploring</p>

        <h2 className="display mt-2 text-4xl text-[#242b27]">
          You may also like
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <Link
            href={`/perfumes/${product.slug}`}
            key={product.slug}
            className="group"
          >
            <div className="overflow-hidden rounded-sm bg-[#eae1d2]">
              <ImagePlaceholder
                label={product.name}
                accent={product.accent}
                className="aspect-[4/5] rounded-none transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>

            <p className="mt-3 text-[10px] uppercase tracking-[0.14em] text-[#8b938c]">
              {product.brand}
            </p>

            <div className="mt-1 flex items-start justify-between gap-2">
              <h3 className="display text-xl text-[#242b27] group-hover:text-[#174d3d]">
                {product.name}
              </h3>

              <ArrowUpRight
                size={15}
                className="mt-1 shrink-0 text-[#174d3d]"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
