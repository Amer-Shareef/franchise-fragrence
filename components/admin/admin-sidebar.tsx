"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Boxes,
  FileText,
  FolderTree,
  LayoutDashboard,
  Settings,
  ShoppingBag,
  Tags,
  X,
} from "lucide-react";
import { SignOutButton } from "@/components/admin/sign-out-button";

type AdminSidebarProps = {
  open: boolean;
  onClose: () => void;
};

const navigation = [
  {
    label: "OVERVIEW",
    items: [
      {
        label: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "CATALOGUE",
    items: [
      {
        label: "Products",
        href: "/admin/products",
        icon: ShoppingBag,
      },
      {
        label: "Brands",
        href: "/admin/brands",
        icon: Boxes,
      },
      {
        label: "Categories",
        href: "/admin/catalog?tab=categories",
        icon: FolderTree,
      },
      {
        label: "Notes",
        href: "/admin/catalog?tab=notes",
        icon: BookOpen,
      },
      {
        label: "Tags",
        href: "/admin/catalog?tab=tags",
        icon: Tags,
      },
    ],
  },
  {
    label: "CONTENT",
    items: [
      {
        label: "Pages",
        href: "/admin/content",
        icon: FileText,
      },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      {
        label: "Settings",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    const path = href.split("?")[0];

    if (path === "/admin/dashboard") {
      return pathname === path;
    }

    return pathname === path || pathname.startsWith(`${path}/`);
  }

  return (
    <aside
      className={[
        "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#DCD2C3] bg-[#F6F1E8]",
        "transition-transform duration-300 ease-out",
        open ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0",
      ].join(" ")}
    >
      <div className="flex h-[73px] items-center justify-between border-b border-[#DCD2C3] px-6">
        <Link href="/admin/dashboard" className="group" onClick={onClose}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#174D3D]">
            Franchise
          </p>

          <p className="mt-0.5 font-[family-name:var(--font-allura)] text-[28px] leading-none text-[#0D352B]">
            Fragrence
          </p>
        </Link>

        <button
          type="button"
          aria-label="Close navigation"
          className="grid h-9 w-9 place-items-center rounded-full text-[#6D756E] transition hover:bg-[#EAE1D2] hover:text-[#174D3D] lg:hidden"
          onClick={onClose}
        >
          <X size={19} strokeWidth={1.6} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-7">
        <nav className="space-y-7" aria-label="Admin navigation">
          {navigation.map((section) => (
            <div key={section.label}>
              <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.2em] text-[#9A958B]">
                {section.label}
              </p>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className={[
                        "group flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-all",
                        active
                          ? "bg-[#EAE1D2] font-medium text-[#174D3D]"
                          : "text-[#6D756E] hover:bg-[#EAE1D2]/70 hover:text-[#174D3D]",
                      ].join(" ")}
                    >
                      <Icon
                        size={17}
                        strokeWidth={active ? 1.8 : 1.5}
                        className={
                          active
                            ? "text-[#174D3D]"
                            : "text-[#8B938D] group-hover:text-[#174D3D]"
                        }
                      />

                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t border-[#DCD2C3] p-4">
        <Link
          href="/perfumes"
          target="_blank"
          className="mb-2 flex items-center justify-center rounded-sm border border-[#174D3D] px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#174D3D] transition hover:bg-[#174D3D] hover:text-white"
        >
          View storefront
        </Link>

        <SignOutButton />
      </div>
    </aside>
  );
}
