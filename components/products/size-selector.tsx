"use client";

import { useState } from "react";
import type { ProductDetail } from "./product-detail-types";

export function SizeSelector({ product }: { product: ProductDetail }) {
  const sizes = product.variants?.length
    ? product.variants.map((variant) => variant.label)
    : (product.sizes ?? []);

  const [selected, setSelected] = useState(sizes[0]);

  if (!sizes.length) return null;

  return (
    <div>
      <p className="eyebrow mb-3">Available sizes</p>

      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => setSelected(size)}
            className={`rounded-sm border px-4 py-2.5 text-sm transition-all duration-200 ${
              selected === size
                ? "border-[#174d3d] bg-[#174d3d] text-[#f6f1e8]"
                : "border-[#d5c9b8] bg-[#f6f1e8] text-[#242b27] hover:border-[#174d3d]"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
