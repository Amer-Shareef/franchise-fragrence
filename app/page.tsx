import { StoreLayout } from "@/components/layout/store-layout";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedFragrances } from "@/components/home/featured-fragrances";
import { CollectionSection } from "@/components/home/collection-section";
import { BestSellers } from "@/components/home/best-sellers";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { getPublishedProducts } from "@/lib/products/repository";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getPublishedProducts();

  return (
    <StoreLayout>
      <HeroSection />
      <FeaturedFragrances products={products} />
      <CollectionSection />
      <BestSellers products={products} />
      <WhyChooseUs />
    </StoreLayout>
  );
}
