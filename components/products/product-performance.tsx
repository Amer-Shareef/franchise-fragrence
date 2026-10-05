import type { ProductDetail } from "./product-detail-types";

export function ProductPerformance({ product }: { product: ProductDetail }) {
  const details = [
    ["Longevity", product.longevity],
    ["Sillage", product.sillage],
    ["Season", product.season],
    ["Occasion", product.occasion],
  ].filter((item) => item[1]);

  if (!details.length) return null;

  return (
    <section>
      <p className="eyebrow mb-5">Performance & character</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {details.map(([label, value]) => (
          <div
            key={label}
            className="rounded-sm border border-[#dcd2c3] bg-[#eae1d2]/60 p-5"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8b938c]">
              {label}
            </p>

            <p className="mt-2 text-sm leading-6 text-[#242b27]">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
