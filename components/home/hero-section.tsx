import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";

export function HeroSection() {
  return (
    <section className="hero-section relative overflow-hidden border-b border-[#dcd2c3] bg-[#f6f1e8]">
      {/* Decorative background elements */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full border border-[#b6a58a]/30"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-1/2 h-[360px] w-[360px] -translate-y-1/2 rounded-full border border-[#b6a58a]/20"
      />

      <div className="page-shell relative grid min-h-[calc(100svh-76px)] items-center gap-10 py-10 sm:py-14 md:grid-cols-[0.9fr_1.1fr] md:gap-12 md:py-12 lg:min-h-[calc(100svh-84px)] lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:py-16">
        {/* Editorial content */}
        <div className="relative z-10 flex flex-col items-start">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-[#174d3d]" />
            <p className="eyebrow">The art of considered fragrance</p>
          </div>

          <h1 className="display max-w-xl text-[clamp(3.5rem,7vw,6.8rem)] leading-[0.88] text-[#242b27]">
            A signature
            <br />
            <span className="italic text-[#174d3d]">uniquely yours.</span>
          </h1>

          <p className="mt-7 max-w-md text-sm leading-7 text-[#6d756e] sm:text-base">
            Discover a considered collection of exceptional fragrances, selected
            to express your presence and leave a lasting impression.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 sm:mt-10">
            <Link href="/perfumes" className="button button-solid group">
              Explore collection
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/fragrance-guide"
              className="group inline-flex items-center gap-2 border-b border-[#b6a58a] pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#174d3d] transition-colors duration-300 hover:border-[#174d3d]"
            >
              Discover your scent
              <ArrowUpRight
                size={13}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>

          {/* Supporting detail */}
          <div className="mt-10 flex items-center gap-5 border-t border-[#dcd2c3] pt-5 sm:mt-14">
            <div>
              <p className="display text-2xl text-[#174d3d]">01</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-[#6d756e]">
                Curated selection
              </p>
            </div>

            <div className="h-9 w-px bg-[#dcd2c3]" />

            <div>
              <p className="display text-2xl text-[#174d3d]">∞</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-[#6d756e]">
                Personal expression
              </p>
            </div>
          </div>
        </div>

        {/* Visual composition */}
        <div className="relative mx-auto w-full max-w-[560px] md:ml-auto">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-[#eae1d2]">
            <ImagePlaceholder
              label="The fragrance collection"
              accent="#174d3d"
              className="h-full w-full rounded-sm"
            />

            {/* Editorial frame */}
            <div className="pointer-events-none absolute inset-4 border border-white/30 sm:inset-6" />

            {/* Image label */}
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between sm:bottom-7 sm:left-7 sm:right-7">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/80">
                  Franchise Fragrence
                </p>
                <p className="display mt-1 text-2xl text-white sm:text-3xl">
                  The signature edit
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-white">
                <ArrowUpRight size={17} strokeWidth={1.4} />
              </div>
            </div>
          </div>

          {/* Floating detail card */}
          <div className="absolute -bottom-5 -left-3 border border-[#dcd2c3] bg-[#f6f1e8]/95 px-4 py-3 shadow-[0_10px_30px_rgba(36,43,39,0.08)] backdrop-blur-md sm:-left-7 sm:px-6 sm:py-4">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#6d756e]">
              Discover
            </p>
            <p className="display mt-1 text-xl text-[#174d3d] sm:text-2xl">
              Your next signature
            </p>
          </div>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <div className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-3 lg:flex">
        <span className="h-6 w-px bg-[#b6a58a]" />
        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#6d756e]">
          Explore
        </span>
      </div>
    </section>
  );
}
