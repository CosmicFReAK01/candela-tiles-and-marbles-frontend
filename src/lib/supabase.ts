import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ENV } from "@/config/env";
import { AdminProduct, MediaAsset } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ENV.SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ENV.SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || "";

/**
 * Returns true if real Supabase credentials are configured
 */
export function isSupabaseConfigured(): boolean {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseUrl.includes("placeholder") &&
    !supabaseUrl.includes("your-project") &&
    !supabaseAnonKey.includes("placeholder") &&
    !supabaseAnonKey.includes("your-anon-key")
  );
}

/**
 * Public Supabase client (client-side & server-side with RLS)
 */
export const supabase: SupabaseClient = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);

/**
 * Privileged Admin Supabase client (server-side operations)
 */
export const supabaseAdmin: SupabaseClient = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseServiceKey || supabaseAnonKey || "placeholder-key"
);

/**
 * Fetch products from Supabase 'products' table
 */
export async function fetchProductsFromSupabase(): Promise<AdminProduct[] | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase
      .from("catalogue_products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase products query error:", error.message);
      return null;
    }

    if (!data) return null;

    // Map database snake_case columns to TypeScript AdminProduct DTO
    return data.map((row: any) => ({
      id: row.id,
      sku: row.sku,
      name: row.name,
      slug: row.slug,
      masterCategory: row.master_category || "Tiles",
      subcategory: row.subcategory || "",
      category: row.category || row.material || "Italian Marble",
      collectionName: row.collection_name || "",
      collectionSlug: row.collection_slug || "",
      finish: row.finish || "Polished",
      origin: row.origin || "Italy",
      dimensionsMm: row.dimensions_mm || "",
      thicknessMm: Number(row.thickness_mm) || 12,
      sqftPerBox: Number(row.sqft_per_box) || 20,
      piecesPerBox: Number(row.pieces_per_box) || 1,
      pricePerSqftInr: Number(row.price_per_sqft) || Number(row.price) || 0,
      dealerPricePerSqftInr: Number(row.dealer_price_per_sqft) || 0,
      stockSqftAvailable: Number(row.stock_sqft_available) || 0,
      lowStockThresholdSqft: Number(row.low_stock_threshold) || 100,
      warehouseZone: row.warehouse_zone || "Bhiwandi Central Depot",
      lastRestockedAt: row.last_restocked_at || new Date().toISOString(),
      inStock: Boolean(row.in_stock ?? true),
      isFeatured: Boolean(row.is_featured),
      shortDescription: row.short_description || row.description || "",
      architecturalNotes: row.architectural_notes || "",
      applications: Array.isArray(row.applications) ? row.applications : ["Floor", "Wall"],
      media: {
        primaryImage: row.main_image_url || row.primary_image_url || "",
        galleryImages: Array.isArray(row.gallery_images) ? row.gallery_images : [],
        roughness: Number(row.roughness) || 0.2,
        veinColorHex: row.vein_color_hex || "#FFFFFF",
        baseColorHex: row.base_color_hex || "#F5F5F0",
      },
      viewer360: row.viewer_360_frames
        ? {
            enabled: Boolean(row.viewer_360_enabled),
            frames: row.viewer_360_frames,
            settings: row.viewer_360_settings || {
              autoRotate: true,
              rotationSpeed: 20,
              direction: "clockwise",
            },
          }
        : undefined,
      specs: row.specifications || row.specs || {},
      status: row.status || "published",
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch (err) {
    console.error("Failed to query Supabase products:", err);
    return null;
  }
}

/**
 * Upsert product into Supabase 'products' table
 */
export async function upsertProductToSupabase(product: AdminProduct): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const dbPayload = {
      id: product.id,
      sku: product.sku,
      name: product.name,
      slug: product.slug,
      master_category: product.masterCategory,
      subcategory: product.subcategory,
      collection_name: product.collectionName,
      collection_slug: product.collectionSlug,
      finish: product.finish,
      origin: product.origin,
      dimensions_mm: product.dimensionsMm,
      thickness_mm: product.thicknessMm,
      sqft_per_box: product.sqftPerBox,
      pieces_per_box: product.piecesPerBox,
      price_per_sqft: product.pricePerSqftInr,
      dealer_price_per_sqft: product.dealerPricePerSqftInr,
      stock_sqft_available: product.stockSqftAvailable,
      low_stock_threshold: product.lowStockThresholdSqft,
      warehouse_zone: product.warehouseZone,
      in_stock: product.inStock,
      is_featured: product.isFeatured,
      main_image_url: product.media.primaryImage,
      gallery_images: product.media.galleryImages || [],
      is_image_updated: Boolean(product.media.primaryImage),
      viewer_360_enabled: Boolean(product.viewer360?.enabled),
      viewer_360_frames: product.viewer360?.frames || [],
      viewer_360_settings: product.viewer360?.settings || {},
      specifications: product.specs || {},
      short_description: product.shortDescription,
      architectural_notes: product.architecturalNotes,
      status: product.status || "published",
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabaseAdmin.from("products").upsert(dbPayload, {
      onConflict: "id",
    });

    if (error) {
      console.warn("Supabase product upsert error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to upsert to Supabase:", err);
    return false;
  }
}

/**
 * Delete product from Supabase 'products' table
 */
export async function deleteProductFromSupabase(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
    if (error) {
      console.warn("Supabase product delete error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to delete from Supabase:", err);
    return false;
  }
}

/**
 * Upload an image file to Supabase Storage bucket
 */
export async function uploadImageToSupabaseStorage(
  file: File | Buffer,
  filename: string,
  contentType: string,
  bucketName = "candela-media"
): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(filename, file, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.warn("Supabase storage upload error:", error.message);
      return null;
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(filename);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error("Failed to upload to Supabase storage:", err);
    return null;
  }
}

/**
 * Delete an object from Supabase Storage bucket (compensation on failed DB insert)
 */
export async function deleteImageFromSupabaseStorage(
  filename: string,
  bucketName = "candela-media"
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabaseAdmin.storage.from(bucketName).remove([filename]);
    if (error) {
      console.warn(`Failed to remove orphaned storage object '${filename}' from '${bucketName}':`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`Exception during storage orphan cleanup of '${filename}':`, err);
    return false;
  }
}

/**
 * Insert record into Supabase 'media' table
 */
export async function recordMediaInSupabase(asset: MediaAsset): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const { error } = await supabaseAdmin.from("media").insert({
      id: asset.id,
      filename: asset.fileName,
      original_filename: asset.originalName,
      file_url: asset.url,
      file_type: asset.sourceType === "EXTERNAL_URL" ? "EXTERNAL_URL" : "IMAGE",
      mime_type: asset.mimeType,
      file_size_bytes: asset.sizeBytes,
      alt_text: asset.altText,
      created_at: asset.createdAt,
    });

    if (error) {
      console.warn("Supabase media table insert error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to record media in Supabase:", err);
    return false;
  }
}
