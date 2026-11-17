import React from "react";
import {
  fetchStorefrontProducts,
  fetchStorefrontHomepageCms,
  fetchStorefrontCategories,
  fetchStorefrontCollections,
} from "@/lib/storefront-data";
import { MASTER_SHOP_CATEGORIES, DEFAULT_HOMEPAGE_CMS } from "@/lib/catalogue-taxonomy";
import { StorefrontHomeClient } from "@/components/storefront/StorefrontHomeClient";
import { CategoryCardData } from "@/types";

export const dynamic = "force-dynamic";

export default async function StorefrontHomePage() {
  const [products, cmsPayload, categoryRows, collectionRows] = await Promise.all([
    fetchStorefrontProducts(),
    fetchStorefrontHomepageCms(),
    fetchStorefrontCategories(),
    fetchStorefrontCollections(),
  ]);

  const masterBySlug = new Map(
    MASTER_SHOP_CATEGORIES.map((m) => [m.slug.toLowerCase(), m])
  );

  const initialShopShowcase: CategoryCardData[] =
    categoryRows.length > 0
      ? categoryRows.map((row) => {
          const master = masterBySlug.get(row.slug.toLowerCase());
          return {
            id: String(row.id),
            title: row.name || master?.name || "",
            slug: row.slug || master?.slug || "",
            description: row.description || master?.description || "",
            imageUrl: row.image_url || master?.imageUrl || "",
            tag: master?.tagline || "",
            itemCount: master?.subcategories.length || 0,
          };
        })
      : MASTER_SHOP_CATEGORIES.map((m) => ({
          id: m.id,
          title: m.name,
          slug: m.slug,
          description: m.description,
          imageUrl: m.imageUrl,
          tag: m.tagline,
          itemCount: m.subcategories.length,
        }));

  const initialCollections: CategoryCardData[] = collectionRows
    .filter((c) => c.is_published !== false)
    .map((c) => ({
      id: String(c.id),
      title: c.name,
      slug: c.slug,
      description: c.description || "",
      imageUrl: c.cover_image_url || "",
      tag: `${c.product_count || 0} Curated Lots`,
      itemCount: Number(c.product_count || 0),
    }));

  return (
    <StorefrontHomeClient
      initialProducts={products}
      initialHomePageCms={cmsPayload.cms}
      initialShopShowcase={initialShopShowcase}
      initialCollections={initialCollections}
    />
  );
}
