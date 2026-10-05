import { z } from "zod";

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(""));

const regionalPriceSchema = z.object({
  regionId: z.string().min(1),
  available: z.boolean(),
  price: z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid price")
    .or(z.literal("")),
  originalPrice: z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid original price")
    .or(z.literal("")),
});

const variantSchema = z.object({
  id: z.string().optional(),
  label: z.string().trim().min(1, "Variant label is required").max(100),
  volumeMl: z
    .string()
    .trim()
    .regex(/^\d+$/, "Volume must be a whole number")
    .or(z.literal("")),
  sku: z.string().trim().min(2, "Variant SKU is required").max(80),
  isDefault: z.boolean(),
  prices: z.array(regionalPriceSchema),
});

const productImageSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, "Image URL is required")
    .max(1000)
    .refine(
      (value) => value.startsWith("/") || /^https?:\/\//i.test(value),
      "Enter an HTTP(S) URL or a local path starting with /",
    ),

  alt: z.string().trim().max(500).optional().or(z.literal("")),
});

const productNoteSchema = z.object({
  noteId: z.string().min(1),
  layer: z.enum(["TOP", "HEART", "BASE"]),
});

export const productInputSchema = z.object({
  name: z.string().trim().min(2, "Product name is required").max(160),

  slug: z
    .string()
    .trim()
    .min(2, "Slug is required")
    .max(180)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers and hyphens only",
    ),

  sku: z.string().trim().min(2, "SKU is required").max(80),

  brandId: z.string().min(1, "Brand is required"),

  shortDescription: z
    .string()
    .trim()
    .min(10, "Short description must contain at least 10 characters")
    .max(500),

  description: optionalText(10000),

  gender: z.enum(["MEN", "WOMEN", "UNISEX"]),

  fragranceFamily: optionalText(160),
  concentration: optionalText(120),
  countryOfOrigin: optionalText(160),
  manufacturer: optionalText(200),
  ingredients: optionalText(10000),
  longevity: optionalText(160),
  sillage: optionalText(160),
  season: optionalText(160),
  occasion: optionalText(200),

  videoUrl: z
    .string()
    .trim()
    .url("Enter a valid video URL")
    .max(1000)
    .optional()
    .or(z.literal("")),

  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),

  featured: z.boolean(),
  bestSeller: z.boolean(),
  newArrival: z.boolean(),

  variants: z.array(variantSchema),

  images: z.array(productImageSchema),
  categoryIds: z.array(z.string().min(1)).default([]),
  tagIds: z.array(z.string().min(1)).default([]),
  notes: z.array(productNoteSchema).default([]),
  relatedProductIds: z.array(z.string().min(1)).default([]),
});

export type ProductInput = z.infer<typeof productInputSchema>;
export type ProductVariantInput = z.infer<typeof variantSchema>;
export type RegionalPriceInput = z.infer<typeof regionalPriceSchema>;
