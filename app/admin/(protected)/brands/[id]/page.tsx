import { notFound } from "next/navigation";
import { BrandForm } from "@/components/admin/brands/brand-form";
import { getAdminBrand } from "@/lib/admin/brands";

export default async function AdminBrandPage({ params }: { params: Promise<{ id: string }> }) {
  const brand = await getAdminBrand((await params).id);
  if (!brand) notFound();

  return (
    <div>
      <p className="eyebrow">Catalogue / Brands</p>

      <h1 className="display mt-2 text-5xl">Edit brand</h1>

      <p className="mt-2 text-sm text-[#6D756E]">{brand._count.products} products currently use this brand.</p>

      <div className="mt-8"><BrandForm brand={brand} /></div>
    </div>
  );
}
