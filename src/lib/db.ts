import { Pool, PoolConfig } from "pg";
import { AdminProduct, MediaAsset } from "@/types";

// Resilient PostgreSQL Connection Pool Config (Configured manually via environment variables)
export function isDbConfigured(): boolean {
  if (
    process.env.DATABASE_URL &&
    process.env.DATABASE_URL.trim() !== "" &&
    !process.env.DATABASE_URL.includes("placeholder") &&
    !process.env.DATABASE_URL.includes("<project-ref>")
  ) {
    return true;
  }
  return Boolean(
    process.env.DB_HOST &&
    process.env.DB_USER &&
    process.env.DB_PASSWORD &&
    !process.env.DB_HOST.includes("placeholder") &&
    !process.env.DB_HOST.includes("example.com")
  );
}

function getPoolConfig(): PoolConfig {
  let connectionString = process.env.DATABASE_URL?.trim();
  if (connectionString && connectionString.startsWith("jdbc:")) {
    connectionString = connectionString.replace(/^jdbc:/, "");
  }
  const isSsl =
    process.env.DB_SSL === "true" ||
    Boolean(connectionString && (connectionString.includes("supabase.com") || connectionString.includes("sslmode=require")));

  if (connectionString) {
    return {
      connectionString,
      ssl: isSsl ? { rejectUnauthorized: false } : undefined,
      max: 5,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 10000,
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000,
    };
  }

  return {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432", 10),
    database: process.env.DB_NAME || "postgres",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: isSsl ? { rejectUnauthorized: false } : undefined,
    max: 5,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 10000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
  };
}

let pool: Pool | null = null;

export function getDbPool(): Pool {
  if (!pool) {
    pool = new Pool(getPoolConfig());
    pool.on("error", (err) => {
      // In PgBouncer transaction pooling mode, idle clients are periodically reclaimed upstream.
      // We log gracefully and allow new clients to be acquired on demand.
      console.warn("Notice: PostgreSQL pool client closed idle connection:", err.message);
    });
  }
  return pool;
}

/**
 * Execute a parameterized query with automatic retry on stale connection drops
 */
export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  if (!isDbConfigured()) {
    // Database connection is not manually configured; return empty array safely
    return [];
  }

  const p = getDbPool();
  try {
    const res = await p.query(text, params);
    return res.rows as T[];
  } catch (err: any) {
    const isConnError =
      err?.message &&
      (err.message.includes("Connection terminated") ||
        err.message.includes("timeout") ||
        err.message.includes("closed"));
    if (isConnError) {
      console.warn("Connection dropped by pooler; re-executing query with fresh client...");
      const res = await p.query(text, params);
      return res.rows as T[];
    }
    throw err;
  }
}

/**
 * Check if the PostgreSQL database connection is alive
 */
export async function checkDbConnection(): Promise<boolean> {
  try {
    const res = await query("SELECT 1 as connected");
    return Boolean(res && res.length > 0 && res[0].connected === 1);
  } catch (err) {
    console.error("Database connection check failed:", err);
    return false;
  }
}

/**
 * Fetch all products directly from Supabase PostgreSQL database
 */
export async function getProductsFromPostgres(): Promise<AdminProduct[]> {
  try {
    const sql = `
      SELECT 
        p.*,
        COALESCE(
          json_agg(
            json_build_object('key', ps.spec_key, 'value', ps.spec_value)
          ) FILTER (WHERE ps.id IS NOT NULL), '[]'
        ) as spec_list
      FROM products p
      LEFT JOIN product_specifications ps ON p.id = ps.product_id
      GROUP BY p.id
      ORDER BY p.created_at DESC;
    `;
    const rows = await query(sql);
    return (rows || []).map(mapRowToAdminProduct);
  } catch (err) {
    console.error("Failed to query products from PostgreSQL:", err);
    throw err;
  }
}

/**
 * Save / Update a product directly in Supabase PostgreSQL
 */
export async function upsertProductToPostgres(product: AdminProduct): Promise<AdminProduct> {
  if (!isDbConfigured()) {
    throw new Error("Database is not configured. Please manually set DATABASE_URL or DB_HOST in your environment variables.");
  }
  const p = getDbPool();
  const client = await p.connect();

  try {
    await client.query("BEGIN");

    // Upsert products table
    const productSql = `
      INSERT INTO products (
        id, sku, name, slug, description, brand, material, finish, colour, shape,
        size_label, thickness, application, price, main_image_url, is_3d_enabled,
        status, is_featured, meta_title, meta_description, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16,
        $17, $18, $19, $20, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        sku = EXCLUDED.sku,
        name = EXCLUDED.name,
        slug = EXCLUDED.slug,
        description = EXCLUDED.description,
        brand = EXCLUDED.brand,
        material = EXCLUDED.material,
        finish = EXCLUDED.finish,
        colour = EXCLUDED.colour,
        shape = EXCLUDED.shape,
        size_label = EXCLUDED.size_label,
        thickness = EXCLUDED.thickness,
        application = EXCLUDED.application,
        price = EXCLUDED.price,
        main_image_url = EXCLUDED.main_image_url,
        is_3d_enabled = EXCLUDED.is_3d_enabled,
        status = EXCLUDED.status,
        is_featured = EXCLUDED.is_featured,
        meta_title = EXCLUDED.meta_title,
        meta_description = EXCLUDED.meta_description,
        updated_at = NOW();
    `;

    const productValues = [
      product.id,
      product.sku,
      product.name,
      product.slug,
      product.shortDescription || "",
      product.brand || "Candela Atelier",
      product.material || product.category || "Italian Marble",
      product.finish || "Polished",
      product.colour || "Bianco",
      product.shape || "Large Slab",
      product.dimensionsMm || "1600 x 3200 mm",
      product.thicknessMm || 18,
      (product.applications && product.applications[0]) || "Floor",
      product.pricePerSqftInr || 0,
      product.media?.primaryImage || "",
      Boolean(product.viewer360?.enabled),
      product.status || "published",
      Boolean(product.isFeatured),
      product.name,
      product.architecturalNotes || product.shortDescription || "",
    ];

    await client.query(productSql, productValues);

    // Update specs if present
    if (product.specs && typeof product.specs === "object") {
      await client.query("DELETE FROM product_specifications WHERE product_id = $1", [product.id]);
      for (const [key, value] of Object.entries(product.specs)) {
        if (value && typeof value === "string") {
          await client.query(
            "INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES ($1, $2, $3)",
            [product.id, key, value]
          );
        }
      }
    }

    await client.query("COMMIT");
    return product;
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Failed to upsert product in PostgreSQL:", err);
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Delete a product from PostgreSQL
 */
export async function deleteProductFromPostgres(id: string): Promise<boolean> {
  try {
    const res = await query("DELETE FROM products WHERE id = $1 OR sku = $1", [id]);
    return true;
  } catch (err) {
    console.error("Failed to delete product from PostgreSQL:", err);
    return false;
  }
}

/**
 * Record an uploaded media asset into PostgreSQL media table
 */
export async function recordMediaInPostgres(asset: MediaAsset): Promise<boolean> {
  try {
    const sql = `
      INSERT INTO media (
        id, filename, original_filename, file_url, file_type, mime_type, file_size_bytes, alt_text
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id) DO UPDATE SET
        file_url = EXCLUDED.file_url,
        alt_text = EXCLUDED.alt_text;
    `;
    await query(sql, [
      asset.id,
      asset.fileName,
      asset.originalName || asset.fileName,
      asset.url,
      asset.sourceType === "EXTERNAL_URL" ? "EXTERNAL_URL" : "IMAGE",
      asset.mimeType || "image/jpeg",
      asset.sizeBytes || 0,
      asset.altText || asset.fileName,
    ]);
    return true;
  } catch (err) {
    console.error("Failed to record media in PostgreSQL:", err);
    return false;
  }
}

/**
 * Fetch a single product by slug directly from PostgreSQL
 */
export async function getProductBySlugFromPostgres(slug: string): Promise<AdminProduct | null> {
  try {
    const sql = `
      SELECT 
        p.*,
        COALESCE(
          json_agg(
            json_build_object('key', ps.spec_key, 'value', ps.spec_value)
          ) FILTER (WHERE ps.id IS NOT NULL), '[]'
        ) as spec_list
      FROM products p
      LEFT JOIN product_specifications ps ON p.id = ps.product_id
      WHERE LOWER(p.slug) = LOWER($1)
      GROUP BY p.id
      LIMIT 1;
    `;
    const rows = await query(sql, [slug]);
    if (!rows || rows.length === 0) return null;
    return mapRowToAdminProduct(rows[0]);
  } catch (err) {
    console.error(`Failed to query product slug=${slug} from PostgreSQL:`, err);
    return null;
  }
}

/**
 * Purge un-updated / placeholder-image products directly in PostgreSQL
 */
export async function purgeUnupdatedProductsInPostgres(): Promise<{
  purgedCount: number;
  remainingCount: number;
}> {
  const purged = await query<{ id: string }>(
    `DELETE FROM products
     WHERE main_image_url IS NULL
        OR TRIM(main_image_url) = ''
        OR LOWER(main_image_url) LIKE '%placeholder%'
     RETURNING id`
  );
  const countRows = await query<{ c: number }>(`SELECT COUNT(*)::int AS c FROM products`);
  return {
    purgedCount: purged.length,
    remainingCount: countRows[0]?.c ?? 0,
  };
}

/**
 * Map PostgreSQL row back to TypeScript AdminProduct DTO
 */
function mapRowToAdminProduct(row: any): AdminProduct {
  // Extract specs from aggregated list
  const specs: Record<string, string> = {};
  if (Array.isArray(row.spec_list)) {
    for (const item of row.spec_list) {
      if (item && item.key) {
        specs[item.key] = item.value;
      }
    }
  }

  return {
    id: row.id,
    version: Number(row.version) || 1,
    sku: row.sku,
    name: row.name,
    slug: row.slug,
    masterCategory: row.master_category || "Tiles",
    subcategory: row.subcategory || "",
    category: row.material || "Italian Marble",
    collectionName: row.collection_name || "Premium Collection",
    collectionSlug: row.collection_slug || "premium",
    finish: row.finish || "Polished",
    origin: row.origin || "Italy",
    dimensionsMm: row.size_label || row.dimensions_mm || "1600 x 3200 mm",
    thicknessMm: Number(row.thickness) || 18,
    sqftPerBox: Number(row.sqft_per_box) || 20,
    piecesPerBox: Number(row.pieces_per_box) || 1,
    applications: row.application ? [row.application] : ["Floor", "Wall"],
    shortDescription: row.description || "",
    architecturalNotes: row.meta_description || "",
    inStock: row.status !== "OUT_OF_STOCK",
    isFeatured: Boolean(row.is_featured),
    pricePerSqftInr: Number(row.price) || 0,
    dealerPricePerSqftInr: Number(row.sale_price) || 0,
    stockSqftAvailable: 500,
    lowStockThresholdSqft: 100,
    warehouseZone: "Bhiwandi Central Depot",
    lastRestockedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
    media: {
      primaryImage: row.main_image_url || "",
      galleryImages: [],
      roughness: 0.2,
      veinColorHex: "#FFFFFF",
      baseColorHex: "#F5F5F0",
    },
    specs,
    status: row.status?.toLowerCase() === "draft" ? "draft" : "published",
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
  };
}

/**
 * ────────────────────────────────────────────────────────────────────────────
 * WEBSITE & CMS HELPERS (Homepage, Pages, Navigation)
 * ────────────────────────────────────────────────────────────────────────────
 */

export interface HomepageSectionRecord {
  id: string;
  section_key: string;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  cta_text: string;
  cta_url: string;
  extra_data?: any;
  is_active: boolean;
  updated_at?: string;
}

export async function getHomepageContentFromPostgres(): Promise<HomepageSectionRecord[]> {
  try {
    return await query<HomepageSectionRecord>(
      "SELECT * FROM homepage_content ORDER BY created_at ASC"
    );
  } catch (err) {
    console.error("Failed to fetch homepage content:", err);
    return [];
  }
}

export async function updateHomepageSectionInPostgres(
  sectionKey: string,
  data: Partial<HomepageSectionRecord>
): Promise<boolean> {
  try {
    await query(
      `UPDATE homepage_content
       SET title = COALESCE($1, title),
           subtitle = COALESCE($2, subtitle),
           description = COALESCE($3, description),
           image_url = COALESCE($4, image_url),
           cta_text = COALESCE($5, cta_text),
           cta_url = COALESCE($6, cta_url),
           extra_data = COALESCE($7, extra_data),
           is_active = COALESCE($8, is_active),
           updated_at = NOW()
       WHERE section_key = $9`,
      [
        data.title,
        data.subtitle,
        data.description,
        data.image_url,
        data.cta_text,
        data.cta_url,
        data.extra_data ? JSON.stringify(data.extra_data) : null,
        data.is_active,
        sectionKey,
      ]
    );
    return true;
  } catch (err) {
    console.error(`Failed to update homepage section ${sectionKey}:`, err);
    return false;
  }
}

export interface SitePageRecord {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  hero_image_url: string;
  content: string;
  sections?: any;
  meta_title?: string;
  meta_description?: string;
  is_published: boolean;
  updated_at?: string;
}

export async function getSitePagesFromPostgres(): Promise<SitePageRecord[]> {
  try {
    return await query<SitePageRecord>(
      "SELECT * FROM site_pages ORDER BY title ASC"
    );
  } catch (err) {
    console.error("Failed to fetch site pages:", err);
    return [];
  }
}

export async function updateSitePageInPostgres(
  slug: string,
  data: Partial<SitePageRecord>
): Promise<boolean> {
  try {
    await query(
      `UPDATE site_pages
       SET title = COALESCE($1, title),
           subtitle = COALESCE($2, subtitle),
           hero_image_url = COALESCE($3, hero_image_url),
           content = COALESCE($4, content),
           meta_title = COALESCE($5, meta_title),
           meta_description = COALESCE($6, meta_description),
           is_published = COALESCE($7, is_published),
           updated_at = NOW()
       WHERE slug = $8`,
      [
        data.title,
        data.subtitle,
        data.hero_image_url,
        data.content,
        data.meta_title,
        data.meta_description,
        data.is_published,
        slug,
      ]
    );
    return true;
  } catch (err) {
    console.error(`Failed to update site page ${slug}:`, err);
    return false;
  }
}

export interface SiteNavigationRecord {
  id: string;
  nav_group: string;
  label: string;
  url: string;
  display_order: number;
  is_active: boolean;
  open_in_new_tab: boolean;
  updated_at?: string;
}

export async function getSiteNavigationFromPostgres(): Promise<SiteNavigationRecord[]> {
  try {
    return await query<SiteNavigationRecord>(
      "SELECT * FROM site_navigation ORDER BY nav_group, display_order ASC"
    );
  } catch (err) {
    console.error("Failed to fetch site navigation:", err);
    return [];
  }
}

export async function upsertSiteNavigationInPostgres(
  item: Partial<SiteNavigationRecord>
): Promise<boolean> {
  try {
    const id = item.id || `nav-${Date.now()}`;
    await query(
      `INSERT INTO site_navigation (id, nav_group, label, url, display_order, is_active, open_in_new_tab, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       ON CONFLICT (id) DO UPDATE SET
         nav_group = EXCLUDED.nav_group,
         label = EXCLUDED.label,
         url = EXCLUDED.url,
         display_order = EXCLUDED.display_order,
         is_active = EXCLUDED.is_active,
         open_in_new_tab = EXCLUDED.open_in_new_tab,
         updated_at = NOW()`,
      [
        id,
        item.nav_group || "header",
        item.label || "New Link",
        item.url || "/",
        item.display_order || 0,
        item.is_active ?? true,
        item.open_in_new_tab ?? false,
      ]
    );
    return true;
  } catch (err) {
    console.error("Failed to upsert site navigation item:", err);
    return false;
  }
}

export async function deleteSiteNavigationInPostgres(id: string): Promise<boolean> {
  try {
    await query("DELETE FROM site_navigation WHERE id = $1", [id]);
    return true;
  } catch (err) {
    console.error("Failed to delete navigation item:", err);
    return false;
  }
}

/**
 * ────────────────────────────────────────────────────────────────────────────
 * CATALOGUE & INVENTORY HELPERS (Categories, Collections, Restock)
 * ────────────────────────────────────────────────────────────────────────────
 */

export interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
  version?: number;
  product_count?: number;
  total_stock_sqft?: number;
}

export async function getCategoriesWithMetricsFromPostgres(): Promise<CategoryRecord[]> {
  try {
    const sql = `
      SELECT 
        c.*,
        COALESCE(c.version, 1) as version,
        COUNT(p.id) as product_count,
        COALESCE(SUM(p.stock_sqft_available), 0) as total_stock_sqft
      FROM categories c
      LEFT JOIN products p ON (p.master_category = c.name OR p.category = c.name)
      GROUP BY c.id
      ORDER BY c.display_order ASC;
    `;
    const rows = await query(sql);
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      description: r.description,
      image_url: r.image_url,
      display_order: r.display_order,
      is_active: r.is_active,
      version: Number(r.version) || 1,
      product_count: Number(r.product_count) || 0,
      total_stock_sqft: Number(r.total_stock_sqft) || 0,
    }));
  } catch (err) {
    console.error("Failed to fetch categories with metrics:", err);
    return [];
  }
}

export async function updateCategoryInPostgres(
  id: string,
  data: Partial<CategoryRecord>
): Promise<{ success: boolean; conflict?: boolean }> {
  try {
    if (data.version !== undefined && data.version !== null) {
      const res = await query(
        `UPDATE categories
         SET name = COALESCE($1, name),
             description = COALESCE($2, description),
             image_url = COALESCE($3, image_url),
             display_order = COALESCE($4, display_order),
             is_active = COALESCE($5, is_active),
             version = version + 1,
             updated_at = NOW()
         WHERE id = $6 AND version = $7
         RETURNING id, version`,
        [data.name, data.description, data.image_url, data.display_order, data.is_active, id, data.version]
      );
      if (!res || res.length === 0) {
        return { success: false, conflict: true };
      }
      return { success: true };
    }

    await query(
      `UPDATE categories
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           image_url = COALESCE($3, image_url),
           display_order = COALESCE($4, display_order),
           is_active = COALESCE($5, is_active),
           version = version + 1,
           updated_at = NOW()
       WHERE id = $6`,
      [data.name, data.description, data.image_url, data.display_order, data.is_active, id]
    );
    return { success: true };
  } catch (err) {
    console.error(`Failed to update category ${id}:`, err);
    return { success: false };
  }
}

export async function restockCategoryInPostgres(
  categoryName: string,
  addedStockSqft: number
): Promise<number> {
  try {
    const res = await query(
      `UPDATE products
       SET stock_sqft_available = COALESCE(stock_sqft_available, 0) + $1,
           last_restocked_at = NOW(),
           in_stock = true,
           updated_at = NOW()
       WHERE master_category = $2 OR category = $2
       RETURNING id`,
      [addedStockSqft, categoryName]
    );
    return res.length;
  } catch (err) {
    console.error(`Failed to restock category ${categoryName}:`, err);
    return 0;
  }
}

export interface CollectionRecord {
  id: string;
  name: string;
  slug: string;
  description: string;
  cover_image_url: string;
  display_order: number;
  is_published: boolean;
  product_count?: number;
}

export async function getCollectionsWithMetricsFromPostgres(): Promise<CollectionRecord[]> {
  try {
    const sql = `
      SELECT 
        c.*,
        COUNT(p.id) as product_count
      FROM collections c
      LEFT JOIN products p ON p.collection_slug = c.slug
      GROUP BY c.id
      ORDER BY c.display_order ASC;
    `;
    const rows = await query(sql);
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      description: r.description,
      cover_image_url: r.cover_image_url,
      display_order: r.display_order,
      is_published: r.is_published,
      product_count: Number(r.product_count) || 0,
    }));
  } catch (err) {
    console.error("Failed to fetch collections:", err);
    return [];
  }
}

export async function updateCollectionInPostgres(
  id: string,
  data: Partial<CollectionRecord>
): Promise<boolean> {
  try {
    await query(
      `UPDATE collections
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           cover_image_url = COALESCE($3, cover_image_url),
           display_order = COALESCE($4, display_order),
           is_published = COALESCE($5, is_published),
           updated_at = NOW()
       WHERE id = $6`,
      [data.name, data.description, data.cover_image_url, data.display_order, data.is_published, id]
    );
    return true;
  } catch (err) {
    console.error(`Failed to update collection ${id}:`, err);
    return false;
  }
}

/**
 * ────────────────────────────────────────────────────────────────────────────
 * SALES ANALYTICS HELPERS (Weekly, Monthly, Yearly)
 * ────────────────────────────────────────────────────────────────────────────
 */

export interface SalesOrderRecord {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  project_city?: string;
  product_id?: string;
  product_sku?: string;
  product_name: string;
  master_category: string;
  quantity_sqft: number;
  unit_price_inr: number;
  total_amount_inr: number;
  order_status: string;
  payment_method?: string;
  created_at: string;
}

export interface SalesAnalyticsPayload {
  summary: {
    totalRevenueInr: number;
    totalSqftSold: number;
    totalOrders: number;
    averageOrderValueInr: number;
  };
  timeSeries: { label: string; revenue: number; sqft: number; orders: number }[];
  topProducts: { name: string; category: string; revenue: number; sqft: number }[];
  recentOrders: SalesOrderRecord[];
}

export async function getSalesAnalyticsFromPostgres(
  timeframe: "weekly" | "monthly" | "yearly" = "monthly"
): Promise<SalesAnalyticsPayload> {
  try {
    let dateFilter = "created_at >= NOW() - INTERVAL '30 days'";
    if (timeframe === "weekly") {
      dateFilter = "created_at >= NOW() - INTERVAL '7 days'";
    } else if (timeframe === "yearly") {
      dateFilter = "created_at >= NOW() - INTERVAL '3 years'";
    }

    // Orders list
    const ordersSql = `
      SELECT * FROM sales_orders
      WHERE ${dateFilter}
      ORDER BY created_at DESC
      LIMIT 50;
    `;
    const orders = await query<SalesOrderRecord>(ordersSql);

    // Summary calculation
    const summarySql = `
      SELECT 
        COALESCE(SUM(total_amount_inr), 0) as total_rev,
        COALESCE(SUM(quantity_sqft), 0) as total_sqft,
        COUNT(*) as total_count,
        COALESCE(AVG(total_amount_inr), 0) as avg_order
      FROM sales_orders
      WHERE ${dateFilter};
    `;
    const summaryRes = await query(summarySql);
    const summary = {
      totalRevenueInr: Number(summaryRes[0]?.total_rev) || 0,
      totalSqftSold: Number(summaryRes[0]?.total_sqft) || 0,
      totalOrders: Number(summaryRes[0]?.total_count) || 0,
      averageOrderValueInr: Number(summaryRes[0]?.avg_order) || 0,
    };

    // Time series grouping
    let groupFormat = "Day";
    let truncParam = "day";
    if (timeframe === "weekly") {
      truncParam = "day";
      groupFormat = "Dy, DD Mon";
    } else if (timeframe === "monthly") {
      truncParam = "month";
      groupFormat = "Mon YYYY";
    } else {
      truncParam = "year";
      groupFormat = "YYYY";
    }

    const timeSeriesSql = `
      SELECT 
        TO_CHAR(DATE_TRUNC('${truncParam}', created_at), '${groupFormat}') as label,
        DATE_TRUNC('${truncParam}', created_at) as sort_date,
        SUM(total_amount_inr) as revenue,
        SUM(quantity_sqft) as sqft,
        COUNT(*) as orders
      FROM sales_orders
      WHERE ${dateFilter}
      GROUP BY sort_date, label
      ORDER BY sort_date ASC;
    `;
    const timeSeriesRows = await query(timeSeriesSql);
    const timeSeries = timeSeriesRows.map((r) => ({
      label: r.label,
      revenue: Number(r.revenue) || 0,
      sqft: Number(r.sqft) || 0,
      orders: Number(r.orders) || 0,
    }));

    // Top products
    const topProdSql = `
      SELECT 
        product_name as name,
        master_category as category,
        SUM(total_amount_inr) as revenue,
        SUM(quantity_sqft) as sqft
      FROM sales_orders
      WHERE ${dateFilter}
      GROUP BY product_name, master_category
      ORDER BY revenue DESC
      LIMIT 5;
    `;
    const topProdRows = await query(topProdSql);
    const topProducts = topProdRows.map((r) => ({
      name: r.name,
      category: r.category,
      revenue: Number(r.revenue) || 0,
      sqft: Number(r.sqft) || 0,
    }));

    return {
      summary,
      timeSeries,
      topProducts,
      recentOrders: orders,
    };
  } catch (err) {
    console.error("Failed to query sales analytics:", err);
    return {
      summary: { totalRevenueInr: 0, totalSqftSold: 0, totalOrders: 0, averageOrderValueInr: 0 },
      timeSeries: [],
      topProducts: [],
      recentOrders: [],
    };
  }
}

/**
 * ────────────────────────────────────────────────────────────────────────────
 * CASCADING MEDIA REPLACEMENT
 * Updates an image URL across media, products, homepage, site_pages, and collections
 * ────────────────────────────────────────────────────────────────────────────
 */

export interface CascadeImageUpdateResult {
  productsUpdated: number;
  homepageUpdated: number;
  pagesUpdated: number;
  collectionsUpdated: number;
  mediaUpdated: number;
}

export async function cascadeImageUpdateInPostgres(
  oldUrl: string,
  newUrl: string
): Promise<CascadeImageUpdateResult> {
  const result: CascadeImageUpdateResult = {
    productsUpdated: 0,
    homepageUpdated: 0,
    pagesUpdated: 0,
    collectionsUpdated: 0,
    mediaUpdated: 0,
  };

  if (!oldUrl || !newUrl || oldUrl === newUrl) {
    return result;
  }

  try {
    // 1. Update products main_image_url
    const prodRes = await query(
      `UPDATE products 
       SET main_image_url = $1, is_image_updated = true, updated_at = NOW() 
       WHERE main_image_url = $2 
       RETURNING id`,
      [newUrl, oldUrl]
    );
    result.productsUpdated = prodRes.length;

    // 2. Update homepage_content
    const homeRes = await query(
      `UPDATE homepage_content 
       SET image_url = $1, updated_at = NOW() 
       WHERE image_url = $2 
       RETURNING id`,
      [newUrl, oldUrl]
    );
    result.homepageUpdated = homeRes.length;

    // 3. Update site_pages
    const pageRes = await query(
      `UPDATE site_pages 
       SET hero_image_url = $1, updated_at = NOW() 
       WHERE hero_image_url = $2 
       RETURNING id`,
      [newUrl, oldUrl]
    );
    result.pagesUpdated = pageRes.length;

    // 4. Update collections
    const colRes = await query(
      `UPDATE collections 
       SET cover_image_url = $1, updated_at = NOW() 
       WHERE cover_image_url = $2 
       RETURNING id`,
      [newUrl, oldUrl]
    );
    result.collectionsUpdated = colRes.length;

    // 5. Update media registry
    const mediaRes = await query(
      `UPDATE media 
       SET file_url = $1 
       WHERE file_url = $2 
       RETURNING id`,
      [newUrl, oldUrl]
    );
    result.mediaUpdated = mediaRes.length;

    return result;
  } catch (err) {
    console.error("Failed to execute cascade image update in PostgreSQL:", err);
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ENQUIRIES & LEAD MANAGEMENT (Live PostgreSQL Persistence)
// ─────────────────────────────────────────────────────────────────────────────

export interface DbEnquiryInput {
  referenceCode?: string;
  clientName: string;
  customerPhone?: string;
  customerEmail?: string;
  productName?: string;
  quantityArea?: string;
  projectType?: string;
  notes?: string;
  status?: string;
  assignedAdvisor?: string;
  trackingTokenHash?: string;
}

export async function createEnquiryInPostgres(
  input: DbEnquiryInput
): Promise<{ id: string; referenceCode: string }> {
  const referenceCode =
    input.referenceCode || `CND-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  if (!isDbConfigured()) {
    console.warn("Database not configured, skipping PostgreSQL enquiry persistence.");
    return { id: `enq-local-${Date.now()}`, referenceCode };
  }

  try {
    const sql = `
      INSERT INTO public.enquiries (
        reference_no,
        customer_name,
        customer_phone,
        customer_email,
        product_name,
        quantity_area,
        project_type,
        message,
        status,
        notes,
        tracking_token_hash,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
      RETURNING id, reference_no;
    `;

    const rows = await query<{ id: string; reference_no: string }>(sql, [
      referenceCode,
      input.clientName,
      input.customerPhone || null,
      input.customerEmail || null,
      input.productName || "General Architectural Surfaces",
      input.quantityArea || null,
      input.projectType || "Architectural Specification",
      input.notes || null,
      input.status || "RECEIVED",
      input.assignedAdvisor ? `Assigned to: ${input.assignedAdvisor}` : null,
      input.trackingTokenHash || null,
    ]);

    return {
      id: rows[0]?.id || `enq-${Date.now()}`,
      referenceCode: rows[0]?.reference_no || referenceCode,
    };
  } catch (err) {
    console.error("Failed to insert enquiry into PostgreSQL:", err);
    throw err;
  }
}

export async function getEnquiriesFromPostgres(): Promise<any[]> {
  if (!isDbConfigured()) return [];

  try {
    const rows = await query(`
      SELECT 
        id,
        COALESCE(reference_no, id::text) as "referenceCode",
        customer_name as "clientName",
        customer_phone as "phoneWhatsApp",
        customer_email as "email",
        project_type as "role",
        product_name as "productName",
        quantity_area as "quantityArea",
        message as "notes",
        status,
        notes as "internalNotes",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM public.enquiries
      ORDER BY created_at DESC
      LIMIT 100;
    `);

    return (rows || []).map((r) => ({
      ...r,
      items: [],
      projectCity: "Mumbai / MMR",
      projectTimeline: "1-3 Months",
      assignedAdvisor: "Bhiwandi & Turbhe Central Technical Desk",
    }));
  } catch (err) {
    console.error("Failed to query enquiries from PostgreSQL:", err);
    return [];
  }
}

export async function getEnquiryByReferenceCodeFromPostgres(referenceCode: string) {
  if (!isDbConfigured() || !referenceCode?.trim()) return null;

  const cleanCode = referenceCode.trim();
  try {
    const rows = await query(
      `
      SELECT
        id,
        COALESCE(reference_no, id::text) AS reference_code,
        customer_name,
        customer_phone,
        customer_email,
        product_name,
        quantity_area,
        project_type,
        message,
        status,
        notes,
        tracking_token_hash,
        created_at,
        updated_at
      FROM public.enquiries
      WHERE UPPER(reference_no) = UPPER($1) OR id::text = $1
      LIMIT 1;
      `,
      [cleanCode]
    );

    if (!rows || rows.length === 0) return null;

    const r = rows[0];
    return {
      id: String(r.id),
      referenceCode: String(r.reference_code),
      clientName: String(r.customer_name || "Architectural Client"),
      firmOrProjectName: r.project_type || "Architectural Specification",
      role: "Architect / Interior Designer" as const,
      phoneWhatsApp: r.customer_phone || "",
      email: r.customer_email || "",
      projectCity: "Mumbai / MMR",
      projectTimeline: "1-3 Months" as const,
      notes: r.message || "",
      status: String(r.status || "RECEIVED").toUpperCase(),
      assignedAdvisor: r.notes?.replace(/^Assigned to:\s*/i, "") || "Bhiwandi & Turbhe Central Technical Desk",
      trackingTokenHash: r.tracking_token_hash ? String(r.tracking_token_hash) : null,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      items: [],
    };
  } catch (err) {
    console.error("Failed to lookup enquiry by reference code:", err);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// LIVE CATALOGUE SEARCH & MEDIA QUERIES (PostgreSQL Only)
// ─────────────────────────────────────────────────────────────────────────────

export async function searchCatalogueInPostgres(searchTerm: string): Promise<{
  products: AdminProduct[];
  collections: any[];
}> {
  if (!isDbConfigured() || !searchTerm?.trim()) {
    return { products: [], collections: [] };
  }

  const pattern = `%${searchTerm.trim()}%`;

  try {
    const productRows = await query(
      `
      SELECT *
      FROM public.catalogue_products
      WHERE COALESCE(status, 'published') = 'published'
        AND (
          name ILIKE $1 OR
          sku ILIKE $1 OR
          COALESCE(short_description, '') ILIKE $1 OR
          COALESCE(description, '') ILIKE $1 OR
          COALESCE(category, '') ILIKE $1 OR
          COALESCE(master_category, '') ILIKE $1 OR
          COALESCE(subcategory, '') ILIKE $1 OR
          COALESCE(material, '') ILIKE $1 OR
          COALESCE(colour, '') ILIKE $1 OR
          COALESCE(brand, '') ILIKE $1 OR
          COALESCE(shape, '') ILIKE $1 OR
          COALESCE(collection_name, '') ILIKE $1 OR
          COALESCE(finish, '') ILIKE $1 OR
          COALESCE(origin, '') ILIKE $1
        )
      ORDER BY is_featured DESC, updated_at DESC
      LIMIT 50;
      `,
      [pattern]
    );

    const collectionRows = await query(
      `
      SELECT id, name, slug, description, cover_image_url, display_order
      FROM public.collections
      WHERE is_published = true
        AND (name ILIKE $1 OR COALESCE(description, '') ILIKE $1)
      ORDER BY display_order ASC
      LIMIT 20;
      `,
      [pattern]
    );

    return {
      products: (productRows || []).map(mapRowToAdminProduct),
      collections: (collectionRows || []).map((c) => ({
        id: String(c.id),
        name: String(c.name),
        slug: String(c.slug),
        tagline: "Curated Architecture",
        description: String(c.description || ""),
        heroImage: String(c.cover_image_url || ""),
      })),
    };
  } catch (err) {
    console.error("Failed to search catalogue in PostgreSQL:", err);
    throw err;
  }
}

export async function getMediaFromPostgres(searchTerm?: string): Promise<MediaAsset[]> {
  if (!isDbConfigured()) return [];

  try {
    const rows = searchTerm?.trim()
      ? await query(
          `
          SELECT * FROM public.media
          WHERE filename ILIKE $1 OR COALESCE(alt_text, '') ILIKE $1 OR file_url ILIKE $1
          ORDER BY created_at DESC
          LIMIT 250;
          `,
          [`%${searchTerm.trim()}%`]
        )
      : await query(
          `
          SELECT * FROM public.media
          ORDER BY created_at DESC
          LIMIT 250;
          `
        );

    return (rows || []).map((r) => ({
      id: String(r.id),
      fileName: String(r.filename || ""),
      originalName: String(r.original_filename || r.filename || ""),
      url: String(r.file_url || ""),
      sourceType: r.file_type === "EXTERNAL_URL" ? "EXTERNAL_URL" : "UPLOAD",
      mimeType: String(r.mime_type || "image/jpeg"),
      sizeBytes: Number(r.file_size_bytes || 0),
      categoryScope: "ALL",
      altText: String(r.alt_text || ""),
      uploadedBy: r.uploaded_by ? String(r.uploaded_by) : "admin",
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
    }));
  } catch (err) {
    console.error("Failed to fetch media assets from PostgreSQL:", err);
    return [];
  }
}



