"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { formatPrice } from "@/config/regions";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import type { Product, RegionCode } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  const [region, setRegion] = useState<RegionCode>("INTL");

  useEffect(() => {
    const update = () => {
      const value = document.cookie
        .split("; ")
        .find((item) => item.startsWith("ff-region="))
        ?.split("=")[1] as RegionCode | undefined;

      if (value) {
        setRegion(value);
      }
    };

    update();

    window.addEventListener("regionchange", update);

    return () => {
      window.removeEventListener("regionchange", update);
    };
  }, []);

  const pricing = product.price?.[region];

  return (
    <Link
      href={`/perfumes/${product.slug}`}
      className="product-card group block min-w-0"
    >
      {/* Product image */}
      <div className="product-card-image relative overflow-hidden rounded-sm bg-[#eae1d2]">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image.url}
            alt={product.image.alt || `${product.name} product image`}
            className="aspect-[4/5] h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
          />
        ) : (
          <ImagePlaceholder
            label={product.name}
            accent={product.accent}
            className="product-art aspect-[4/5] h-full w-full rounded-none transition-transform duration-700 ease-out group-hover:scale-[1.035]"
          />
        )}

        {/* Badge */}
        {product.badges?.[0] && (
          <span className="absolute left-3 top-3 rounded-sm bg-[#f6f1e8]/95 px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#174d3d] shadow-sm">
            {product.badges[0]}
          </span>
        )}

        {/* Hover action */}
        <span className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-[#f6f1e8]/95 text-[#174d3d] opacity-0 shadow-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight size={16} strokeWidth={1.5} />
        </span>
      </div>

      {/* Product information */}
      <div className="px-0.5 pt-4">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#8b938c]">
          {product.brand}
        </p>

        <div className="mt-2 flex items-start justify-between gap-3">
          <h3 className="display text-xl leading-tight text-[#242b27] transition-colors duration-300 group-hover:text-[#174d3d]">
            {product.name}
          </h3>

          {pricing?.price && (
            <p className="shrink-0 whitespace-nowrap pt-0.5 text-sm font-medium text-[#174d3d]">
              {formatPrice(pricing.price, region)}
            </p>
          )}
        </div>

        {pricing?.originalPrice && (
          <p className="mt-1 text-xs text-[#9ca398] line-through">
            {formatPrice(pricing.originalPrice, region)}
          </p>
        )}

        <div className="mt-4 h-px w-0 bg-[#174d3d] transition-all duration-500 group-hover:w-8" />
      </div>
    </Link>
  );
}
