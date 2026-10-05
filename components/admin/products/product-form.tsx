"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import VariantEditor, { type VariantValue } from "./variant-editor";
import { createProduct, updateProduct } from "@/lib/admin/products";
import type { ProductInput } from "@/lib/validation/product";
import MediaEditor from "./media-editor";
import type { ProductImageValue } from "./media-editor";
import { RelationshipsEditor } from "./relationships-editor";

type BrandOption = {
  id: string;
  name: string;
};

type RegionOption = {
  id: string;
  code: string;
  name: string;
  currency: string | null;
};

type ExistingProduct = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  brandId: string;
  shortDescription: string;
  description: string | null;
  gender: "MEN" | "WOMEN" | "UNISEX";
  fragranceFamily: string | null;
  concentration: string | null;
  countryOfOrigin: string | null;
  manufacturer: string | null;
  ingredients: string | null;
  longevity: string | null;
  sillage: string | null;
  season: string | null;
  occasion: string | null;
  videoUrl: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  variants: Array<{
    id: string;
    label: string;
    volumeMl: number | null;
    sku: string;
    isDefault: boolean;
    prices: Array<{
      regionId: string;
      available: boolean;
      price: string | number | null;
      originalPrice: string | number | null;
    }>;
  }>;
  images: Array<{
    id: string;
    url: string;
    alt: string | null;
    sortOrder: number;
  }>;
  categories: Array<{ categoryId: string }>;
  tags: Array<{ tagId: string }>;
  notes: Array<{ noteId: string; layer: "TOP" | "HEART" | "BASE" }>;
  relatedFrom: Array<{ relatedProductId: string }>;
};

type Props = {
  mode: "create" | "edit";
  brands: BrandOption[];
  regions: RegionOption[];
  categories: BrandOption[];
  tags: BrandOption[];
  notes: BrandOption[];
  products: Array<BrandOption & { brandName: string }>;
  product?: ExistingProduct;
};

const emptyProduct: ProductInput = {
  name: "",
  slug: "",
  sku: "",
  brandId: "",
  shortDescription: "",
  description: "",
  gender: "UNISEX",
  fragranceFamily: "",
  concentration: "",
  countryOfOrigin: "",
  manufacturer: "",
  ingredients: "",
  longevity: "",
  sillage: "",
  season: "",
  occasion: "",
  videoUrl: "",
  status: "DRAFT",
  featured: false,
  bestSeller: false,
  newArrival: false,
  variants: [],
  images: [],
  categoryIds: [],
  tagIds: [],
  notes: [],
  relatedProductIds: [],
};

function toPriceString(value: string | number | null) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

export default function ProductForm({ mode, brands, regions, categories, tags, notes, products, product }: Props) {
  const router = useRouter();

  const initialProduct = useMemo<ProductInput>(() => {
    if (!product) {
      return emptyProduct;
    }

    return {
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      brandId: product.brandId,
      shortDescription: product.shortDescription,
      description: product.description ?? "",
      gender: product.gender,
      fragranceFamily: product.fragranceFamily ?? "",
      concentration: product.concentration ?? "",
      countryOfOrigin: product.countryOfOrigin ?? "",
      manufacturer: product.manufacturer ?? "",
      ingredients: product.ingredients ?? "",
      longevity: product.longevity ?? "",
      sillage: product.sillage ?? "",
      season: product.season ?? "",
      occasion: product.occasion ?? "",
      videoUrl: product.videoUrl ?? "",
      status: product.status,
      featured: product.featured,
      bestSeller: product.bestSeller,
      newArrival: product.newArrival,

      variants: product.variants.map(
        (variant): VariantValue => ({
          id: variant.id,
          label: variant.label,
          volumeMl: variant.volumeMl === null ? "" : String(variant.volumeMl),
          sku: variant.sku,
          isDefault: variant.isDefault,

          prices: regions.map((region) => {
            const savedPrice = variant.prices.find(
              (price) => price.regionId === region.id,
            );

            return {
              regionId: region.id,
              available: savedPrice?.available ?? true,
              price: toPriceString(savedPrice?.price ?? null),
              originalPrice: toPriceString(savedPrice?.originalPrice ?? null),
            };
          }),
        }),
      ),
      images: product.images
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(
          (image): ProductImageValue => ({
            url: image.url,
            alt: image.alt ?? "",
          }),
        ),
      categoryIds: product.categories.map((item) => item.categoryId),
      tagIds: product.tags.map((item) => item.tagId),
      notes: product.notes,
      relatedProductIds: product.relatedFrom.map((item) => item.relatedProductId),
    };
  }, [product, regions]);

  const [form, setForm] = useState<ProductInput>(initialProduct);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof ProductInput>(
    field: K,
    value: ProductInput[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function handleNameChange(value: string) {
    setForm((current) => ({
      ...current,
      name: value,

      ...(mode === "create" && !current.slug
        ? {
            slug: generateSlug(value),
          }
        : {}),
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      const submittedForm: ProductInput = {
        ...form,
        images: form.images.filter((image) => image.url.trim().length > 0),
      };

      if (mode === "create") {
        await createProduct(submittedForm);
      } else {
        await updateProduct(product!.id, submittedForm);
      }

      router.push("/admin/products");

      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to save product.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="surface-white rounded-2xl border border-[#DCD2C3] p-6">
        <div>
          <p className="eyebrow">Product identity</p>

          <h2 className="display mt-2 text-3xl text-[#242B27]">
            Core information
          </h2>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label className="label">Product name</label>

            <input
              required
              type="text"
              value={form.name}
              onChange={(event) => handleNameChange(event.target.value)}
              className="field"
              placeholder="Oud Royale"
            />
          </div>

          <div>
            <label className="label">Brand</label>

            <select
              required
              value={form.brandId}
              onChange={(event) => updateField("brandId", event.target.value)}
              className="field"
            >
              <option value="">Select a brand</option>

              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Product SKU</label>

            <input
              required
              type="text"
              value={form.sku}
              onChange={(event) => updateField("sku", event.target.value)}
              className="field"
              placeholder="FRAG-OUD-001"
            />
          </div>

          <div>
            <label className="label">Slug</label>

            <input
              required
              type="text"
              value={form.slug}
              onChange={(event) => updateField("slug", event.target.value)}
              className="field"
              placeholder="oud-royale"
            />
          </div>

          <div>
            <label className="label">Gender</label>

            <select
              value={form.gender}
              onChange={(event) =>
                updateField(
                  "gender",
                  event.target.value as ProductInput["gender"],
                )
              }
              className="field"
            >
              <option value="MEN">Men</option>

              <option value="WOMEN">Women</option>

              <option value="UNISEX">Unisex</option>
            </select>
          </div>

          <div>
            <label className="label">Status</label>

            <select
              value={form.status}
              onChange={(event) =>
                updateField(
                  "status",
                  event.target.value as ProductInput["status"],
                )
              }
              className="field"
            >
              <option value="DRAFT">Draft</option>

              <option value="PUBLISHED">Published</option>

              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        <div className="mt-5">
          <label className="label">Short description</label>

          <textarea
            required
            rows={3}
            value={form.shortDescription}
            onChange={(event) =>
              updateField("shortDescription", event.target.value)
            }
            className="field min-h-28"
            placeholder="A concise description for catalogue cards and product summaries."
          />
        </div>

        <div className="mt-5">
          <label className="label">Full description</label>

          <textarea
            rows={7}
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            className="field min-h-40"
            placeholder="Detailed fragrance description."
          />
        </div>
      </section>

      <RelationshipsEditor categories={categories} tags={tags} notes={notes} products={products.filter((item) => item.id !== product?.id)} value={{ categoryIds: form.categoryIds, tagIds: form.tagIds, notes: form.notes, relatedProductIds: form.relatedProductIds }} onChange={(relationships) => setForm((current) => ({ ...current, ...relationships }))} />

      <section className="surface-white rounded-2xl border border-[#DCD2C3] p-6">
        <p className="eyebrow">Fragrance identity</p>

        <h2 className="display mt-2 text-3xl text-[#242B27]">
          Fragrance details
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label className="label">Fragrance family</label>

            <input
              type="text"
              value={form.fragranceFamily}
              onChange={(event) =>
                updateField("fragranceFamily", event.target.value)
              }
              className="field"
              placeholder="Woody Amber"
            />
          </div>

          <div>
            <label className="label">Concentration</label>

            <input
              type="text"
              value={form.concentration}
              onChange={(event) =>
                updateField("concentration", event.target.value)
              }
              className="field"
              placeholder="Eau de Parfum"
            />
          </div>

          <div>
            <label className="label">Country of origin</label>

            <input
              type="text"
              value={form.countryOfOrigin}
              onChange={(event) =>
                updateField("countryOfOrigin", event.target.value)
              }
              className="field"
              placeholder="France"
            />
          </div>

          <div>
            <label className="label">Manufacturer</label>

            <input
              type="text"
              value={form.manufacturer}
              onChange={(event) =>
                updateField("manufacturer", event.target.value)
              }
              className="field"
              placeholder="Manufacturer"
            />
          </div>

          <div>
            <label className="label">Longevity</label>

            <input
              type="text"
              value={form.longevity}
              onChange={(event) => updateField("longevity", event.target.value)}
              className="field"
              placeholder="8–10 hours"
            />
          </div>

          <div>
            <label className="label">Sillage</label>

            <input
              type="text"
              value={form.sillage}
              onChange={(event) => updateField("sillage", event.target.value)}
              className="field"
              placeholder="Moderate"
            />
          </div>

          <div>
            <label className="label">Season</label>

            <input
              type="text"
              value={form.season}
              onChange={(event) => updateField("season", event.target.value)}
              className="field"
              placeholder="Autumn, Winter"
            />
          </div>

          <div>
            <label className="label">Occasion</label>

            <input
              type="text"
              value={form.occasion}
              onChange={(event) => updateField("occasion", event.target.value)}
              className="field"
              placeholder="Evening, Formal"
            />
          </div>
        </div>

        <div className="mt-5">
          <label className="label">Ingredients</label>

          <textarea
            rows={5}
            value={form.ingredients}
            onChange={(event) => updateField("ingredients", event.target.value)}
            className="field"
            placeholder="Ingredients or composition information."
          />
        </div>

        <div className="mt-5">
          <label className="label">Product video URL</label>

          <input
            type="url"
            value={form.videoUrl}
            onChange={(event) => updateField("videoUrl", event.target.value)}
            className="field"
            placeholder="https://..."
          />
        </div>
      </section>

      <section className="surface-white rounded-2xl border border-[#DCD2C3] p-6">
        <p className="eyebrow">Product photography</p>

        <h2 className="display mt-2 text-3xl text-[#242B27]">Images & media</h2>

        <p className="mt-2 text-sm leading-6 text-[#6D756E]">
          Add product images, set alternative text, and choose which image
          appears first in the gallery.
        </p>

        <div className="mt-6">
          <MediaEditor
            value={form.images}
            onChange={(images) => updateField("images", images)}
          />
        </div>
      </section>

      <section className="surface-white rounded-2xl border border-[#DCD2C3] p-6">
        <div>
          <p className="eyebrow">Catalogue variants</p>

          <h2 className="display mt-2 text-3xl text-[#242B27]">
            Sizes & regional pricing
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6D756E]">
            Create the actual bottle sizes for this product and maintain pricing
            and availability separately for each region.
          </p>
        </div>

        <div className="mt-6">
          <VariantEditor
            regions={regions}
            value={form.variants}
            onChange={(variants) => updateField("variants", variants)}
          />
        </div>
      </section>

      <section className="surface-white rounded-2xl border border-[#DCD2C3] p-6">
        <p className="eyebrow">Catalogue visibility</p>

        <h2 className="display mt-2 text-3xl text-[#242B27]">Product flags</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#DCD2C3] bg-[#FDFBF7] p-4 text-sm text-[#242B27]">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) =>
                updateField("featured", event.target.checked)
              }
              className="h-4 w-4 accent-[#174D3D]"
            />
            Featured product
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#DCD2C3] bg-[#FDFBF7] p-4 text-sm text-[#242B27]">
            <input
              type="checkbox"
              checked={form.bestSeller}
              onChange={(event) =>
                updateField("bestSeller", event.target.checked)
              }
              className="h-4 w-4 accent-[#174D3D]"
            />
            Best seller
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#DCD2C3] bg-[#FDFBF7] p-4 text-sm text-[#242B27]">
            <input
              type="checkbox"
              checked={form.newArrival}
              onChange={(event) =>
                updateField("newArrival", event.target.checked)
              }
              className="h-4 w-4 accent-[#174D3D]"
            />
            New arrival
          </label>
        </div>
      </section>

      <div className="sticky bottom-4 z-20 flex justify-end">
        <div className="rounded-2xl border border-[#DCD2C3] bg-[#F6F1E8]/95 p-2 shadow-lg backdrop-blur">
          <button
            type="submit"
            disabled={saving}
            className="button button-solid min-w-40"
          >
            {saving
              ? "Saving..."
              : mode === "create"
                ? "Create product"
                : "Save changes"}
          </button>
        </div>
      </div>
    </form>
  );
}
