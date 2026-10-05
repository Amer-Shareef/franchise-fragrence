"use client";

import { Check, ChevronDown, Filter, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Facets = {
  brands: { name: string; slug: string }[];
  families: string[];
  notes: { name: string; slug: string }[];
  variants: string[];
};

const fields = [
  {
    key: "gender",
    label: "Gender",
    values: [
      ["MEN", "Men"],
      ["WOMEN", "Women"],
      ["UNISEX", "Unisex"],
    ],
  },
  {
    key: "availability",
    label: "Availability",
    values: [["available", "Available now"]],
  },
] as const;

export function CatalogueFilters({ facets }: { facets: Facets }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);

  const [region, setRegion] = useState("LK");

  useEffect(() => {
    function updateRegion() {
      const regionCookie = document.cookie
        .split("; ")
        .find((item) => item.startsWith("ff-region="))
        ?.split("=")[1];

      setRegion(regionCookie || "LK");
    }

    updateRegion();

    window.addEventListener("regionchange", updateRegion);

    return () => {
      window.removeEventListener("regionchange", updateRegion);
    };
  }, []);

  const isInternational = region === "INTL";

  const currency = region === "AE" ? "AED" : region === "LK" ? "LKR" : "";

  const allFields = [
    ...fields,
    {
      key: "brand",
      label: "Brand",
      values: facets.brands.map((item) => [item.slug, item.name]),
    },
    {
      key: "family",
      label: "Fragrance family",
      values: facets.families.map((item) => [item, item]),
    },
    {
      key: "note",
      label: "Fragrance note",
      values: facets.notes.map((item) => [item.slug, item.name]),
    },
    {
      key: "size",
      label: "Size",
      values: facets.variants.map((item) => [item, item]),
    },
  ];

  const filterKeys = [
    "gender",
    "availability",
    "brand",
    "family",
    "note",
    "size",
    "minPrice",
    "maxPrice",
  ];

  const activeFilters = filterKeys.filter((key) => {
    return Boolean(params.get(key));
  });

  function change(key: string, value: string) {
    const next = new URLSearchParams(params);

    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }

    router.push(`${pathname}?${next.toString()}`);
  }

  function clear() {
    router.push(pathname);
  }

  return (
    <div className="catalogue-filter-wrapper mb-8">
      {/* Compact filter toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-y border-[#dcd2c3] py-4">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="group inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#174d3d] transition-colors duration-300 hover:text-[#0d352b]"
          aria-expanded={open}
          aria-controls="catalogue-filter-panel"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#b6a58a] transition-colors duration-300 group-hover:border-[#174d3d]">
            <Filter size={14} strokeWidth={1.5} />
          </span>
          Refine collection
          {activeFilters.length > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#174d3d] px-1.5 text-[9px] text-[#f6f1e8]">
              {activeFilters.length}
            </span>
          )}
          <ChevronDown
            size={14}
            className={`transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        <div className="flex items-center gap-4">
          <span className="hidden text-[10px] uppercase tracking-[0.12em] text-[#8b938c] sm:inline">
            Curated selection
          </span>

          {activeFilters.length > 0 && (
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#174d3d] transition-colors hover:text-[#0d352b]"
            >
              <X size={13} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Expandable filter panel */}
      {open && (
        <div
          id="catalogue-filter-panel"
          className="border-b border-[#dcd2c3] bg-[#eae1d2]/65 px-4 py-5 sm:px-6 sm:py-6"
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="eyebrow">Personalise your search</p>
              <h2 className="display mt-1 text-2xl text-[#242b27]">
                Find your fragrance
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close filters"
              className="text-[#6d756e] transition-colors hover:text-[#174d3d]"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {allFields.map((field) => (
              <label key={field.key} className="block">
                <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6d756e]">
                  {field.label}
                </span>

                <div className="relative">
                  <select
                    value={params.get(field.key) ?? ""}
                    onChange={(event) => change(field.key, event.target.value)}
                    className="w-full appearance-none rounded-sm border border-[#d5c9b8] bg-[#f6f1e8] px-3 py-3 pr-9 text-sm text-[#242b27] outline-none transition-colors duration-200 focus:border-[#174d3d] focus:ring-1 focus:ring-[#174d3d]/20"
                  >
                    <option value="">All {field.label.toLowerCase()}</option>

                    {field.values.map(([value, label]) => (
                      <option value={value} key={value}>
                        {label}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={14}
                    strokeWidth={1.5}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6d756e]"
                  />
                </div>
              </label>
            ))}
          </div>

          {/* Price range */}
          {!isInternational && (
            <div className="mt-6 max-w-2xl border-t border-[#d5c9b8] pt-5">
              <div className="mb-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6d756e]">
                    Price range
                  </p>

                  <p className="mt-1 text-xs text-[#8b938c]">
                    Choose your preferred budget
                  </p>
                </div>

                <span className="rounded-full border border-[#b6a58a] bg-[#f6f1e8] px-3 py-1 text-[10px] font-semibold tracking-[0.12em] text-[#174d3d]">
                  {currency}
                </span>
              </div>

              <div className="grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  ["minPrice", "Minimum price"],
                  ["maxPrice", "Maximum price"],
                ].map(([key, placeholder]) => (
                  <label key={key} className="relative block">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold tracking-[0.04em] text-[#8b938c]">
                      {currency}
                    </span>

                    <input
                      type="number"
                      min="0"
                      placeholder={placeholder}
                      defaultValue={params.get(key) ?? ""}
                      onBlur={(event) => change(key, event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          change(key, event.currentTarget.value);
                        }
                      }}
                      className="w-full rounded-sm border border-[#d5c9b8] bg-[#f6f1e8] py-3 pl-14 pr-3 text-sm text-[#242b27] outline-none transition-all duration-200 placeholder:text-[#a1aaa3] hover:border-[#b6a58a] focus:border-[#174d3d] focus:ring-1 focus:ring-[#174d3d]/15"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Active filter summary */}
          {activeFilters.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#d5c9b8] pt-4">
              <p className="flex items-center gap-2 text-xs text-[#6d756e]">
                <Check size={14} className="text-[#174d3d]" />
                {activeFilters.length} active filter
                {activeFilters.length === 1 ? "" : "s"}
              </p>

              <button
                type="button"
                onClick={clear}
                className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#174d3d] underline-offset-4 hover:underline"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
