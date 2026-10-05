"use client";

import { useEffect, useState } from "react";
import type { ProductDetail } from "./product-detail-types";

export function ProductAvailability({ product }: { product: ProductDetail }) {
  const [region, setRegion] = useState("LK");

  useEffect(() => {
    const updateRegion = () => {
      const selected = document.cookie
        .split("; ")
        .find((item) => item.startsWith("ff-region="))
        ?.split("=")[1];

      setRegion(selected || "LK");
    };

    updateRegion();
    window.addEventListener("regionchange", updateRegion);

    return () => {
      window.removeEventListener("regionchange", updateRegion);
    };
  }, []);

  const variant =
    product.variants?.find((item) => item.isDefault) ?? product.variants?.[0];

  const regionalPrice = variant?.prices?.find((item) => item.region === region);

  if (!regionalPrice) return null;

  const available = regionalPrice.available !== false;

  return (
    <div className="flex items-center gap-2 text-xs">
      <span
        className={`h-2 w-2 rounded-full ${
          available ? "bg-[#4d8068]" : "bg-[#b6a58a]"
        }`}
      />

      <span className="text-[#6d756e]">
        {available ? "Available in selected region" : "Currently unavailable"}
      </span>
    </div>
  );
}
