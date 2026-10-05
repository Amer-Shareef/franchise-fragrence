import type { RegionCode } from "@/types/product";
export type Region = {
  code: RegionCode;
  label: string;
  currency?: string;
  countryCodes: string[];
};
export const regions: Region[] = [
  { code: "LK", label: "Sri Lanka", currency: "LKR", countryCodes: ["LK"] },
  {
    code: "AE",
    label: "United Arab Emirates",
    currency: "AED",
    countryCodes: ["AE"],
  },
  { code: "INTL", label: "International", countryCodes: [] },
];
export function formatPrice(value: number, region: RegionCode) {
  const config = regions.find((item) => item.code === region);
  return new Intl.NumberFormat(region === "LK" ? "en-LK" : "en-AE", {
    style: "currency",
    currency: config?.currency ?? "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
