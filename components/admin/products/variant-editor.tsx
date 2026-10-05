"use client";

import { Plus, Trash2 } from "lucide-react";
import RegionalPriceEditor, {
  type RegionalPriceValue,
} from "./regional-price-editor";

type RegionOption = {
  id: string;
  code: string;
  name: string;
  currency: string | null;
};

export type VariantValue = {
  id?: string;
  label: string;
  volumeMl: string;
  sku: string;
  isDefault: boolean;
  prices: RegionalPriceValue[];
};

type Props = {
  regions: RegionOption[];
  value: VariantValue[];
  onChange: (value: VariantValue[]) => void;
};

const createEmptyVariant = (regions: RegionOption[]): VariantValue => ({
  label: "",
  volumeMl: "",
  sku: "",
  isDefault: false,

  prices: regions.map((region) => ({
    regionId: region.id,
    available: true,
    price: "",
    originalPrice: "",
  })),
});

export default function VariantEditor({ regions, value, onChange }: Props) {
  function addVariant() {
    onChange([...value, createEmptyVariant(regions)]);
  }

  function updateVariant(index: number, changes: Partial<VariantValue>) {
    onChange(
      value.map((variant, variantIndex) =>
        variantIndex === index
          ? {
              ...variant,
              ...changes,
            }
          : variant,
      ),
    );
  }

  function updatePrices(index: number, prices: RegionalPriceValue[]) {
    updateVariant(index, {
      prices,
    });
  }

  function setDefault(index: number) {
    onChange(
      value.map((variant, variantIndex) => ({
        ...variant,
        isDefault: variantIndex === index,
      })),
    );
  }

  function removeVariant(index: number) {
    const next = value.filter((_, variantIndex) => variantIndex !== index);

    if (next.length > 0 && !next.some((variant) => variant.isDefault)) {
      next[0] = {
        ...next[0],
        isDefault: true,
      };
    }

    onChange(next);
  }

  return (
    <div className="space-y-5">
      {value.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#DCD2C3] bg-[#FDFBF7] p-6 text-center">
          <p className="text-sm text-[#6D756E]">
            No variants have been added yet.
          </p>

          <button
            type="button"
            onClick={addVariant}
            className="button button-solid mt-4"
          >
            <Plus size={16} />
            Add first variant
          </button>
        </div>
      )}

      {value.map((variant, index) => (
        <div
          key={variant.id ?? `variant-${index}`}
          className="surface-white rounded-2xl border border-[#DCD2C3] p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Variant {index + 1}</p>

              <h3 className="mt-1 text-xl font-medium text-[#242B27]">
                {variant.label || "New variant"}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => removeVariant(index)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#DCD2C3] text-[#6D756E] transition hover:border-red-300 hover:text-red-600"
              aria-label={`Remove variant ${index + 1}`}
            >
              <Trash2 size={17} />
            </button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div>
              <label className="label">Variant label</label>

              <input
                type="text"
                value={variant.label}
                onChange={(event) =>
                  updateVariant(index, {
                    label: event.target.value,
                  })
                }
                placeholder="50ml"
                className="field"
              />
            </div>

            <div>
              <label className="label">Volume (ml)</label>

              <input
                type="number"
                min="0"
                step="1"
                value={variant.volumeMl}
                onChange={(event) =>
                  updateVariant(index, {
                    volumeMl: event.target.value,
                  })
                }
                placeholder="50"
                className="field"
              />
            </div>

            <div>
              <label className="label">Variant SKU</label>

              <input
                type="text"
                value={variant.sku}
                onChange={(event) =>
                  updateVariant(index, {
                    sku: event.target.value,
                  })
                }
                placeholder="PRODUCT-50ML"
                className="field"
              />
            </div>
          </div>

          <label className="mt-4 flex items-center gap-2 text-sm text-[#242B27]">
            <input
              type="checkbox"
              checked={variant.isDefault}
              onChange={() => setDefault(index)}
              className="h-4 w-4 accent-[#174D3D]"
            />
            Default variant
          </label>

          <div className="mt-6">
            <div className="mb-3">
              <p className="text-sm font-medium text-[#242B27]">
                Regional pricing & availability
              </p>

              <p className="mt-1 text-xs text-[#6D756E]">
                Prices are manually maintained for each region.
              </p>
            </div>

            <RegionalPriceEditor
              regions={regions}
              value={variant.prices}
              onChange={(prices) => updatePrices(index, prices)}
            />
          </div>
        </div>
      ))}

      {value.length > 0 && (
        <button type="button" onClick={addVariant} className="button">
          <Plus size={16} />
          Add another variant
        </button>
      )}
    </div>
  );
}
