"use client";

import type { ProductInput } from "@/lib/validation/product";

type Option = { id: string; name: string };
type ProductOption = Option & { brandName: string };
type Relationships = Pick<ProductInput, "categoryIds" | "tagIds" | "notes" | "relatedProductIds">;

export function RelationshipsEditor({ categories, tags, notes, products, value, onChange }: { categories: Option[]; tags: Option[]; notes: Option[]; products: ProductOption[]; value: Relationships; onChange: (value: Relationships) => void }) {
  function toggle(field: "categoryIds" | "tagIds" | "relatedProductIds", id: string) {
    const items = value[field];
    onChange({ ...value, [field]: items.includes(id) ? items.filter((item) => item !== id) : [...items, id] });
  }

  return <section className="surface-white rounded-2xl border border-[#DCD2C3] p-6">
    <p className="eyebrow">Catalogue links</p><h2 className="display mt-2 text-3xl text-[#242B27]">Relationships</h2>
    <div className="mt-6 grid gap-7 xl:grid-cols-2">
      <Group title="Categories" options={categories} selected={value.categoryIds} onToggle={(id) => toggle("categoryIds", id)} />
      <Group title="Tags" options={tags} selected={value.tagIds} onToggle={(id) => toggle("tagIds", id)} />
      <div><h3 className="text-sm font-medium text-[#242B27]">Fragrance notes</h3><div className="mt-3 max-h-56 space-y-2 overflow-y-auto">{notes.map((note) => <label key={note.id} className="flex items-center justify-between gap-3 border-b border-[#DCD2C3] pb-2 text-sm text-[#6D756E]"><span>{note.name}</span><select value={value.notes.find((item) => item.noteId === note.id)?.layer ?? ""} onChange={(event) => { const layer = event.target.value as "TOP" | "HEART" | "BASE" | ""; onChange({ ...value, notes: layer ? [...value.notes.filter((item) => item.noteId !== note.id), { noteId: note.id, layer }] : value.notes.filter((item) => item.noteId !== note.id) }); }} className="min-h-9 border border-[#DCD2C3] bg-white px-2 text-xs"><option value="">Not included</option><option value="TOP">Top</option><option value="HEART">Heart</option><option value="BASE">Base</option></select></label>)}</div></div>
      <Group title="Related products" options={products.map((item) => ({ ...item, name: `${item.name} · ${item.brandName}` }))} selected={value.relatedProductIds} onToggle={(id) => toggle("relatedProductIds", id)} />
    </div>
  </section>;
}

function Group({ title, options, selected, onToggle }: { title: string; options: Option[]; selected: string[]; onToggle: (id: string) => void }) {
  return <div><h3 className="text-sm font-medium text-[#242B27]">{title}</h3><div className="mt-3 max-h-56 space-y-2 overflow-y-auto">{options.map((option) => <label key={option.id} className="flex items-center gap-2 text-sm text-[#6D756E]"><input type="checkbox" checked={selected.includes(option.id)} onChange={() => onToggle(option.id)} className="h-4 w-4 accent-[#174D3D]" />{option.name}</label>)}</div></div>;
}
