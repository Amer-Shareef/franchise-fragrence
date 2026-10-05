"use client";

type RegionOption = {
  id: string;
  code: string;
  name: string;
  currency: string | null;
};

export type RegionalPriceValue = {
  regionId: string;
  available: boolean;
  price: string;
  originalPrice: string;
};

type Props = {
  regions: RegionOption[];
  value: RegionalPriceValue[];
  onChange: (value: RegionalPriceValue[]) => void;
};

export default function RegionalPriceEditor({
  regions,
  value,
  onChange,
}: Props) {
  function getPrice(regionId: string) {
    return (
      value.find((item) => item.regionId === regionId) ?? {
        regionId,
        available: true,
        price: "",
        originalPrice: "",
      }
    );
  }

  function updateRegion(
    regionId: string,
    changes: Partial<RegionalPriceValue>,
  ) {
    const current = getPrice(regionId);

    const next = value.some((item) => item.regionId === regionId)
      ? value.map((item) =>
          item.regionId === regionId
            ? {
                ...item,
                ...changes,
              }
            : item,
        )
      : [
          ...value,
          {
            ...current,
            ...changes,
          },
        ];

    onChange(next);
  }

  return (
    <div className="space-y-4">
      {regions.map((region) => {
        const price = getPrice(region.id);

        return (
          <div
            key={region.id}
            className="rounded-2xl border border-[#DCD2C3] bg-[#FDFBF7] p-4"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <div className="min-w-[150px] md:flex-1">
                <p className="text-sm font-medium text-[#242B27]">
                  {region.name}
                </p>

                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#6D756E]">
                  {region.code}
                  {region.currency ? ` · ${region.currency}` : " · No currency"}
                </p>
              </div>

              <div className="md:w-40">
                <label className="label">Price</label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price.price}
                  onChange={(event) =>
                    updateRegion(region.id, {
                      price: event.target.value,
                    })
                  }
                  placeholder={region.code === "INTL" ? "No price" : "0.00"}
                  className="field"
                />
              </div>

              <div className="md:w-40">
                <label className="label">Original price</label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price.originalPrice}
                  onChange={(event) =>
                    updateRegion(region.id, {
                      originalPrice: event.target.value,
                    })
                  }
                  placeholder="Optional"
                  className="field"
                />
              </div>

              <label className="flex min-h-10 items-center gap-2 text-sm text-[#242B27]">
                <input
                  type="checkbox"
                  checked={price.available}
                  onChange={(event) =>
                    updateRegion(region.id, {
                      available: event.target.checked,
                    })
                  }
                  className="h-4 w-4 accent-[#174D3D]"
                />
                Available
              </label>
            </div>

            {region.code === "INTL" && (
              <p className="mt-3 text-xs text-[#6D756E]">
                International pricing is not displayed on the public catalogue.
                This region is retained for availability and future catalogue
                logic.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
