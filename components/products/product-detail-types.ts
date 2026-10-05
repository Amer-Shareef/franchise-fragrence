export type ProductDetail = {
  name: string;
  slug: string;
  brand: string;
  sku?: string;
  shortDescription?: string;
  description?: string;
  gender?: string;
  family?: string;
  concentration?: string;
  countryOfOrigin?: string;
  manufacturer?: string;
  ingredients?: string;
  longevity?: string;
  sillage?: string;
  season?: string;
  occasion?: string;
  videoUrl?: string;
  accent?: string;

  images?: {
    url: string;
    alt?: string;
  }[];

  sizes?: string[];

  notes?: {
    top?: string[];
    heart?: string[];
    base?: string[];
  };

  variants?: {
    id: string;
    label: string;
    volumeMl?: number;
    isDefault?: boolean;
    prices?: {
      region: string;
      currency?: string;
      price?: number;
      originalPrice?: number;
      available?: boolean;
    }[];
  }[];

  relatedProducts?: ProductDetail[];
};
