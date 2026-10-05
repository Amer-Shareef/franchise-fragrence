import type { Metadata } from "next";
import { StoreLayout } from "@/components/layout/store-layout";
import { Catalogue } from "@/components/products/catalogue";
import { CatalogueFilters } from "@/components/products/catalogue-filters";
import {
  getCatalogueFacets,
  getPublishedProducts,
} from "@/lib/products/repository";

export const metadata: Metadata = {
  title: "Perfumes | Franchise Fragrence",
  description: "Explore our considered collection of exceptional fragrances.",
};

export default async function Perfumes({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const filters = await searchParams;

  const [products, facets] = await Promise.all([
    getPublishedProducts(filters),
    getCatalogueFacets(),
  ]);

  return (
    <StoreLayout>
      <section className="bg-[#f6f1e8]">
        {/* Page introduction */}
        <div className="page-shell pb-10 pt-14 sm:pb-12 sm:pt-20 lg:pt-24">
          <div className="max-w-2xl">
            <p className="eyebrow">The collection</p>

            <h1 className="display mt-3 text-5xl leading-[0.95] text-[#242b27] sm:text-6xl lg:text-7xl">
              Perfumes
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-[#6d756e] sm:text-base">
              Explore distinguished fragrances from the world&apos;s most
              evocative houses. Your selected region determines price and
              availability.
            </p>
          </div>
        </div>

        {/* Filters and catalogue */}
        <div className="page-shell">
          <CatalogueFilters facets={facets} />

          <div className="mb-7 flex items-center justify-between gap-4 border-b border-[#dcd2c3] pb-4">
            <p className="text-xs text-[#6d756e]">
              <span className="font-semibold text-[#174d3d]">
                {products.length}
              </span>{" "}
              fragrance{products.length === 1 ? "" : "s"} found
            </p>

            <p className="hidden text-[10px] uppercase tracking-[0.14em] text-[#8b938c] sm:block">
              Explore your signature
            </p>
          </div>

          <div className="pb-20 sm:pb-24">
            <Catalogue products={products} />
          </div>
        </div>
      </section>
    </StoreLayout>
  );
}
