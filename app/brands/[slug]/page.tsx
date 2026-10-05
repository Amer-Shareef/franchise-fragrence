export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="page-shell section-spacing">
      <p className="eyebrow">Brand</p>

      <h1 className="display mt-2 text-5xl">{slug.replaceAll("-", " ")}</h1>
    </main>
  );
}
