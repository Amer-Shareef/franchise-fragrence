"use server";

import { db } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  productInputSchema,
  type ProductInput,
} from "@/lib/validation/product";
import { revalidatePath } from "next/cache";

const productFormSelect = {
  id: true,
  name: true,
  slug: true,
  sku: true,
  brandId: true,
  shortDescription: true,
  description: true,
  gender: true,
  fragranceFamily: true,
  concentration: true,
  countryOfOrigin: true,
  manufacturer: true,
  ingredients: true,
  longevity: true,
  sillage: true,
  season: true,
  occasion: true,
  videoUrl: true,
  status: true,
  featured: true,
  bestSeller: true,
  newArrival: true,
  categories: { select: { categoryId: true } },
  tags: { select: { tagId: true } },
  notes: { select: { noteId: true, layer: true } },
  relatedFrom: { select: { relatedProductId: true } },
  variants: {
    orderBy: { isDefault: "desc" as const },
    select: {
      id: true,
      label: true,
      volumeMl: true,
      sku: true,
      isDefault: true,
      prices: {
        select: {
          regionId: true,
          available: true,
          price: true,
          originalPrice: true,
        },
      },
    },
  },
  images: {
    orderBy: { sortOrder: "asc" as const },
    select: {
      id: true,
      url: true,
      alt: true,
      sortOrder: true,
    },
  },
};

export async function getAdminProducts() {
  await requireAdmin();

  const products = await db.product.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      name: true,
      slug: true,
      sku: true,
      gender: true,
      status: true,
      featured: true,
      bestSeller: true,
      newArrival: true,
      brand: {
        select: {
          name: true,
        },
      },
      variants: {
        select: {
          id: true,
          label: true,
        },
      },
      images: {
        orderBy: { sortOrder: "asc" },
        take: 1,
        select: {
          url: true,
          alt: true,
        },
      },
    },
  });

  return products.map((product) => ({
    ...product,
    image: product.images[0] ?? null,
  }));
}

export async function getAdminProduct(id: string) {
  await requireAdmin();

  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: productFormSelect,
  });

  if (!product) {
    return null;
  }

  return {
    ...product,
    variants: product.variants.map((variant) => ({
      ...variant,
      prices: variant.prices.map((price) => ({
        ...price,
        price: price.price?.toString() ?? null,
        originalPrice: price.originalPrice?.toString() ?? null,
      })),
    })),
  };
}

export async function getProductFormOptions() {
  await requireAdmin();

  const [brands, categories, tags, notes, products, regions] = await Promise.all([
    db.brand.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
    db.category.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    db.tag.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    db.note.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    db.product.findMany({ select: { id: true, name: true, brand: { select: { name: true } } }, orderBy: { name: "asc" } }),
    db.region.findMany({
      select: {
        id: true,
        code: true,
        name: true,
        currency: true,
      },
      orderBy: {
        code: "asc",
      },
    }),
  ]);

  return {
    brands,
    categories,
    tags,
    notes,
    products: products.map((product) => ({ id: product.id, name: product.name, brandName: product.brand.name })),
    regions,
  };
}

function normalizeOptional(value?: string) {
  return value?.trim() ? value.trim() : null;
}

function buildVariantData(input: ProductInput) {
  return input.variants.map((variant, index) => ({
    label: variant.label.trim(),
    volumeMl: variant.volumeMl ? Number.parseInt(variant.volumeMl, 10) : null,
    sku: variant.sku.trim(),
    isDefault:
      variant.isDefault ||
      (index === 0 && !input.variants.some((candidate) => candidate.isDefault)),
    prices: {
      create: variant.prices.map((price) => ({
        regionId: price.regionId,
        available: price.available,
        price: price.price?.trim() ? price.price.trim() : null,
        originalPrice: price.originalPrice?.trim()
          ? price.originalPrice.trim()
          : null,
      })),
    },
  }));
}

function validateVariantInput(input: ProductInput) {
  const skuSet = new Set<string>();
  const regionSet = new Set<string>();

  for (const variant of input.variants) {
    const sku = variant.sku.trim().toLowerCase();

    if (skuSet.has(sku)) {
      throw new Error(`Duplicate variant SKU found: ${variant.sku}`);
    }

    skuSet.add(sku);

    for (const price of variant.prices) {
      const regionKey = `${variant.sku}:${price.regionId}`;

      if (regionSet.has(regionKey)) {
        throw new Error(`Duplicate regional price found for ${variant.sku}.`);
      }

      regionSet.add(regionKey);

      if (
        price.price &&
        price.originalPrice &&
        Number(price.originalPrice) < Number(price.price)
      ) {
        throw new Error(
          `Original price cannot be lower than the selling price for ${variant.label}.`,
        );
      }
    }
  }

  const defaultVariants = input.variants.filter((variant) => variant.isDefault);

  if (defaultVariants.length > 1) {
    throw new Error("Only one variant can be the default variant.");
  }
}

async function validateRelationships(id: string | null, input: ProductInput) {
  const categoryIds = [...new Set(input.categoryIds)];
  const tagIds = [...new Set(input.tagIds)];
  const relatedProductIds = [...new Set(input.relatedProductIds)];
  const noteIds = [...new Set(input.notes.map((note) => note.noteId))];

  if (id && relatedProductIds.includes(id)) throw new Error("A product cannot be related to itself.");
  if (new Set(input.notes.map((note) => `${note.noteId}:${note.layer}`)).size !== input.notes.length) throw new Error("A note can only be assigned once per layer.");

  const [categories, tags, notes, products] = await Promise.all([
    db.category.count({ where: { id: { in: categoryIds } } }),
    db.tag.count({ where: { id: { in: tagIds } } }),
    db.note.count({ where: { id: { in: noteIds } } }),
    db.product.count({ where: { id: { in: relatedProductIds } } }),
  ]);

  if (categories !== categoryIds.length || tags !== tagIds.length || notes !== noteIds.length || products !== relatedProductIds.length) {
    throw new Error("One or more selected catalogue relationships no longer exist.");
  }
}

function relationshipRows(input: ProductInput) {
  return {
    categories: [...new Set(input.categoryIds)].map((categoryId) => ({ categoryId })),
    tags: [...new Set(input.tagIds)].map((tagId) => ({ tagId })),
    notes: input.notes.map((note) => ({ noteId: note.noteId, layer: note.layer })),
    related: [...new Set(input.relatedProductIds)].map((relatedProductId) => ({ relatedProductId })),
  };
}

export async function createProduct(input: ProductInput) {
  await requireAdmin();

  const data = productInputSchema.parse(input);

  validateVariantInput(data);
  await validateRelationships(null, data);
  const relationships = relationshipRows(data);

  const existingSlug = await db.product.findUnique({
    where: {
      slug: data.slug,
    },
    select: {
      id: true,
    },
  });

  if (existingSlug) {
    throw new Error("A product with this slug already exists.");
  }

  const existingSku = await db.product.findUnique({
    where: {
      sku: data.sku,
    },
    select: {
      id: true,
    },
  });

  if (existingSku) {
    throw new Error("A product with this SKU already exists.");
  }

  try {
    const product = await db.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        sku: data.sku,
        brandId: data.brandId,

        shortDescription: data.shortDescription,
        description: normalizeOptional(data.description),

        gender: data.gender,

        fragranceFamily: normalizeOptional(data.fragranceFamily),
        concentration: normalizeOptional(data.concentration),
        countryOfOrigin: normalizeOptional(data.countryOfOrigin),
        manufacturer: normalizeOptional(data.manufacturer),
        ingredients: normalizeOptional(data.ingredients),
        longevity: normalizeOptional(data.longevity),
        sillage: normalizeOptional(data.sillage),
        season: normalizeOptional(data.season),
        occasion: normalizeOptional(data.occasion),

        videoUrl: normalizeOptional(data.videoUrl),

        status: data.status,

        featured: data.featured,
        bestSeller: data.bestSeller,
        newArrival: data.newArrival,

        variants: {
          create: buildVariantData(data),
        },

        images: {
          create: data.images.map((image, index) => ({
            url: image.url.trim(),
            alt: image.alt?.trim() || null,
            sortOrder: index,
          })),
        },
        categories: { create: relationships.categories },
        tags: { create: relationships.tags },
        notes: { create: relationships.notes },
        relatedFrom: { create: relationships.related },
      },

      select: {
        id: true,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/perfumes");

    return product.id;
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      throw new Error("A product or variant SKU already exists.");
    }

    throw error;
  }
}

export async function updateProduct(id: string, input: ProductInput) {
  await requireAdmin();

  const data = productInputSchema.parse(input);

  validateVariantInput(data);
  await validateRelationships(id, data);
  const relationships = relationshipRows(data);

  const existing = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      slug: true,
    },
  });

  if (!existing) {
    throw new Error("Product not found.");
  }

  const duplicateSlug = await db.product.findFirst({
    where: {
      slug: data.slug,
      NOT: {
        id,
      },
    },
    select: {
      id: true,
    },
  });

  if (duplicateSlug) {
    throw new Error("A product with this slug already exists.");
  }

  const duplicateSku = await db.product.findFirst({
    where: {
      sku: data.sku,
      NOT: {
        id,
      },
    },
    select: {
      id: true,
    },
  });

  if (duplicateSku) {
    throw new Error("A product with this SKU already exists.");
  }

  try {
    await db.$transaction(async (tx) => {
      await tx.product.update({
        where: {
          id,
        },

        data: {
          name: data.name,
          slug: data.slug,
          sku: data.sku,
          brandId: data.brandId,

          shortDescription: data.shortDescription,
          description: normalizeOptional(data.description),

          gender: data.gender,

          fragranceFamily: normalizeOptional(data.fragranceFamily),
          concentration: normalizeOptional(data.concentration),
          countryOfOrigin: normalizeOptional(data.countryOfOrigin),
          manufacturer: normalizeOptional(data.manufacturer),
          ingredients: normalizeOptional(data.ingredients),
          longevity: normalizeOptional(data.longevity),
          sillage: normalizeOptional(data.sillage),
          season: normalizeOptional(data.season),
          occasion: normalizeOptional(data.occasion),

          videoUrl: normalizeOptional(data.videoUrl),

          status: data.status,

          featured: data.featured,
          bestSeller: data.bestSeller,
          newArrival: data.newArrival,
        },
      });

      await Promise.all([
        tx.productCategory.deleteMany({ where: { productId: id } }),
        tx.productTag.deleteMany({ where: { productId: id } }),
        tx.productNote.deleteMany({ where: { productId: id } }),
        tx.productRelation.deleteMany({ where: { sourceProductId: id } }),
      ]);

      await Promise.all([
        relationships.categories.length ? tx.productCategory.createMany({ data: relationships.categories.map((item) => ({ ...item, productId: id })) }) : undefined,
        relationships.tags.length ? tx.productTag.createMany({ data: relationships.tags.map((item) => ({ ...item, productId: id })) }) : undefined,
        relationships.notes.length ? tx.productNote.createMany({ data: relationships.notes.map((item) => ({ ...item, productId: id })) }) : undefined,
        relationships.related.length ? tx.productRelation.createMany({ data: relationships.related.map((item) => ({ ...item, sourceProductId: id })) }) : undefined,
      ]);

      // Replace the saved image collection with the submitted order.
      await tx.productImage.deleteMany({
        where: {
          productId: id,
        },
      });

      if (data.images.length > 0) {
        await tx.productImage.createMany({
          data: data.images.map((image, index) => ({
            productId: id,
            url: image.url.trim(),
            alt: image.alt?.trim() || null,
            sortOrder: index,
          })),
        });
      }

      /*
       * Variant pricing is currently owned entirely by the
       * product editor, so replacing the variant collection
       * keeps the saved state predictable.
       *
       * ProductVariant prices cascade on deletion according
       * to the Prisma schema.
       */
      await tx.productVariant.deleteMany({
        where: {
          productId: id,
        },
      });

      if (data.variants.length > 0) {
        await tx.productVariant.createMany({
          data: data.variants.map((variant, index) => ({
            productId: id,
            label: variant.label.trim(),
            volumeMl: variant.volumeMl
              ? Number.parseInt(variant.volumeMl, 10)
              : null,
            sku: variant.sku.trim(),
            isDefault:
              variant.isDefault ||
              (index === 0 &&
                !data.variants.some((candidate) => candidate.isDefault)),
          })),
        });

        const savedVariants = await tx.productVariant.findMany({
          where: {
            productId: id,
          },
          select: {
            id: true,
            sku: true,
          },
        });

        const variantBySku = new Map(
          savedVariants.map((variant) => [variant.sku, variant.id]),
        );

        const priceRows = data.variants.flatMap((variant) => {
          const variantId = variantBySku.get(variant.sku.trim());

          if (!variantId) {
            throw new Error(`Unable to map variant ${variant.label}.`);
          }

          return variant.prices.map((price) => ({
            variantId,
            regionId: price.regionId,
            available: price.available,
            price: price.price?.trim() ? price.price.trim() : null,
            originalPrice: price.originalPrice?.trim()
              ? price.originalPrice.trim()
              : null,
          }));
        });

        if (priceRows.length > 0) {
          await tx.variantRegionalPrice.createMany({
            data: priceRows,
          });
        }
      }
    });

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}`);
    revalidatePath("/perfumes");
    revalidatePath(`/perfumes/${existing.slug}`);
    revalidatePath(`/perfumes/${data.slug}`);

    return id;
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      throw new Error("A product or variant SKU already exists.");
    }

    throw error;
  }
}

export async function deleteProduct(id: string) {
  await requireAdmin();

  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      slug: true,
    },
  });

  if (!product) {
    throw new Error("Product not found.");
  }

  await db.product.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/perfumes");
}

export async function updateProductStatus(
  id: string,
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED",
) {
  await requireAdmin();

  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      slug: true,
    },
  });

  if (!product) {
    throw new Error("Product not found.");
  }

  await db.product.update({
    where: {
      id,
    },

    data: {
      status,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/perfumes");
  revalidatePath(`/perfumes/${product.slug}`);
}
