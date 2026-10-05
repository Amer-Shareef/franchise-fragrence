import Link from "next/link";
import { ArrowUpRight, Boxes, FileText, Plus, ShoppingBag } from "lucide-react";
import { requireAdmin } from "@/lib/auth/require-admin";
import { db } from "@/lib/db/prisma";

export default async function AdminDashboard() {
  const [session, total, published, drafts, brands] = await Promise.all([
    requireAdmin(),
    db.product.count(),
    db.product.count({
      where: {
        status: "PUBLISHED",
      },
    }),
    db.product.count({
      where: {
        status: "DRAFT",
      },
    }),
    db.brand.count(),
  ]);

  return (
    <div>
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Franchise Fragrence</p>

          <h1 className="display mt-2 text-4xl text-[#242B27] sm:text-5xl">
            Catalogue admin
          </h1>

          <p className="mt-2 text-sm text-[#6D756E]">
            Signed in as {session.user.email}
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="button button-solid w-full sm:w-auto"
        >
          <Plus size={16} strokeWidth={1.8} />
          Add product
        </Link>
      </div>

      {/* Statistics */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStat label="Products" value={total} icon={ShoppingBag} />

        <DashboardStat
          label="Published"
          value={published}
          icon={ArrowUpRight}
        />

        <DashboardStat label="Drafts" value={drafts} icon={FileText} />

        <DashboardStat label="Brands" value={brands} icon={Boxes} />
      </section>

      {/* Main dashboard */}
      <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        {/* Catalogue */}
        <section className="surface rounded-sm p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Catalogue</p>

              <h2 className="display mt-2 text-3xl text-[#242B27]">
                Manage your collection
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[#6D756E]">
                Create and manage fragrances, brands, variants, regional
                pricing, availability and catalogue content.
              </p>
            </div>

            <ShoppingBag
              size={24}
              strokeWidth={1.3}
              className="hidden text-[#174D3D] sm:block"
            />
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <QuickAction
              href="/admin/products"
              title="Manage products"
              description="View and edit your fragrance catalogue."
            />

            <QuickAction
              href="/admin/brands"
              title="Manage brands"
              description="Create and maintain fragrance houses."
            />

            <QuickAction
              href="/admin/catalog"
              title="Catalogue data"
              description="Manage categories, notes and tags."
            />

            <QuickAction
              href="/admin/content"
              title="Manage content"
              description="Update pages and editorial content."
            />
          </div>
        </section>

        {/* Quick actions */}
        <section className="surface rounded-sm p-6 sm:p-7">
          <p className="eyebrow">Quick actions</p>

          <h2 className="display mt-2 text-3xl text-[#242B27]">
            Continue working
          </h2>

          <div className="mt-6 space-y-2">
            <ActionLink
              href="/admin/products/new"
              icon={<Plus size={17} strokeWidth={1.6} />}
              label="Add a product"
            />

            <ActionLink
              href="/admin/brands/new"
              icon={<Plus size={17} strokeWidth={1.6} />}
              label="Add a brand"
            />

            <ActionLink
              href="/perfumes"
              icon={<ArrowUpRight size={17} strokeWidth={1.6} />}
              label="View storefront"
              external
            />
          </div>
        </section>
      </div>

      {/* Status */}
      <section className="mt-6 border border-[#DCD2C3] bg-white/40 p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-[#242B27]">
              Administration system
            </p>

            <p className="mt-1 text-xs leading-5 text-[#6D756E]">
              Product authoring, brand management and catalogue controls will
              appear here as they are implemented.
            </p>
          </div>

          <span className="inline-flex w-fit items-center rounded-full bg-[#EAE1D2] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#174D3D]">
            Phase 1
          </span>
        </div>
      </section>
    </div>
  );
}

function DashboardStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof ShoppingBag;
}) {
  return (
    <div className="surface rounded-sm p-5">
      <div className="flex items-start justify-between">
        <p className="text-xs uppercase tracking-[0.14em] text-[#8B938D]">
          {label}
        </p>

        <Icon size={18} strokeWidth={1.5} className="text-[#174D3D]" />
      </div>

      <p className="display mt-3 text-4xl text-[#242B27]">{value}</p>
    </div>
  );
}

function QuickAction({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group border border-[#DCD2C3] bg-[#F6F1E8] p-4 transition hover:border-[#174D3D] hover:bg-white"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-[#242B27]">{title}</h3>

          <p className="mt-1 text-xs leading-5 text-[#6D756E]">{description}</p>
        </div>

        <ArrowUpRight
          size={16}
          strokeWidth={1.5}
          className="text-[#8B938D] transition group-hover:text-[#174D3D]"
        />
      </div>
    </Link>
  );
}

function ActionLink({
  href,
  icon,
  label,
  external = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      className="flex items-center gap-3 border border-[#DCD2C3] bg-[#F6F1E8] px-4 py-3 text-sm text-[#242B27] transition hover:border-[#174D3D] hover:text-[#174D3D]"
    >
      <span className="text-[#174D3D]">{icon}</span>

      <span>{label}</span>
    </Link>
  );
}
