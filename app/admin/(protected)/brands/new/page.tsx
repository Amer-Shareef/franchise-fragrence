import { BrandForm } from "@/components/admin/brands/brand-form";

export default function NewBrandPage() {
  return (
    <div>
      <p className="eyebrow">Catalogue / Brands</p>

      <h1 className="display mt-2 text-4xl">Add brand</h1>

      <div className="mt-8"><BrandForm /></div>
    </div>
  );
}
