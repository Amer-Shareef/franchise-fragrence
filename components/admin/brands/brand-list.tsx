"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { deleteBrand } from "@/lib/admin/brands";

type BrandRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: { products: number };
};

export function BrandList({ brands }: { brands: BrandRow[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return brands.filter((brand) => !search || `${brand.name} ${brand.slug}`.toLowerCase().includes(search));
  }, [brands, query]);

  async function remove(brand: BrandRow) {
    if (!window.confirm(`Delete ${brand.name}?`)) return;
    setPendingId(brand.id);
    setError("");

    try {
      await deleteBrand(brand.id);
      router.refresh();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to delete brand.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="surface rounded-sm p-4">
        <label className="sr-only" htmlFor="brand-search">Search brands</label>
        <div className="flex items-center gap-3">
          <Search size={17} className="text-[#6D756E]" />
          <input id="brand-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search brands" className="min-h-11 flex-1 bg-transparent text-sm outline-none" />
        </div>
      </div>

      {error && <p role="alert" className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="overflow-hidden rounded-sm border border-[#DCD2C3] bg-white">
        {filtered.map((brand) => (
          <div key={brand.id} className="flex items-center gap-4 border-b border-[#DCD2C3] px-5 py-4 last:border-b-0">
            <div className="min-w-0 flex-1">
              <Link href={`/admin/brands/${brand.id}`} className="font-[family-name:var(--font-display)] text-xl text-[#242B27] hover:text-[#174D3D]">{brand.name}</Link>
              <p className="mt-1 truncate text-xs text-[#6D756E]">/{brand.slug}{brand.description ? ` · ${brand.description}` : ""}</p>
            </div>
            <span className="shrink-0 text-xs text-[#6D756E]">{brand._count.products} products</span>
            <button type="button" disabled={pendingId === brand.id || brand._count.products > 0} onClick={() => remove(brand)} aria-label={`Delete ${brand.name}`} title={brand._count.products > 0 ? "Move or delete products first" : "Delete brand"} className="grid h-9 w-9 shrink-0 place-items-center text-[#8B5E5E] disabled:cursor-not-allowed disabled:opacity-30">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {filtered.length === 0 && <p className="px-5 py-12 text-center text-sm text-[#6D756E]">No brands found.</p>}
      </div>
    </div>
  );
}
