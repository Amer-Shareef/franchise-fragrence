"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrand, updateBrand } from "@/lib/admin/brands";
import type { BrandInput } from "@/lib/validation/brand";

type ExistingBrand = Omit<BrandInput, "description"> & {
  id: string;
  description: string | null;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function BrandForm({ brand }: { brand?: ExistingBrand }) {
  const router = useRouter();
  const [form, setForm] = useState<BrandInput>({
    name: brand?.name ?? "",
    slug: brand?.slug ?? "",
    description: brand?.description ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (brand) {
        await updateBrand(brand.id, form);
      } else {
        await createBrand(form);
      }

      router.push("/admin/brands");
      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error ? caughtError.message : "Unable to save brand.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-6">
      {error && (
        <p role="alert" className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <section className="surface-white rounded-sm border border-[#DCD2C3] p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="brand-name" className="label">Brand name</label>
            <input
              id="brand-name"
              required
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  name: event.target.value,
                  ...(brand || current.slug ? {} : { slug: slugify(event.target.value) }),
                }))
              }
              className="field"
              placeholder="Maison Example"
            />
          </div>

          <div>
            <label htmlFor="brand-slug" className="label">Slug</label>
            <input
              id="brand-slug"
              required
              value={form.slug}
              onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
              className="field"
              placeholder="maison-example"
            />
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="brand-description" className="label">Brand story</label>
          <textarea
            id="brand-description"
            rows={8}
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            className="field min-h-48"
            placeholder="Optional brand description for the storefront."
          />
        </div>
      </section>

      <button type="submit" disabled={saving} className="button button-solid">
        {saving ? "Saving..." : brand ? "Save brand" : "Create brand"}
      </button>
    </form>
  );
}
