import Link from "next/link";
import { Plus } from "lucide-react";
import { BrandList } from "@/components/admin/brands/brand-list";
import { getAdminBrands } from "@/lib/admin/brands";

export default async function AdminBrandsPage() {
  const brands = await getAdminBrands();

  return (
    <div>
      <p className="eyebrow">Catalogue</p>

      <h1 className="display mt-2 text-4xl">Brands</h1>

      <div className="mt-6 flex justify-end">
        <Link href="/admin/brands/new" className="button button-solid"><Plus size={16} />Add brand</Link>
      </div>

      <div className="mt-5"><BrandList brands={brands} /></div>
    </div>
  );
}
