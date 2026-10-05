"use client";

import { useMemo, useState } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { deleteCatalogItem, saveCatalogItem, type CatalogItemInput, type CatalogItemKind } from "@/lib/admin/catalog";

type Item = { id: string; name: string; slug: string; description?: string | null; _count: { products: number } };

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function CatalogManager({ kind, items }: { kind: CatalogItemKind; items: Item[] }) {
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Item | null>(null);
  const [form, setForm] = useState<CatalogItemInput>({ name: "", slug: "", description: "" });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const label = kind === "category" ? "Category" : kind === "note" ? "Note" : "Tag";
  const results = useMemo(() => items.filter((item) => `${item.name} ${item.slug}`.toLowerCase().includes(query.trim().toLowerCase())), [items, query]);

  function edit(item: Item | null) {
    setEditing(item);
    setForm(item ? { name: item.name, slug: item.slug, description: item.description ?? "" } : { name: "", slug: "", description: "" });
    setError("");
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      await saveCatalogItem(kind, editing?.id ?? null, form);
      edit(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : `Unable to save ${label.toLowerCase()}.`);
    } finally { setPending(false); }
  }

  async function remove(item: Item) {
    if (!window.confirm(`Delete ${item.name}?`)) return;
    setPending(true);
    setError("");
    try { await deleteCatalogItem(kind, item.id); }
    catch (caught) { setError(caught instanceof Error ? caught.message : `Unable to delete ${label.toLowerCase()}.`); }
    finally { setPending(false); }
  }

  return <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
    <div className="space-y-4">
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${label.toLowerCase()}s`} className="field max-w-md" />
      {error && <p role="alert" className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <div className="overflow-hidden rounded-sm border border-[#DCD2C3] bg-white">
        {results.map((item) => <div key={item.id} className="flex items-center gap-3 border-b border-[#DCD2C3] px-5 py-4 last:border-b-0">
          <div className="min-w-0 flex-1"><p className="font-medium text-[#242B27]">{item.name}</p><p className="text-xs text-[#6D756E]">/{item.slug}{item.description ? ` · ${item.description}` : ""}</p></div>
          <span className="text-xs text-[#6D756E]">{item._count.products} products</span>
          <button type="button" onClick={() => edit(item)} aria-label={`Edit ${item.name}`} className="grid h-9 w-9 place-items-center text-[#174D3D]"><Edit3 size={16} /></button>
          <button type="button" disabled={pending || item._count.products > 0} title={item._count.products ? "Remove product assignments first" : "Delete"} onClick={() => remove(item)} aria-label={`Delete ${item.name}`} className="grid h-9 w-9 place-items-center text-[#8B5E5E] disabled:opacity-30"><Trash2 size={16} /></button>
        </div>)}
        {!results.length && <p className="px-5 py-12 text-center text-sm text-[#6D756E]">No {label.toLowerCase()}s found.</p>}
      </div>
    </div>
    <form onSubmit={submit} className="surface-white h-fit rounded-sm border border-[#DCD2C3] p-5">
      <div className="flex items-center justify-between"><h2 className="display text-2xl text-[#242B27]">{editing ? `Edit ${label.toLowerCase()}` : `Add ${label.toLowerCase()}`}</h2>{editing && <button type="button" onClick={() => edit(null)} className="text-xs text-[#174D3D]">Cancel</button>}</div>
      <div className="mt-5 space-y-4"><div><label className="label">Name</label><input required value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value, ...(!editing && !current.slug ? { slug: slugify(event.target.value) } : {}) }))} className="field" /></div><div><label className="label">Slug</label><input required value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} className="field" /></div>{kind === "category" && <div><label className="label">Description</label><textarea rows={5} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="field" /></div>}</div>
      <button type="submit" disabled={pending} className="button button-solid mt-5"><Plus size={16} />{pending ? "Saving..." : editing ? `Save ${label.toLowerCase()}` : `Add ${label.toLowerCase()}`}</button>
    </form>
  </div>;
}
