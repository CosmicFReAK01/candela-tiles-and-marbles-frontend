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
    const res = await backendFetch<ProductDto[]>("/api/v1/products", { timeoutMs: 6000 });
    if (res.status === 200 && Array.isArray(res.data)) {
      return res.data.map(mapProductDtoToAdminProduct);
    }
  } catch (err) {
    // Monolith cold-start or network latency
  }
  return [];
}

export async function fetchStorefrontProductBySlug(slug: string): Promise<AdminProduct | null> {
  try {
    const res = await backendFetch<ProductDto>(`/api/v1/products/${encodeURIComponent(slug)}`, { timeoutMs: 6000 });
    if (res.status === 200 && res.data) {
      return mapProductDtoToAdminProduct(res.data);
    }
  } catch (err) {
    // Return null on 404 or backend unavailable
  }
  return null;
}

export async function fetchStorefrontCollections(): Promise<StorefrontCollection[]> {
  try {
    const res = await backendFetch<CollectionDto[]>("/api/v1/collections", { timeoutMs: 6000 });
    if (res.status === 200 && Array.isArray(res.data)) {
      return res.data.map((c) => ({
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
  return [];
}

export async function fetchStorefrontCategories(): Promise<StorefrontCategory[]> {
  try {
    const res = await backendFetch<CategoryDto[]>("/api/v1/categories", { timeoutMs: 6000 });
    if (res.status === 200 && Array.isArray(res.data)) {
      return res.data.map((c) => ({
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
  return [];
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
    }>>("/api/v1/content/homepage", { timeoutMs: 6000 });

    if (res.status === 200 && res.data) {
      const byKey = res.data;
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
