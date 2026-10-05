import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";

const collections = [
  {
    name: "Men",
    copy: "Composed, distinct, enduring.",
    accent: "#315146",
    href: "/men",
  },
  {
    name: "Women",
    copy: "Radiance in every expression.",
    accent: "#645261",
    href: "/women",
  },
  {
    name: "Unisex",
    copy: "Scent without convention.",
    accent: "#5b583f",
    href: "/unisex",
  },
];

export function CollectionSection() {
  return (
    <section className="border-y border-[#dcd2c3] bg-[#eae1d2]">
      <div className="page-shell py-20 sm:py-24">
        <div className="mb-10 max-w-xl">
          <p className="eyebrow">Find your expression</p>

          <h2 className="display mt-3 text-4xl leading-none text-[#242b27] sm:text-5xl">
            Fragrance for
            <br />
            every identity.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {collections.map((item) => (
            <Link
              href={item.href}
              key={item.name}
              className="collection-card group relative overflow-hidden rounded-sm"
            >
              <div className="aspect-[0.9/1] overflow-hidden">
                <ImagePlaceholder
                  label={item.name}
                  accent={item.accent}
                  className="h-full w-full rounded-none transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0d352b] via-[#0d352b]/80 to-transparent px-6 pb-6 pt-20">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <h3 className="display text-3xl text-white sm:text-4xl">
                      {item.name}
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-white/75">
                      {item.copy}
                    </p>
                  </div>

                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/40 text-white transition-colors duration-300 group-hover:bg-white group-hover:text-[#174d3d]">
                    <ArrowUpRight size={16} strokeWidth={1.5} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
