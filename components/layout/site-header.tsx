"use client";

import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { RegionSelector } from "@/components/region/region-selector";
import type { RegionCode } from "@/types/product";

const links = [
  { href: "/perfumes", label: "Shop" },
  { href: "/men", label: "Men" },
  { href: "/women", label: "Women" },
  { href: "/unisex", label: "Unisex" },
  { href: "/brands", label: "Brands" },
  { href: "/fragrance-guide", label: "Fragrance Guide" },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader({ initialRegion }: { initialRegion: RegionCode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[#dcd2c3] bg-[#f6f1e8]/90 backdrop-blur-xl">
      <div className="page-shell relative flex min-h-[76px] items-center justify-between gap-4 py-3 sm:min-h-[84px] lg:gap-8">
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="group shrink-0"
          aria-label="Franchise Fragrence home"
        >
          <div className="logo-script text-[1.65rem] leading-none text-[#242b27] transition-colors duration-300 group-hover:text-[#174d3d] sm:text-[1.9rem] lg:text-[2.05rem]">
            Franchise
          </div>
          <div className="text-[0.62rem] tracking-[0.32em] text-[#242b27] sm:text-[0.7rem]">
            FRAGRENCE
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden items-center gap-6 lg:flex xl:gap-7"
          aria-label="Main navigation"
        >
          {links.map((link) => {
            const active = isActivePath(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`nav-link relative py-3 text-[12px] font-medium tracking-[0.09em] transition-colors duration-300 xl:text-[13px] ${
                  active
                    ? "text-[#174d3d]"
                    : "text-[#242b27] hover:text-[#174d3d]"
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-0 h-[1.5px] bg-[#174d3d] transition-all duration-300 ${
                    active ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-3 sm:gap-5">
          <Link
            href="/perfumes"
            aria-label="Search catalogue"
            className="hidden items-center text-[#242b27] transition-colors duration-300 hover:text-[#174d3d] md:flex"
          >
            <Search size={19} strokeWidth={1.6} />
          </Link>

          {/* Compact region display */}
          <RegionSelector initialRegion={initialRegion} />

          {/* Mobile menu button */}
          <button
            type="button"
            className="border-0 bg-transparent p-0 text-[#242b27] outline-none transition-colors duration-300 hover:text-[#174d3d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#174d3d] focus-visible:ring-offset-2 lg:hidden"
            onClick={() => setOpen((current) => !current)}
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? (
              <X size={23} strokeWidth={1.5} />
            ) : (
              <Menu size={23} strokeWidth={1.5} />
            )}
          </button>
        </div>

        {/* Mobile Navigation Overlay */}
        {open && (
          <>
            <button
              type="button"
              aria-label="Close mobile navigation"
              className="fixed inset-0 top-[76px] z-40 bg-[#242b27]/10 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
            />
            <nav
              id="mobile-navigation"
              className="absolute left-0 right-0 top-full border-t border-[#dcd2c3] bg-[#f6f1e8]/90 px-4 py-5 shadow-[0_18px_45px_rgba(36,43,39,0.08)] backdrop-blur-2xl lg:hidden"
              aria-label="Mobile navigation"
            >
              <div className="flex flex-col">
                {links.map((link) => {
                  const active = isActivePath(pathname, link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between border-b border-[#dcd2c3] px-2 py-4 text-[14px] tracking-[0.08em] transition-colors duration-300 ${
                        active
                          ? "border-l-2 border-l-[#174d3d] pl-4 font-semibold text-[#174d3d]"
                          : "text-[#242b27] hover:pl-4 hover:text-[#174d3d]"
                      }`}
                    >
                      <span>{link.label}</span>
                      {active && (
                        <span className="text-[10px] tracking-[0.15em]">
                          CURRENT
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </nav>
          </>
        )}
      </div>
    </header>
  );
}
