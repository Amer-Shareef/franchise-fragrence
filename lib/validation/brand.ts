import { z } from "zod";

export const brandInputSchema = z.object({
  name: z.string().trim().min(2, "Brand name is required").max(160),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required")
    .max(180)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers and hyphens only",
    ),
  description: z.string().trim().max(10_000).optional().or(z.literal("")),
});

export type BrandInput = z.infer<typeof brandInputSchema>;
