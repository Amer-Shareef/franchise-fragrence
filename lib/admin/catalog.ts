"use server";

import { db } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const catalogItemSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(160),
  slug: z.string().trim().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
  description: z.string().trim().max(10_000).optional().or(z.literal("")),
});

export type CatalogItemInput = z.infer<typeof catalogItemSchema>;
export type CatalogItemKind = "category" | "note" | "tag";

function invalidateCatalogue() {
  revalidatePath("/admin/catalog");
  revalidatePath("/admin/products");
  revalidatePath("/perfumes");
}

export async function getCatalogItems() {
  await requireAdmin();
  const [categories, notes, tags] = await Promise.all([
    db.category.findMany({ select: { id: true, name: true, slug: true, description: true, _count: { select: { products: true } } }, orderBy: { name: "asc" } }),
    db.note.findMany({ select: { id: true, name: true, slug: true, _count: { select: { products: true } } }, orderBy: { name: "asc" } }),
    db.tag.findMany({ select: { id: true, name: true, slug: true, _count: { select: { products: true } } }, orderBy: { name: "asc" } }),
  ]);
  return { categories, notes, tags };
}

export async function saveCatalogItem(kind: CatalogItemKind, id: string | null, input: CatalogItemInput) {
  await requireAdmin();
  const data = catalogItemSchema.parse(input);
  const description = data.description || null;

  if (kind === "category") {
    const duplicate = await db.category.findFirst({ where: { id: id ? { not: id } : undefined, OR: [{ name: data.name }, { slug: data.slug }] }, select: { id: true } });
    if (duplicate) throw new Error("A category with this name or slug already exists.");
    if (id) await db.category.update({ where: { id }, data: { name: data.name, slug: data.slug, description } });
    else await db.category.create({ data: { name: data.name, slug: data.slug, description } });
  } else if (kind === "note") {
    const duplicate = await db.note.findFirst({ where: { id: id ? { not: id } : undefined, OR: [{ name: data.name }, { slug: data.slug }] }, select: { id: true } });
    if (duplicate) throw new Error("A note with this name or slug already exists.");
    if (id) await db.note.update({ where: { id }, data: { name: data.name, slug: data.slug } });
    else await db.note.create({ data: { name: data.name, slug: data.slug } });
  } else {
    const duplicate = await db.tag.findFirst({ where: { id: id ? { not: id } : undefined, OR: [{ name: data.name }, { slug: data.slug }] }, select: { id: true } });
    if (duplicate) throw new Error("A tag with this name or slug already exists.");
    if (id) await db.tag.update({ where: { id }, data: { name: data.name, slug: data.slug } });
    else await db.tag.create({ data: { name: data.name, slug: data.slug } });
  }

  invalidateCatalogue();
}

export async function deleteCatalogItem(kind: CatalogItemKind, id: string) {
  await requireAdmin();

  if (kind === "category") {
    const item = await db.category.findUnique({ where: { id }, select: { _count: { select: { products: true } } } });
    if (!item) throw new Error("Category not found.");
    if (item._count.products) throw new Error("Remove this category from its products before deleting it.");
    await db.category.delete({ where: { id } });
  } else if (kind === "note") {
    const item = await db.note.findUnique({ where: { id }, select: { _count: { select: { products: true } } } });
    if (!item) throw new Error("Note not found.");
    if (item._count.products) throw new Error("Remove this note from its products before deleting it.");
    await db.note.delete({ where: { id } });
  } else {
    const item = await db.tag.findUnique({ where: { id }, select: { _count: { select: { products: true } } } });
    if (!item) throw new Error("Tag not found.");
    if (item._count.products) throw new Error("Remove this tag from its products before deleting it.");
    await db.tag.delete({ where: { id } });
  }

  invalidateCatalogue();
}
