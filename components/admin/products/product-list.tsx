"use client";

import Link from "next/link";
import {
  Archive,
  CheckCircle2,
  Edit3,
  Eye,
  MoreHorizontal,
  Package,
  Plus,
} from "lucide-react";
import { useMemo, useState } from "react";
import { ProductActions } from "./product-actions";

type ProductListItem = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  gender: string;
  status: string;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  brand: {
    name: string;
  };
  variants: {
    id: string;
    label: string;
  }[];
  image: {
    url: string;
    alt: string | null;
  } | null;
};

export function ProductList({ products }: { products: ProductListItem[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        product.brand.name.toLowerCase().includes(query);

      const matchesStatus = status === "ALL" || product.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [products, search, status]);

  return (
    <div>
      <div className="surface rounded-sm p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products, brands or SKU..."
            className="min-h-11 flex-1 px-4 text-sm"
          />

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="min-h-11 px-4 text-sm lg:w-48"
          >
            <option value="ALL">All statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          <Link
            href="/admin/products/new"
            className="button button-solid min-h-11"
          >
            <Plus size={16} />
            Add product
          </Link>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-sm border border-[#DCD2C3] bg-white">
        <div className="hidden grid-cols-[1fr_160px_120px_100px_48px] gap-4 border-b border-[#DCD2C3] bg-[#EAE1D2]/50 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#6D756E] lg:grid">
          <span>Product</span>
          <span>Brand</span>
          <span>Status</span>
          <span>Variants</span>
          <span />
        </div>

        {filteredProducts.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Package
              size={28}
              strokeWidth={1.3}
              className="mx-auto text-[#B6A58A]"
            />

            <p className="mt-4 text-sm text-[#6D756E]">No products found.</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))
        )}
      </div>

      <p className="mt-3 text-xs text-[#8B938D]">
        Showing {filteredProducts.length} of {products.length} products
      </p>
    </div>
  );
}

function ProductRow({ product }: { product: ProductListItem }) {
  return (
    <div className="border-b border-[#DCD2C3] px-5 py-4 last:border-b-0">
      <div className="grid gap-4 lg:grid-cols-[1fr_160px_120px_100px_48px] lg:items-center">
        <div className="min-w-0">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden bg-[#EAE1D2] text-[#174D3D]">
              {product.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.image.url}
                  alt={product.image.alt || `${product.name} product image`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Package size={17} strokeWidth={1.4} />
              )}
            </div>

            <div className="min-w-0">
              <Link
                href={`/admin/products/${product.id}`}
                className="block truncate font-[family-name:var(--font-display)] text-xl text-[#242B27] hover:text-[#174D3D]"
              >
                {product.name}
              </Link>

              <p className="mt-0.5 text-xs text-[#8B938D]">
                {product.sku} · {product.gender}
              </p>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {product.featured && <Badge>Featured</Badge>}
                {product.bestSeller && <Badge>Best seller</Badge>}
                {product.newArrival && <Badge>New arrival</Badge>}
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm text-[#6D756E]">{product.brand.name}</div>

        <StatusBadge status={product.status} />

        <div className="text-sm text-[#6D756E]">{product.variants.length}</div>

        <ProductActions productId={product.id} status={product.status} />
      </div>

      <div className="mt-3 flex gap-3 lg:hidden">
        <Link
          href={`/admin/products/${product.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#174D3D]"
        >
          <Edit3 size={14} />
          Edit
        </Link>

        <Link
          href={`/perfumes/${product.slug}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 text-xs text-[#6D756E]"
        >
          <Eye size={14} />
          View
        </Link>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "PUBLISHED"
      ? "bg-[#174D3D]/10 text-[#174D3D]"
      : status === "ARCHIVED"
        ? "bg-[#242B27]/10 text-[#6D756E]"
        : "bg-[#EAE1D2] text-[#6D756E]";

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${styles}`}
    >
      {status === "PUBLISHED" && <CheckCircle2 size={12} />}

      {status === "ARCHIVED" && <Archive size={12} />}

      {status === "DRAFT" && <MoreHorizontal size={12} />}

      {status}
    </span>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-[#EAE1D2] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#174D3D]">
      {children}
    </span>
  );
}
