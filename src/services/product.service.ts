import { AdminProduct, ApiResponse } from "@/types";

/**
 * Normalizes any backend or database DTO into a valid, rich AdminProduct
 */
export function normalizeProductDto(p: any): AdminProduct {
  const media = p.media || {};
  const primaryImage =
    media.primaryImage ||
    p.mainImageUrl ||
    p.primary_image_url ||
    p.main_image_url ||
    p.imageUrl ||
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

  return {
    id: String(p.id),
    sku: String(p.sku || p.id),
    name: String(p.name || "Architectural Surface"),
    slug: String(p.slug || p.sku || p.id).toLowerCase(),
    category: p.category || p.material || "Italian Marble",
    categories: Array.isArray(p.categories) && p.categories.length > 0
      ? p.categories
      : [p.category, p.masterCategory, p.subcategory].filter(Boolean),
    masterCategory: p.masterCategory || p.master_category || "Tiles",
    subcategory: p.subcategory || "",
    collectionName: p.collectionName || p.collection_name || "Architectural Series",
    collectionSlug: p.collectionSlug || p.collection_slug || "architectural",
    origin: p.origin || "Italy",
    material: p.material || "Porcelain",
    finish: p.finish || "Polished",
    colour: p.colour || "White",
    shape: p.shape || "Large Slab",
    brand: p.brand || "Candela",
    dimensionsMm: p.dimensionsMm || p.dimensions_mm || "1200 x 600 mm",
    thicknessMm: Number(p.thicknessMm || p.thickness_mm || 12),
    sqftPerBox: Number(p.sqftPerBox || p.sqft_per_box || 16),
    piecesPerBox: Number(p.piecesPerBox || p.pieces_per_box || 2),
    applications: Array.isArray(p.applications) ? p.applications : ["Floor", "Wall"],
    rooms: Array.isArray(p.rooms) ? p.rooms : [],
    shortDescription: p.shortDescription || p.short_description || p.description || "",
    architecturalNotes: p.architecturalNotes || p.architectural_notes || p.description || "",
    inStock: p.inStock !== false && p.in_stock !== false,
    isFeatured: Boolean(p.isFeatured ?? p.is_featured),
    isNewArrival: Boolean(p.isNewArrival ?? p.is_new_arrival),
    pricePerSqftInr: Number(p.pricePerSqftInr ?? p.pricePerSqft ?? p.price_per_sqft ?? p.price ?? 1450),
    dealerPricePerSqftInr: Number(p.dealerPricePerSqftInr ?? p.salePrice ?? p.dealer_price_per_sqft ?? 0),
    stockSqftAvailable: Number(p.stockSqftAvailable ?? p.stock_sqft_available ?? (p.inStock !== false ? 500 : 0)),
    stockUnitsAvailable: Number(p.stockUnitsAvailable ?? p.stock_units_available ?? 0),
    lowStockThresholdSqft: Number(p.lowStockThresholdSqft ?? p.low_stock_threshold ?? 100),
    warehouseZone: p.warehouseZone || p.warehouse_zone || "Bhiwandi Central Depot",
    lastRestockedAt: p.lastRestockedAt || p.last_restocked_at || new Date().toISOString(),
    media: {
      primaryImage,
      galleryImages: Array.isArray(media.galleryImages)
        ? media.galleryImages
        : Array.isArray(p.gallery_images)
        ? p.gallery_images
        : [],
      roughness: Number(media.roughness ?? 0.2),
      veinColorHex: media.veinColorHex || "#FFFFFF",
      baseColorHex: media.baseColorHex || "#F5F5F0",
      glbModelUrl: media.glbModelUrl || p.glbModelUrl,
      frames360Urls: media.frames360Urls || p.frames360Urls,
    },
    specs: p.specs || {},
    status: (p.status?.toLowerCase() === "draft" ? "draft" : "published") as any,
    version: Number(p.version || 1),
  };
}

/**
 * Product Service for fetching and persisting product data to the API Gateway / Database.
 * Fulfills Mandate 2 (Separation of business logic from UI components).
 */
class ProductService {
  /**
   * Fetch products from API Gateway / Database with optional filters
   */
  async getProducts(params?: {
    category?: string;
    subcategory?: string;
    material?: string;
    finish?: string;
    colour?: string;
    q?: string;
    page?: number;
    limit?: number;
  }): Promise<{ products: AdminProduct[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set("category", params.category);
    if (params?.subcategory) searchParams.set("subcategory", params.subcategory);
    if (params?.material) searchParams.set("material", params.material);
    if (params?.finish) searchParams.set("finish", params.finish);
    if (params?.colour) searchParams.set("colour", params.colour);
    if (params?.q) searchParams.set("q", params.q);
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());

    const response = await fetch(`/api/v1/products?${searchParams.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const json = await response.json();
    const rawList = Array.isArray(json)
      ? json
      : Array.isArray(json.data)
      ? json.data
      : Array.isArray(json.products)
      ? json.products
      : [];

    const products = rawList.map(normalizeProductDto);

    return {
      products,
      total: json.pagination?.total || products.length,
    };
  }

  /**
   * Create or update a product in the database
   */
  async saveProduct(product: AdminProduct, isNew = false): Promise<AdminProduct> {
    const method = isNew ? "POST" : "PUT";
    const response = await fetch("/api/v1/products", {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      let errorMsg = "Failed to save product in database";
      try {
        const errorJson = await response.json();
        errorMsg = errorJson.error?.message || errorJson.message || errorMsg;
      } catch {
        // fallback
      }
      throw new Error(errorMsg);
    }

    const json: ApiResponse<AdminProduct> = await response.json();
    return json.data;
  }

  /**
   * Delete a product lot from database
   */
  async deleteProduct(id: string): Promise<boolean> {
    const response = await fetch(`/api/v1/products?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete product from database");
    }

    const json: ApiResponse<{ id: string }> = await response.json();
    return json.success;
  }

  /**
   * Bulk purge un-updated image products
   */
  async purgeUnupdatedProducts(): Promise<{ purgedCount: number; remainingCount: number }> {
    const response = await fetch("/api/v1/admin/products/purge-unupdated", {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Failed to purge un-updated products");
    }

    const json: ApiResponse<{ purgedCount: number; remainingCount: number }> =
      await response.json();
    return json.data;
  }
}

export const productService = new ProductService();
