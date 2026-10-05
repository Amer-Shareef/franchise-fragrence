import type { ProductDetail } from "./product-detail-types";

const groups = [
  { key: "top", label: "Top notes" },
  { key: "heart", label: "Heart notes" },
  { key: "base", label: "Base notes" },
] as const;

export function FragranceNotes({ product }: { product: ProductDetail }) {
  const availableGroups = groups.filter(
    (group) => product.notes?.[group.key]?.length,
  );

  if (!availableGroups.length) return null;

  return (
    <section>
      <p className="eyebrow mb-6">The composition</p>

      <div className="space-y-6">
        {availableGroups.map((group) => (
          <div key={group.key}>
            <h2 className="display text-2xl text-[#242b27]">{group.label}</h2>

            <p className="mt-2 text-sm leading-7 text-[#6d756e]">
              {product.notes?.[group.key]?.join(" · ")}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
