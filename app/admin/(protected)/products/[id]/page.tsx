import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/products/product-form";
import { getAdminProduct, getProductFormOptions } from "@/lib/admin/products";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  const [product, options] = await Promise.all([
    getAdminProduct(id),
    getProductFormOptions(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <p className="eyebrow">Catalogue</p>

      <h1 className="display mt-2 text-4xl text-[#242B27]">Edit product</h1>

      <p className="mt-2 text-sm text-[#6D756E]">
        Update product information, variants and regional pricing.
      </p>

      <div className="mt-8">
        <ProductForm
          mode="edit"
          brands={options.brands}
          regions={options.regions}
          categories={options.categories}
          tags={options.tags}
          notes={options.notes}
          products={options.products}
          product={product}
        />
      </div>
    </div>
  );
}
