import { notFound } from "next/navigation";
import { StoreLayout } from "@/components/layout/store-layout";
import { Catalogue } from "@/components/products/catalogue";
import { getPublishedProducts } from "@/lib/products/repository";
const labels = { men: "Men", women: "Women", unisex: "Unisex" } as const;
export default async function GenderPage({
  params,
}: {
  params: Promise<{ gender: string }>;
}) {
  const { gender } = await params;
  if (!(gender in labels)) notFound();
  const label = labels[gender as keyof typeof labels];
  const products = await getPublishedProducts({ gender: gender.toUpperCase() });
  return (
    <StoreLayout>
      <section className="page-shell py-16 sm:py-20">
        <p className="eyebrow">The collection</p>
        <h1 className="display mt-3 text-6xl">{label}&apos;s fragrances</h1>
        <p className="mt-5 max-w-xl leading-7 text-[#c7ccc9]">
          A refined edit made for every kind of presence.
        </p>
        <div className="mt-12">
          <Catalogue products={products} />
        </div>
      </section>
    </StoreLayout>
  );
}
