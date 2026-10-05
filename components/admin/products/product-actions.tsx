"use client";

import Link from "next/link";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteProduct, updateProductStatus } from "@/lib/admin/products";

export function ProductActions({
  productId,
  status,
}: {
  productId: string;
  status: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function changeStatus(nextStatus: "DRAFT" | "PUBLISHED" | "ARCHIVED") {
    setPending(true);

    try {
      await updateProductStatus(productId, nextStatus);
      router.refresh();
    } finally {
      setPending(false);
      setOpen(false);
    }
  }

  async function removeProduct() {
    if (!window.confirm("Delete this product and all of its variants and images?")) {
      return;
    }

    setPending(true);

    try {
      await deleteProduct(productId);
      router.refresh();
    } finally {
      setPending(false);
      setOpen(false);
    }
  }

  return (
    <div className="relative flex justify-end">
      <button
        type="button"
        aria-label="Product actions"
        aria-expanded={open}
        disabled={pending}
        onClick={() => setOpen((value) => !value)}
        className="grid h-9 w-9 place-items-center rounded-full text-[#6D756E] hover:bg-[#EAE1D2] hover:text-[#174D3D]"
      >
        <MoreHorizontal size={18} />
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-20 w-44 border border-[#DCD2C3] bg-white p-1 shadow-xl">
          <Link
            href={`/admin/products/${productId}`}
            className="block px-3 py-2 text-sm hover:bg-[#F6F1E8]"
            onClick={() => setOpen(false)}
          >
            Edit product
          </Link>

          {status !== "PUBLISHED" && (
            <button
              type="button"
              onClick={() => changeStatus("PUBLISHED")}
              className="block w-full px-3 py-2 text-left text-sm hover:bg-[#F6F1E8]"
            >
              Publish
            </button>
          )}

          {status !== "DRAFT" && (
            <button
              type="button"
              onClick={() => changeStatus("DRAFT")}
              className="block w-full px-3 py-2 text-left text-sm hover:bg-[#F6F1E8]"
            >
              Move to draft
            </button>
          )}

          {status !== "ARCHIVED" && (
            <button
              type="button"
              onClick={() => changeStatus("ARCHIVED")}
              className="block w-full px-3 py-2 text-left text-sm text-[#8B5E5E] hover:bg-[#F6F1E8]"
            >
              Archive
            </button>
          )}

          <button
            type="button"
            onClick={removeProduct}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50"
          >
            <Trash2 size={14} />
            Delete product
          </button>
        </div>
      )}
    </div>
  );
}
