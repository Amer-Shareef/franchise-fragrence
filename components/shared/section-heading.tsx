import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type SectionHeadingProps = {
  label: string;
  title: string;
  description?: string;
  href?: string;
};

export function SectionHeading({
  label,
  title,
  description,
  href = "/perfumes",
}: SectionHeadingProps) {
  return (
    <div className="page-shell flex flex-col gap-5 pb-10 pt-20 sm:pb-12 sm:pt-24 md:flex-row md:items-end md:justify-between">
      <div className="max-w-xl">
        <p className="eyebrow">{label}</p>

        <h2 className="display mt-3 text-4xl leading-[0.95] text-[#242b27] sm:text-5xl lg:text-6xl">
          {title}
        </h2>

        {description && (
          <p className="mt-4 max-w-md text-sm leading-7 text-[#6d756e]">
            {description}
          </p>
        )}
      </div>

      <Link
        href={href}
        className="group inline-flex w-fit items-center gap-3 border-b border-[#b6a58a] pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#174d3d] transition-colors duration-300 hover:border-[#174d3d]"
      >
        View all
        <ArrowUpRight
          size={14}
          strokeWidth={1.5}
          className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </Link>
    </div>
  );
}
