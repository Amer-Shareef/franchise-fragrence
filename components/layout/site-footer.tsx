import Link from "next/link";
import { ArrowUpRight, Camera, Mail } from "lucide-react";

const groups = [
  {
    title: "Discover",
    links: [
      { label: "Shop fragrances", href: "/perfumes" },
      { label: "Our brands", href: "/brands" },
      { label: "Fragrance guide", href: "/fragrance-guide" },
      { label: "Brand stories", href: "/brand-stories" },
    ],
  },
  {
    title: "Maison",
    links: [
      { label: "About us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Information",
    links: [
      { label: "Privacy policy", href: "/privacy-policy" },
      { label: "Terms & conditions", href: "/terms" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[#dcd2c3] bg-[#0d352b] text-[#f6f1e8]">
      {/* Main footer */}
      <div className="page-shell grid gap-14 py-10 lg:grid-cols-[1.15fr_1.85fr] lg:gap-20">
        {/* Brand introduction */}
        <div className="max-w-sm">
          <Link
            href="/"
            className="group inline-block"
            aria-label="Franchise Fragrence home"
          >
            <div className="logo-script text-[2.3rem] leading-none text-[#f6f1e8] transition-colors duration-300 group-hover:text-[#d6c5a9] sm:text-[2.7rem]">
              Franchise
            </div>

            <div className="text-[10px] tracking-[0.38em] text-[#eae1d2]">
              FRAGRENCE
            </div>
          </Link>

          <p className="mt-7 max-w-xs text-sm leading-7 text-[#c2ccc5]">
            A considered world of exceptional fragrance, made for the rituals
            that become yours.
          </p>

          <Link
            href="/perfumes"
            className="group mt-7 inline-flex items-center gap-3 border-b border-[#b6a58a] pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#f6f1e8] transition-colors duration-300 hover:border-[#f6f1e8]"
          >
            Explore the collection
            <ArrowUpRight
              size={14}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* Navigation links */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3">
          {groups.map((group) => (
            <div key={group.title}>
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b6a58a]">
                {group.title}
              </p>

              <div className="flex flex-col items-start gap-3">
                {group.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-[#d5ddd7] transition-colors duration-300 hover:text-[#f6f1e8]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact strip */}
      <div className="border-t border-[#315548]">
        <div className="page-shell flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Mail size={16} strokeWidth={1.4} className="text-[#b6a58a]" />

            <a
              href="mailto:hello@franchisefragrence.com"
              className="text-xs text-[#c2ccc5] transition-colors hover:text-[#f6f1e8]"
            >
              hello@franchisefragrence.com
            </a>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#"
              aria-label="Instagram"
              className="text-[#c2ccc5] transition-colors hover:text-[#f6f1e8]"
            >
              <Camera size={17} strokeWidth={1.4} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-[#315548]">
        <div className="page-shell flex flex-col gap-2 py-3 text-[10px] tracking-[0.04em] text-[#aebdb4] sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Franchise Fragrence</span>
          <span>Curated with intention.</span>
        </div>
      </div>
    </footer>
  );
}
