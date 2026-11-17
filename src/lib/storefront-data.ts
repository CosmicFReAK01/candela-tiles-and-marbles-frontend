/**
 * Storefront Service Layer Client
 * Rewired to proxy exclusively through the Java Spring Boot Modular Monolith.
 * Zero direct PostgreSQL connections from Next.js storefront pages.
 * Handles timeouts, network retries, and cold-start fallback states.
 */

import { backendFetch } from "@/lib/backend-client";
import { DEFAULT_HOMEPAGE_CMS } from "@/lib/catalogue-taxonomy";
import { AdminProduct, CategoryCardData, HomePageCmsData } from "@/types";

export interface ProductDto {
  id: string;
  sku: string;
  name: string;
  slug: string;
  category?: string;
  masterCategory?: string;
  subcategory?: string;
  collectionName?: string;
  collectionSlug?: string;
  brand?: string;
  material?: string;
  finish?: string;
  colour?: string;
  shape?: string;
  origin?: string;
  pricePerSqft?: number;
  salePrice?: number;
  stockSqftAvailable?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  mainImageUrl?: string;
  status?: string;
  shortDescription?: string;
  description?: string;
  version?: number;
}

export interface CollectionDto {
  id: string;
  name: string;
  slug: string;
  description?: string;
  coverImageUrl?: string;
  displayOrder?: number;
  isPublished?: boolean;
  productCount?: number;
  version?: number;
}

export interface CategoryDto {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
  productCount?: number;
  version?: number;
}

export interface StorefrontCollection {
  id: string;
  name: string;
  title: string;
  slug: string;
  description: string;
  cover_image_url: string;
  imageUrl: string;
  display_order: number;
  is_published: boolean;
  product_count: number;
  itemCount: number;
}

export interface StorefrontCategory {
  id: string;
  name: string;
  title: string;
  slug: string;
  description: string;
  image_url: string;
  imageUrl: string;
  display_order: number;
  product_count: number;
  itemCount: number;
}

function mapProductDtoToAdminProduct(dto: ProductDto): AdminProduct {
  return {
    id: dto.id,
    version: dto.version || 1,
    sku: dto.sku || dto.id,
    name: dto.name,
    slug: dto.slug,
    category: (dto.category as any) || "Italian Marble",
    categories: [dto.category, dto.masterCategory, dto.subcategory].filter(Boolean) as string[],
    masterCategory: (dto.masterCategory as any) || "Tiles",
    subcategory: dto.subcategory || "Floor Tiles",
    collectionName: dto.collectionName || "Architectural Series",
    collectionSlug: dto.collectionSlug || "architectural",
    origin: dto.origin || "Italy",
    material: dto.material || "Porcelain",
    finish: (dto.finish as any) || "Polished",
    colour: dto.colour || "White",
    shape: dto.shape || "Large Slab",
    brand: dto.brand || "Candela",
    dimensionsMm: "1200 x 600 mm",
    thicknessMm: 9,
    sqftPerBox: 16,
    piecesPerBox: 2,
    applications: ["Floor", "Wall"],
    shortDescription: dto.shortDescription || dto.name,
    architecturalNotes: dto.description || "",
    inStock: dto.inStock !== false,
    isFeatured: Boolean(dto.isFeatured),
    isNewArrival: false,
    pricePerSqftInr: dto.pricePerSqft || 0,
    dealerPricePerSqftInr: dto.salePrice || 0,
    stockSqftAvailable: dto.stockSqftAvailable || 0,
    lowStockThresholdSqft: 100,
    warehouseZone: "Central Depot",
    media: {
      primaryImage: dto.mainImageUrl || "/images/placeholder.webp",
      galleryImages: [],
      roughness: 0.2,
      veinColorHex: "#FFFFFF",
      baseColorHex: "#F5F5F0",
    },
    specs: {},
    status: (dto.status?.toLowerCase() === "draft" ? "draft" : "published") as any,
  };
}

export async function fetchStorefrontProducts(): Promise<AdminProduct[]> {
  try {
    const res = await backendFetch<ProductDto[]>("/api/v1/products", { timeoutMs: 12000 });
    const list = (res.data as any)?.data ?? res.data;
    if (res.status === 200 && Array.isArray(list)) {
      return list.map(mapProductDtoToAdminProduct);
    }
  } catch (err) {
    // Monolith cold-start or network latency
  }
  return [];
}

export async function fetchStorefrontProductBySlug(slug: string): Promise<AdminProduct | null> {
  try {
    const res = await backendFetch<ProductDto>(`/api/v1/products/${encodeURIComponent(slug)}`, { timeoutMs: 12000 });
    const item = (res.data as any)?.data ?? res.data;
    if (res.status === 200 && item && item.id) {
      return mapProductDtoToAdminProduct(item);
    }
  } catch (err) {
    // Return null on 404 or backend unavailable
  }
  return null;
}

export const DEFAULT_STOREFRONT_COLLECTIONS: StorefrontCollection[] = [
  {
    id: "col-premium",
    name: "Premium Collection",
    title: "Premium Collection",
    slug: "premium",
    description: "Hand-selected monolithic slabs from legacy European quarries with rare geologic formations.",
    cover_image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
    display_order: 1,
    is_published: true,
    product_count: 3,
    itemCount: 3,
  },
  {
    id: "col-luxury",
    name: "Luxury Collection",
    title: "Luxury Collection",
    slug: "luxury",
    description: "Dramatic statement bookmatches and opulent crystalline marbles for grand residences.",
    cover_image_url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85",
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85",
    display_order: 2,
    is_published: true,
    product_count: 2,
    itemCount: 2,
  },
  {
    id: "col-modern",
    name: "Modern Collection",
    title: "Modern Collection",
    slug: "modern",
    description: "Clean lines, subtle textural relief, and minimal architectural palettes.",
    cover_image_url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=85",
    imageUrl: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=85",
    display_order: 3,
    is_published: true,
    product_count: 2,
    itemCount: 2,
  },
  {
    id: "col-natural",
    name: "Natural Collection",
    title: "Natural Collection",
    slug: "natural",
    description: "Organic travertine, split-face slate, and honed limestone for biophilic sanctuaries.",
    cover_image_url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85",
    imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85",
    display_order: 4,
    is_published: true,
    product_count: 0,
    itemCount: 0,
  },
  {
    id: "col-classic",
    name: "Classic Collection",
    title: "Classic Collection",
    slug: "classic",
    description: "Enduring Statuario, Botticino, and timeless neoclassical stones.",
    cover_image_url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85",
    display_order: 5,
    is_published: true,
    product_count: 0,
    itemCount: 0,
  },
  {
    id: "col-new-arrivals",
    name: "New Arrivals",
    title: "New Arrivals",
    slug: "new-arrivals",
    description: "The latest 2026 quarry shipments and technological porcelain surfaces.",
    cover_image_url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=85",
    imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=85",
    display_order: 6,
    is_published: true,
    product_count: 0,
    itemCount: 0,
  },
  {
    id: "col-best-sellers",
    name: "Best Sellers",
    title: "Best Sellers",
    slug: "best-sellers",
    description: "The most specified surfaces by leading Indian architectural firms with verified durability.",
    cover_image_url: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1600&q=85",
    imageUrl: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1600&q=85",
    display_order: 7,
    is_published: true,
    product_count: 1,
    itemCount: 1,
  },
];

export const DEFAULT_STOREFRONT_CATEGORIES: StorefrontCategory[] = [
  {
    id: "cat-tiles",
    name: "Tiles",
    title: "Tiles",
    slug: "tiles",
    description: "Full-body porcelain, glazed vitrified tiles, large-format slabs, and anti-skid surfaces.",
    image_url: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80",
    imageUrl: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80",
    display_order: 1,
    product_count: 8,
    itemCount: 8,
  },
  {
    id: "cat-marbles",
    name: "Marbles",
    title: "Marbles",
    slug: "marbles",
    description: "Quarry-selected natural marble bundles, bookmatched Italian Statuario, Calacatta Viola, Travertino.",
    image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    display_order: 2,
    product_count: 6,
    itemCount: 6,
  },
  {
    id: "cat-sanitaryware",
    name: "Sanitaryware",
    title: "Sanitaryware",
    slug: "sanitaryware",
    description: "Rimless wall-hung WCs, monolithic freestanding stone basins, countertop vessel sinks.",
    image_url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
    display_order: 3,
    product_count: 4,
    itemCount: 4,
  },
  {
    id: "cat-faucets",
    name: "Faucets",
    title: "Faucets",
    slug: "faucets",
    description: "Tall basin mixers, wall-mounted concealed spouts, and thermostatic controls in brushed bronze.",
    image_url: "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?auto=format&fit=crop&w=1200&q=80",
    imageUrl: "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?auto=format&fit=crop&w=1200&q=80",
    display_order: 4,
    product_count: 4,
    itemCount: 4,
  },
  {
    id: "cat-showers",
    name: "Showers",
    title: "Showers",
    slug: "showers",
    description: "Ceiling-recessed rain and waterfall heads, thermostatic multi-way concealed diverters.",
    image_url: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=1200&q=80",
    imageUrl: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=1200&q=80",
    display_order: 5,
    product_count: 4,
    itemCount: 4,
  },
  {
    id: "cat-hardware",
    name: "Hardware",
    title: "Hardware",
    slug: "hardware",
    description: "Diamond-knurled solid brass door levers, linear kitchen pull bars, concealed architectural hinges.",
    image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
    display_order: 6,
    product_count: 5,
    itemCount: 5,
  },
  {
    id: "cat-accessories",
    name: "Bathroom Accessories",
    title: "Bathroom Accessories",
    slug: "bathroom-accessories",
    description: "Solid brass towel rails, minimalist robe hooks, backlit architectural vanity mirrors.",
    image_url: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80",
    imageUrl: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80",
    display_order: 7,
    product_count: 4,
    itemCount: 4,
  },
];

export async function fetchStorefrontCollections(): Promise<StorefrontCollection[]> {
  try {
    const res = await backendFetch<CollectionDto[]>("/api/v1/collections", { timeoutMs: 12000 });
    const list = (res.data as any)?.data ?? res.data;
    if (res.status === 200 && Array.isArray(list) && list.length > 0) {
      return list.map((c: any) => ({
        id: c.id,
        name: c.name,
        title: c.name,
        slug: c.slug,
        description: c.description || "",
        cover_image_url: c.coverImageUrl || "/images/placeholder.webp",
        imageUrl: c.coverImageUrl || "/images/placeholder.webp",
        display_order: c.displayOrder || 0,
        is_published: c.isPublished !== false,
        product_count: c.productCount || 0,
        itemCount: c.productCount || 0,
      }));
    }
  } catch (err) {
    // Cold-start fallback
  }
  return DEFAULT_STOREFRONT_COLLECTIONS;
}

export async function fetchStorefrontCategories(): Promise<StorefrontCategory[]> {
  try {
    const res = await backendFetch<CategoryDto[]>("/api/v1/categories", { timeoutMs: 12000 });
    const list = (res.data as any)?.data ?? res.data;
    if (res.status === 200 && Array.isArray(list) && list.length > 0) {
      return list.map((c: any) => ({
        id: c.id,
        name: c.name,
        title: c.name,
        slug: c.slug,
        description: c.description || "",
        image_url: c.imageUrl || "/images/placeholder.webp",
        imageUrl: c.imageUrl || "/images/placeholder.webp",
        display_order: c.displayOrder || 0,
        product_count: c.productCount || 0,
        itemCount: c.productCount || 0,
      }));
    }
  } catch (err) {
    // Cold-start fallback
  }
  return DEFAULT_STOREFRONT_CATEGORIES;
}

export async function fetchStorefrontHomepageCms(): Promise<{ cms: HomePageCmsData; fallback: boolean }> {
  try {
    const res = await backendFetch<Record<string, {
      sectionKey: string;
      title: string;
      subtitle: string;
      description: string;
      imageUrl: string;
      ctaText: string;
      ctaUrl: string;
    }>>("/api/v1/content/homepage", { timeoutMs: 12000 });

    const byKey: any = (res.data as any)?.data ?? res.data;
    if (res.status === 200 && byKey && typeof byKey === "object") {
      const hero = byKey["hero"];
      const announcement = byKey["announcement"];
      const spotlight = byKey["spotlight"];
      const visualizer = byKey["visualizer"];
      const why = byKey["why_candela"];

      const cms: HomePageCmsData = {
        ...DEFAULT_HOMEPAGE_CMS,
        heroTitle: hero?.title || DEFAULT_HOMEPAGE_CMS.heroTitle,
        heroTagline: hero?.subtitle || DEFAULT_HOMEPAGE_CMS.heroTagline,
        heroDescription: hero?.description || DEFAULT_HOMEPAGE_CMS.heroDescription,
        heroBgImage: hero?.imageUrl || DEFAULT_HOMEPAGE_CMS.heroBgImage,
        heroCtaPrimaryText: hero?.ctaText || DEFAULT_HOMEPAGE_CMS.heroCtaPrimaryText,
        heroCtaPrimaryUrl: hero?.ctaUrl || DEFAULT_HOMEPAGE_CMS.heroCtaPrimaryUrl,
        announcementText: announcement?.subtitle || announcement?.title || DEFAULT_HOMEPAGE_CMS.announcementText,
        spotlightTitle: spotlight?.title || DEFAULT_HOMEPAGE_CMS.spotlightTitle,
        spotlightEyebrow: spotlight?.subtitle || DEFAULT_HOMEPAGE_CMS.spotlightEyebrow,
        spotlightDescription: spotlight?.description || DEFAULT_HOMEPAGE_CMS.spotlightDescription,
        spotlightImage: spotlight?.imageUrl || DEFAULT_HOMEPAGE_CMS.spotlightImage,
        visualizerTitle: visualizer?.title || DEFAULT_HOMEPAGE_CMS.visualizerTitle,
        visualizerEyebrow: visualizer?.subtitle || DEFAULT_HOMEPAGE_CMS.visualizerEyebrow,
        visualizerDescription: visualizer?.description || DEFAULT_HOMEPAGE_CMS.visualizerDescription,
        visualizerImage: visualizer?.imageUrl || DEFAULT_HOMEPAGE_CMS.visualizerImage,
        whyCandelaTitle: why?.title || DEFAULT_HOMEPAGE_CMS.whyCandelaTitle,
        whyCandelaEyebrow: why?.subtitle || DEFAULT_HOMEPAGE_CMS.whyCandelaEyebrow,
        whyCandelaDescription: why?.description || DEFAULT_HOMEPAGE_CMS.whyCandelaDescription,
      };

      return { cms, fallback: false };
    }
  } catch (err) {
    // Cold start fallback
  }

  return { cms: DEFAULT_HOMEPAGE_CMS, fallback: true };
}
