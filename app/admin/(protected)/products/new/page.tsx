import ProductForm from "@/components/admin/products/product-form";
import { getProductFormOptions } from "@/lib/admin/products";

export default async function NewProductPage() {
  const { brands, regions, categories, tags, notes, products } = await getProductFormOptions();

  return (
    <div>
      <p className="eyebrow">Catalogue</p>

      <h1 className="display mt-2 text-4xl text-[#242B27]">New product</h1>

      <p className="mt-2 text-sm text-[#6D756E]">
        Create a new fragrance for the catalogue.
      </p>

      <div className="mt-8">
        <ProductForm mode="create" brands={brands} regions={regions} categories={categories} tags={tags} notes={notes} products={products} />
      </div>
    </div>
  );
}
