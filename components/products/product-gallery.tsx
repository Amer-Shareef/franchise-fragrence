/* eslint-disable @next/next/no-img-element -- Product media accepts administrator-supplied local paths and remote URLs. */
"use client";

import { useState } from "react";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import type { ProductDetail } from "./product-detail-types";

export function ProductGallery({ product }: { product: ProductDetail }) {
  const images = product.images ?? [];
  const [selected, setSelected] = useState(0);

  const selectedImage = images[selected];

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-sm bg-[#eae1d2]">
        {selectedImage?.url ? (
          <img
            src={selectedImage.url}
            alt={selectedImage.alt || product.name}
            className="aspect-[4/5] h-full w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
          />
        ) : (
          <ImagePlaceholder
            label={product.name}
            accent={product.accent}
            className="aspect-[4/5] rounded-none"
          />
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => setSelected(index)}
              className={`overflow-hidden rounded-sm border transition-colors ${
                selected === index
                  ? "border-[#174d3d]"
                  : "border-[#dcd2c3] hover:border-[#b6a58a]"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={image.url}
                alt={image.alt || `${product.name} image ${index + 1}`}
                className="aspect-square w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {product.videoUrl && (
        <video controls preload="metadata" className="w-full rounded-sm">
          <source src={product.videoUrl} />
        </video>
      )}
    </div>
  );
}
