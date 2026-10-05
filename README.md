# Franchise Fragrence --- Project Source of Truth

**Current phase:** Phase 1 --- Public catalogue + Admin catalogue
management\
**Future phase:** Phase 2 --- Full e-commerce\
**Stack:** Next.js App Router, TypeScript, Tailwind CSS, MySQL, Prisma,
Auth.js, Zod\
**Last updated:** 2026-10-03

## 1. Purpose

This README is the working source of truth for the Franchise Fragrence
application. The current codebase is authoritative if it differs from
older notes.

### Status

- `[x]` Implemented and verified
- `[~]` Implemented/started but requires integration, runtime, visual
  or build verification
- `[ ]` Not completed
- `[!]` Known issue

Do not mark a feature `[x]` only because code exists. Verify it in the
running app and, where appropriate, with `npm run lint` and
`npm run build`.

---

## 2. Product Vision

Franchise Fragrence is a premium digital fragrance maison and catalogue,
with e-commerce planned as a later phase.

Customer journey:

```text
Elegant entry
→ Editorial discovery
→ Fragrance catalogue
→ Filtering/browsing
→ Product presentation
→ Fragrance education
→ Region-aware pricing/availability
→ Future purchasing
```

Core principles: luxury, clarity, fragrance discovery, regional
accuracy, good photography, scalable architecture, strong admin control,
and no invented product information.

---

## 3. Technology

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui selectively
- Lucide React
- Framer Motion where useful
- MySQL
- Prisma ORM
- Auth.js
- Zod

Development uses MySQL through `.env`. Never commit secrets.

---

## 4. Design System

### Visual direction

Light luxury, editorial, modern, minimal and premium.

Avoid old dark-theme styling, harsh black borders, neon/glowing effects
and generic dashboard styling on public pages.

### Colours

Role Hex

---

Warm Ivory `#F6F1E8`
Champagne Beige `#EAE1D2`
Deep Emerald `#174D3D`
Forest Emerald `#0D352B`
Muted Champagne `#B6A58A`
Charcoal `#242B27`
Muted Sage `#6D756E`
Border `#DCD2C3`
White `#FFFFFF`

### Fonts

- Cormorant Garamond --- editorial headings
- Inter --- body/UI
- Allura --- logo treatment

---

## 5. Responsive Rules

- Mobile: 2 product cards per row
- Tablet: 3 product cards per row
- Desktop: 4 product cards per row
- Mobile navigation overlays content
- Search is compact/hidden where appropriate on mobile
- Large touch targets
- Responsive logo and region selector

---

## 6. Main Routes

```text
/
├── /perfumes
├── /perfumes/[slug]
├── /men
├── /women
├── /unisex
├── /brands
├── /brands/[slug]
├── /fragrance-guide
├── /perfume-guide
├── /brand-stories
├── /about
├── /contact
├── /faq
├── /privacy-policy
└── /terms
```

Admin:

```text
/admin
├── /products
├── /products/new
├── /products/[id]
├── /brands
├── /categories
├── /notes
├── /tags
├── /pages
└── /settings
```

Preserve existing routes; inspect the codebase before creating
duplicates.

---

# 7. Current Implementation Status

## 7.1 Application foundation

### `[~]` Next.js / TypeScript / Tailwind foundation

The application and admin foundation are running. Final lint/build
verification remains.

### `[~]` Prisma / MySQL

Prisma is already being used for product data. Remaining work is
integration and verification of schema relations, repository mapping,
serialization and UI types.

---

# 8. Admin Products

## `[~]` Product list

The admin product list is working and displays products, brands, SKUs,
gender and publication status.

Existing functionality includes search/status filtering and product
rows.

### Remaining

- Show the real product image instead of the cube placeholder
- Verify main-image selection
- Verify edit/navigation/actions
- Verify responsive behaviour

## `[~]` Product creation

The current product form supports:

- Product name
- Slug
- SKU
- Brand
- Short/full descriptions
- Gender
- Fragrance family
- Concentration
- Country of origin
- Manufacturer
- Ingredients
- Longevity
- Sillage
- Season
- Occasion
- Video URL
- Draft/published/archived
- Featured/best seller/new arrival
- Variants
- Variant SKU/volume/default flag
- Regional price/original price/availability
- Multiple product images
- Image order
- Alt text

## `[~]` Product editing

The edit form and existing-product mapping are implemented, but require
full runtime verification.

## `[!]` Save redirect

Preferred behaviour:

```text
Save
→ successful save
→ /admin/products
```

Both create and edit should return to the product list.

---

# 9. Product Images

## `[x]` Local upload mechanism

The current media editor uploads through:

```text
POST /api/admin/product-images
```

and stores local files under:

```text
public/uploads/products/
```

Supported upload types include JPEG, PNG and WebP with a 5 MB limit.

The media editor supports:

- Upload
- Add image
- Remove image
- Move image up/down
- Alt text
- Local path/URL
- Preview

## `[!]` Image integration

The current development flow successfully places the uploaded file in
`public/uploads/products/`, but the image is not yet reliably appearing
in the admin product list or public UI.

Required data flow:

```text
Upload
→ local file
→ Product form state
→ Product save
→ ProductImage database record
→ Admin list
→ Repository
→ Public gallery
```

Do not hardcode image paths. Fix the data mapping.

---

# 10. Known Prisma Decimal Issue

## `[!]`

The development server currently reports:

```text
Only plain objects can be passed to Client Components from Server Components.
Decimal objects are not supported.
```

Fix by converting Prisma `Decimal` values into serializable
strings/numbers in the server-side mapping before passing them to Client
Components.

Do not hide this with unsafe casts.

---

# 11. Validation

## `[x]` Product validation foundation

Product validation already covers:

- Name
- Slug
- SKU
- Brand
- Short description
- Gender
- Optional fragrance fields
- Video URL
- Status
- Flags
- Variants
- Regional pricing
- Images

Local image paths beginning with `/` are supported, including:

```text
/uploads/products/example.webp
```

---

# 12. Variants and Regional Pricing

## `[~]`

Variants support:

- Label
- Volume
- SKU
- Default variant
- Regional pricing
- Availability
- Original price

Pricing is manually controlled.

Regions:

```text
LK   → LKR
AE   → AED
INTL → no regional price
```

Do not automatically convert currencies by exchange rate.

International should not show empty price components.

---

# 13. Repository / Data Layer

## `[~]`

The repository must correctly map:

- Product
- Brand
- Images
- Image ordering
- Variants
- Variant sizes
- Variant SKU
- Regional prices
- Availability
- Related products
- Optional fields

Remove temporary unsafe casts. Return clean UI-safe serializable
objects.

---

# 14. Public Catalogue

## `[~]` `/perfumes`

Existing foundation/design work is present.

Target:

- Responsive product grid
- Search/filtering
- Region-aware pricing
- Product cards
- Product badges
- Availability

Filters:

- Gender
- Availability
- Brand
- Fragrance family
- Fragrance note
- Size
- Minimum price
- Maximum price

International mode hides regional price filtering.

---

# 15. Product Cards

## `[~]`

Target design:

- Ivory product area
- Champagne border
- Soft shadow
- Subtle hover lift
- Subtle image zoom
- Emerald interaction
- Uppercase brand
- Editorial serif product name
- Region-aware price
- Meaningful original price
- Badges

Use actual product images whenever available.

---

# 16. Individual Product Page

## `[ ]` Full completion

Route:

```text
/perfumes/[slug]
```

Structure:

```text
Gallery
→ Summary
→ Regional price
→ Availability
→ Size selector
→ Description
→ Fragrance notes
→ Product details
→ Performance
→ Related products
```

Desktop: gallery left, information right.\
Mobile: gallery first, information second.

Target components:

```text
components/products/
├── product-gallery.tsx
├── product-summary.tsx
├── product-price.tsx
├── size-selector.tsx
├── fragrance-notes.tsx
├── product-details.tsx
├── product-performance.tsx
├── product-availability.tsx
├── related-products.tsx
└── product-detail-types.ts
```

Only create components that do not already have an equivalent
implementation.

Optional fields must be hidden when empty. Never show `N/A`, fake data
or empty sections.

---

# 17. Admin Brands

## `[ ]`

Complete:

```text
/admin/brands
/admin/brands/new
/admin/brands/[id]
```

Features:

- List/search
- Create/edit
- Name
- Slug
- Description/story where supported
- Logo/image where supported
- Product relationship
- Validation
- Delete/archive where appropriate

Then connect:

```text
Admin brand
→ Database
→ Public /brands
→ Public /brands/[slug]
→ Product cards
```

---

# 18. Categories, Notes, Tags and Related Products

## `[~]` Admin foundations exist

Complete in this order:

```text
Categories
→ Notes
→ Tags
→ Related Products
```

Connect the real Prisma relationships to the product editor and public
catalogue/detail pages.

Do not invent relations that are not in the schema.

---

# 19. Public Brands

## `[ ]`

Routes:

```text
/brands
/brands/[slug]
```

Support:

- Brand listing
- Logo/image where available
- Brand story where available
- Product count
- Brand products
- SEO metadata

---

# 20. Fragrance Guide

## `[ ]`

Route:

```text
/fragrance-guide
```

Content:

- Fragrance families
- Top/heart/base notes
- EDP vs EDT vs Parfum
- Choosing a fragrance
- Longevity
- Sillage
- Seasonal selection
- Occasion selection
- Application
- Storage
- FAQ

---

# 21. Other Content

## `[ ]`

Complete and verify:

```text
/perfume-guide
/brand-stories
/about
/contact
/faq
/privacy-policy
/terms
```

Remove production placeholders.

---

# 22. Homepage

## `[~]`

Target:

```text
Hero
→ Featured fragrances
→ Men/Women/Unisex collections
→ Best sellers
→ Why choose us
→ Editorial content
→ Footer
```

Connect these sections to live database data where appropriate.

Do not expose drafts/unpublished products publicly.

---

# 23. Header / Footer

## `[~]`

Verify:

- Logo
- Navigation
- Region selector
- Search
- Mobile menu
- Active state
- Responsive layout
- Correct routes

Footer:

- Forest emerald
- Matching logo
- Discover
- Maison
- Information
- Contact
- Social
- Copyright

Replace placeholder contact/social information before launch.

---

# 24. Authentication

## `[~]`

Use Auth.js.

Required:

- Secure login
- Protected `/admin/*`
- Secure sessions
- No public admin access
- Logout
- Authorization checks

Perform a final security review before launch.

---

# 25. SEO

## `[~]`

Required:

- Site metadata
- Product metadata
- Brand metadata
- Canonicals
- Sitemap
- Robots
- Open Graph
- Image alt text
- Structured data where appropriate
- SEO-friendly slugs

---

# 26. Accessibility

## `[~]`

Audit:

- Keyboard navigation
- Focus states
- Semantic headings
- ARIA
- `aria-current`
- `aria-expanded`
- Touch targets
- Alt text
- Reduced motion
- Colour-independent meaning

---

# 27. Performance

## `[ ]`

Use:

- Server Components by default
- Client Components only when interaction requires them
- Next.js image optimization
- Responsive image sizes
- Lazy loading
- Small client bundles
- Layout-shift prevention
- Reduced motion

---

# 28. Architecture Rules

Separate:

```text
UI
Data access
Repository mapping
Validation
Types
Region logic
Authentication
Admin actions
Product logic
Configuration
```

Do not create giant files.

Do not rewrite working functionality unnecessarily.

Do not duplicate existing components/utilities.

Do not use unsafe casts to hide data-model mismatches.

Do not invent database fields.

---

# 29. Development Order

## Phase A --- Stabilise Admin Products

1.  `/admin/products`
2.  `/admin/products/new`
3.  `/admin/products/[id]`
4.  Product server actions
5.  Product repository
6.  Decimal serialization
7.  Product image persistence/display
8.  Save redirect

## Phase B --- Admin Brands

9.  `/admin/brands`
10. Brand create/edit
11. Brand validation
12. Product-brand connections

## Phase C --- Admin Catalogue Relationships

13. Categories
14. Notes
15. Tags
16. Related products
17. Connect all relationships to product editor

## Phase D --- Public Product

18. Repository/types audit
19. `/perfumes/[slug]`
20. Product gallery
21. Product summary
22. Product price
23. Size selector
24. Availability
25. Details
26. Notes
27. Performance
28. Related products

## Phase E --- Public Brands

29. `/brands`
30. `/brands/[slug]`

## Phase F --- Public Catalogue

31. `/perfumes`
32. `/men`
33. `/women`
34. `/unisex`
35. Search/filter/region integration

## Phase G --- Content

36. Fragrance guide
37. Perfume guide
38. Brand stories
39. About
40. Contact
41. FAQ
42. Privacy
43. Terms

## Phase H --- Homepage

44. Connect featured products
45. Connect best sellers
46. Connect collections
47. Verify unpublished products are excluded

## Phase I --- Quality

48. Authentication/security
49. SEO
50. Structured data
51. Accessibility
52. Performance
53. Responsive QA
54. Edge-case QA
55. `npm run lint`
56. `npm run build`

---

# 30. QA Checklist

### Admin

- Login
- Dashboard
- Product CRUD
- Images
- Variants
- Regional prices
- Availability
- Brands
- Categories
- Notes
- Tags
- Related products

### Public

- Homepage
- Catalogue
- Men
- Women
- Unisex
- Product detail
- Brands
- Brand detail
- Guides
- Content pages

### Regions

- LK
- AE
- INTL

### Edge cases

- No image
- One image
- Multiple images
- No variants
- Multiple variants
- Empty optional fields
- No related products
- Regional unavailable product
- Draft product
- Archived product

Final commands:

```bash
npm run lint
npm run build
```

---

# 31. Future Phase 2 --- E-commerce

Do not start Phase 2 until Phase 1 is stable.

Future features:

- Customer accounts
- Addresses
- Order history
- Cart
- Variant selection
- Checkout
- Sri Lanka COD/bank/card
- UAE card/Apple Pay/COD
- Shipping
- Warehouses
- Inventory
- Low-stock alerts
- Orders
- Tracking
- Notifications

---

# 32. Definition of Done

Phase 1 is complete when:

```text
Admin
✓ Product CRUD
✓ Product media
✓ Variants
✓ Regional pricing
✓ Availability
✓ Brands
✓ Categories
✓ Notes
✓ Tags
✓ Related products
✓ Authentication

Public
✓ Homepage
✓ Catalogue
✓ Product detail
✓ Brands
✓ Brand detail
✓ Men/Women/Unisex
✓ Fragrance guide
✓ Content pages
✓ Region-aware pricing

Quality
✓ Images display correctly
✓ Decimal warnings resolved
✓ No unsafe mapping hacks
✓ Mobile tested
✓ Tablet tested
✓ Desktop tested
✓ Accessibility reviewed
✓ SEO reviewed
✓ Performance reviewed
✓ npm run lint passes
✓ npm run build passes
```

---

# 33. Codex Operating Rules

Before changing anything:

1.  Read this README.
2.  Inspect the actual codebase.
3.  Inspect Prisma schema and existing types.
4.  Identify what is already implemented.
5.  Preserve working functionality.
6.  Fix/integrate partial implementations rather than creating
    duplicates.
7.  Never invent fields or relations.
8.  Keep server/client boundaries correct.
9.  Convert Prisma non-serializable values before passing to Client
    Components.
10. Test each phase before moving to the next.
11. Do not move to a later phase while the current phase has broken
    functionality.
12. Keep the approved visual system.
13. Run lint/build at the end of major phases and before declaring
    completion.
