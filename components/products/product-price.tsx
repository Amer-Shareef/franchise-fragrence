"use client";

import { useEffect, useState } from "react";
import type { ProductDetail } from "./product-detail-types";

function getRegion() {
  return (
    document.cookie
      .split("; ")
      .find((item) => item.startsWith("ff-region="))
      ?.split("=")[1] || "LK"
  );
}

function currencyForRegion(region: string) {
  if (region === "AE") return "AED";
  if (region === "LK") return "LKR";
  return "";
}

export function ProductPrice({ product }: { product: ProductDetail }) {
  const [region, setRegion] = useState("LK");

  useEffect(() => {
    const updateRegion = () => setRegion(getRegion());

    updateRegion();
    window.addEventListener("regionchange", updateRegion);

    return () => {
      window.removeEventListener("regionchange", updateRegion);
    };
  }, []);

  if (region === "INTL") {
    return null;
  }

  const variant =
    product.variants?.find((item) => item.isDefault) ?? product.variants?.[0];

  const regionalPrice = variant?.prices?.find((item) => item.region === region);

  if (!regionalPrice?.price || regionalPrice.available === false) {
    return null;
  }

  const currency = currencyForRegion(region);

  return (
    <div className="flex flex-wrap items-baseline gap-3">
      <p className="text-2xl font-medium text-[#174d3d]">
        {currency} {regionalPrice.price.toLocaleString()}
      </p>

      {regionalPrice.originalPrice &&
        regionalPrice.originalPrice > regionalPrice.price && (
          <p className="text-sm text-[#9ca398] line-through">
            {currency} {regionalPrice.originalPrice.toLocaleString()}
          </p>
        )}
    </div>
  );
}
