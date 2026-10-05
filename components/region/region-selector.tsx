"use client";

import { Check, ChevronDown, Globe2 } from "lucide-react";
import { useState } from "react";
import { regions } from "@/config/regions";
import type { RegionCode } from "@/types/product";

export function RegionSelector({
  initialRegion,
}: {
  initialRegion: RegionCode;
}) {
  const [region, setRegion] = useState<RegionCode>(initialRegion);
  const [open, setOpen] = useState(false);

  const selected = regions.find((item) => item.code === region);

  function select(value: RegionCode) {
    // eslint-disable-next-line react-hooks/immutability -- intentional browser cookie persistence
    document.cookie = `ff-region=${value}; path=/; max-age=31536000; samesite=lax`;
    setRegion(value);
    setOpen(false);
    window.dispatchEvent(new Event("regionchange"));
  }

  function getRegionCode(code: RegionCode) {
    if (code === "LK") return "LK";
    if (code === "AE") return "AE";
    return null;
  }

  const selectedCode = getRegionCode(region);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex items-center gap-1.5 text-sm text-[#242b27] transition-colors duration-300 hover:text-[#174d3d]"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Selected region: ${selected?.label ?? "International"}`}
      >
        {selectedCode ? (
          <span className="text-[11px] font-semibold tracking-[0.08em]">
            {selectedCode}
          </span>
        ) : (
          <Globe2 size={17} strokeWidth={1.5} />
        )}

        <ChevronDown
          size={13}
          strokeWidth={1.5}
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <>
          {/* Close dropdown when clicking outside */}
          <button
            type="button"
            aria-label="Close region selector"
            className="fixed inset-0 z-40 cursor-default lg:hidden"
            onClick={() => setOpen(false)}
          />

          <div
            className="absolute right-0 top-8 z-50 w-64 rounded-sm border border-[#dcd2c3] bg-[#f6f1e8] p-2 shadow-[0_15px_45px_rgba(36,43,39,0.12)]"
            role="menu"
          >
            <p className="px-3 py-3 text-[10px] font-semibold tracking-[0.18em] text-[#6d756e]">
              SELECT YOUR REGION
            </p>

            {regions.map((item) => {
              const active = item.code === region;

              return (
                <button
                  type="button"
                  key={item.code}
                  role="menuitem"
                  onClick={() => select(item.code)}
                  className={`flex w-full items-center gap-3 rounded-sm px-3 py-3 text-left transition-colors duration-200 ${
                    active
                      ? "bg-[#eae1d2] text-[#174d3d]"
                      : "text-[#242b27] hover:bg-[#eae1d2] hover:text-[#174d3d]"
                  }`}
                >
                  {item.code === "LK" ? (
                    <span className="w-5 text-center text-[10px] font-semibold">
                      LK
                    </span>
                  ) : item.code === "AE" ? (
                    <span className="w-5 text-center text-[10px] font-semibold">
                      AE
                    </span>
                  ) : (
                    <Globe2 size={16} strokeWidth={1.5} />
                  )}

                  <span className="flex-1 text-sm">{item.label}</span>

                  {item.currency && (
                    <span className="text-xs text-[#6d756e]">
                      {item.currency}
                    </span>
                  )}

                  {active && <Check size={14} strokeWidth={1.8} />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
