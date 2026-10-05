import Link from "next/link";
import { CatalogManager } from "@/components/admin/catalog/catalog-manager";
import { getCatalogItems } from "@/lib/admin/catalog";

const tabs = ["categories", "notes", "tags"] as const;
type Tab = (typeof tabs)[number];

export default async function AdminCatalogPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const requested = (await searchParams).tab;
  const tab: Tab = tabs.includes(requested as Tab) ? (requested as Tab) : "categories";
  const catalogue = await getCatalogItems();
  const kind = tab === "categories" ? "category" : tab === "notes" ? "note" : "tag";
  const items = catalogue[tab];

  return (
    <div>
      <p className="eyebrow">Catalogue</p>

      <h1 className="display mt-2 text-4xl">Catalogue data</h1>

      <nav className="mt-7 flex gap-5 border-b border-[#DCD2C3]" aria-label="Catalogue sections">
        {tabs.map((item) => <Link key={item} href={`/admin/catalog?tab=${item}`} aria-current={tab === item ? "page" : undefined} className={`border-b-2 px-1 pb-3 text-sm capitalize ${tab === item ? "border-[#174D3D] text-[#174D3D]" : "border-transparent text-[#6D756E]"}`}>{item}</Link>)}
      </nav>
      <div className="mt-6"><CatalogManager kind={kind} items={items} /></div>
    </div>
  );
}
