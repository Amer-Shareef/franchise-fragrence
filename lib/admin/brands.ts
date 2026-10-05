"use server";

import { db } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";
import { brandInputSchema, type BrandInput } from "@/lib/validation/brand";
import { revalidatePath } from "next/cache";

const brandSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  _count: {
    select: {
      products: true,
    },
  },
} as const;

function invalidateBrandPaths(slug?: string) {
  revalidatePath("/admin/brands");
  revalidatePath("/brands");

  if (slug) {
    revalidatePath(`/brands/${slug}`);
  }
}

export async function getAdminBrands() {
  await requireAdmin();

  return db.brand.findMany({
    select: brandSelect,
    orderBy: {
      name: "asc",
    },
  });
}

export async function getAdminBrand(id: string) {
  await requireAdmin();

  return db.brand.findUnique({
    where: { id },
    select: brandSelect,
  });
}

export async function createBrand(input: BrandInput) {
  await requireAdmin();

  const data = brandInputSchema.parse(input);

  const duplicate = await db.brand.findFirst({
    where: {
      OR: [{ name: data.name }, { slug: data.slug }],
    },
    select: { id: true },
  });

  if (duplicate) {
    throw new Error("A brand with this name or slug already exists.");
  }

  const brand = await db.brand.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description || null,
    },
    select: { id: true, slug: true },
  });

  invalidateBrandPaths(brand.slug);
  return brand.id;
}

export async function updateBrand(id: string, input: BrandInput) {
  await requireAdmin();

  const data = brandInputSchema.parse(input);
  const existing = await db.brand.findUnique({
    where: { id },
    select: { id: true, slug: true },
  });

  if (!existing) {
    throw new Error("Brand not found.");
  }

  const duplicate = await db.brand.findFirst({
    where: {
      id: { not: id },
      OR: [{ name: data.name }, { slug: data.slug }],
    },
    select: { id: true },
  });

  if (duplicate) {
    throw new Error("A brand with this name or slug already exists.");
  }

  const brand = await db.brand.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description || null,
    },
    select: { id: true, slug: true },
  });

  invalidateBrandPaths(existing.slug);
  invalidateBrandPaths(brand.slug);
  return brand.id;
}

export async function deleteBrand(id: string) {
  await requireAdmin();

  const brand = await db.brand.findUnique({
    where: { id },
    select: {
      slug: true,
      _count: { select: { products: true } },
    },
  });

  if (!brand) {
    throw new Error("Brand not found.");
  }

  if (brand._count.products > 0) {
    throw new Error("Move or delete this brand's products before deleting it.");
  }

  await db.brand.delete({ where: { id } });
  invalidateBrandPaths(brand.slug);
}
