import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { StoreLayout } from "@/components/layout/store-layout";
import { getPublishedProduct } from "@/lib/products/repository";

import { ProductGallery } from "@/components/products/product-gallery";
import { ProductPrice } from "@/components/products/product-price";
import { SizeSelector } from "@/components/products/size-selector";
import { FragranceNotes } from "@/components/products/fragrance-notes";
import { ProductDetails } from "@/components/products/product-details";
import { ProductPerformance } from "@/components/products/product-performance";
import { ProductAvailability } from "@/components/products/product-availability";
import { RelatedProducts } from "@/components/products/related-products";

import type { ProductDetail } from "@/components/products/product-detail-types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const product = await getPublishedProduct((await params).slug);

  return product
    ? {
        title: `${product.brand} ${product.name}`,
        description: product.shortDescription,
      }
    : {
        title: "Fragrance not found",
      };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const product = await getPublishedProduct((await params).slug);

  if (!product) notFound();

  /*
   * This assumes your repository returns the existing mapped
   * product fields used by your current product page.
   *
   * Expand this mapping if your repository exposes additional
   * fields such as images, variants, regional prices, or relations.
   */
  const productData = product as unknown as ProductDetail;

  return (
    <StoreLayout>
      <section className="bg-[#f6f1e8]">
        <div className="page-shell py-8 sm:py-12 lg:py-16">
          <Link
            href="/perfumes"
            className="mb-8 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#6d756e] transition-colors hover:text-[#174d3d]"
          >
            <ArrowLeft size={14} />
            Back to collection
          </Link>

          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <ProductGallery product={productData} />

            <div className="lg:py-5">
              <p className="eyebrow">{productData.brand}</p>

              <h1 className="display mt-4 text-5xl leading-[0.95] text-[#242b27] sm:text-6xl">
                {productData.name}
              </h1>

              {productData.shortDescription && (
                <p className="mt-6 max-w-lg text-sm leading-7 text-[#6d756e] sm:text-base">
                  {productData.shortDescription}
                </p>
              )}

              <div className="mt-7">
                <ProductPrice product={productData} />
              </div>

              <div className="mt-5">
                <ProductAvailability product={productData} />
              </div>

              <div className="my-8 border-y border-[#dcd2c3] py-7">
                <SizeSelector product={productData} />
              </div>

              {productData.description && (
                <div className="mb-8">
                  <p className="eyebrow mb-3">About the fragrance</p>

                  <p className="text-sm leading-7 text-[#6d756e]">
                    {productData.description}
                  </p>
                </div>
              )}

              <div className="border-t border-[#dcd2c3] pt-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8b938c]">
                  Catalogue information
                </p>

                <p className="mt-2 text-xs leading-6 text-[#6d756e]">
                  Regional pricing and availability depend on your selected
                  region.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-12 border-t border-[#dcd2c3] pt-12 md:grid-cols-2">
            <FragranceNotes product={productData} />

            <ProductDetails product={productData} />
          </div>

          <div className="mt-12 border-t border-[#dcd2c3] pt-12">
            <ProductPerformance product={productData} />
          </div>

          <div className="mt-12">
            <RelatedProducts products={productData.relatedProducts} />
          </div>
        </div>
      </section>
    </StoreLayout>
  );
}
