import type { ProductDetail } from "./product-detail-types";

export function ProductDetails({ product }: { product: ProductDetail }) {
  const details = [
    ["SKU", product.sku],
    ["Fragrance family", product.family],
    ["Gender", product.gender],
    ["Concentration", product.concentration],
    ["Country of origin", product.countryOfOrigin],
    ["Manufacturer", product.manufacturer],
  ].filter((item) => item[1]);

  if (!details.length) return null;

  return (
    <section>
      <p className="eyebrow mb-5">Product details</p>

      <div>
        {details.map(([label, value]) => (
          <div
            key={label}
            className="border-b border-[#dcd2c3] py-4 first:pt-0"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8b938c]">
              {label}
            </p>

            <p className="mt-1 text-sm text-[#242b27]">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
