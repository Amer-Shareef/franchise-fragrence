import Link from "next/link";
import { Plus } from "lucide-react";
import { getAdminProducts } from "@/lib/admin/products";
import { ProductList } from "@/components/admin/products/product-list";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Catalogue</p>

          <h1 className="display mt-2 text-5xl text-[#242B27]">Products</h1>

          <p className="mt-2 max-w-2xl text-sm text-[#6D756E]">
            Manage fragrances, publication status and catalogue information.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="button button-solid w-full sm:w-auto"
        >
          <Plus size={16} />
          Add product
        </Link>
      </div>

      <div className="mt-8">
        <ProductList products={products} />
      </div>
    </div>
  );
}
