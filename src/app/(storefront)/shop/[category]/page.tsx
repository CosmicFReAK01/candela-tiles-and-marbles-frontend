import React from "react";
import { Metadata } from "next";
import { ShopCatalogueView } from "@/components/catalogue/ShopCatalogueView";
import { MASTER_SHOP_CATEGORIES } from "@/lib/catalogue-taxonomy";

interface PageProps {
  params: {
    category: string;
  };
}

export function generateStaticParams() {
  return MASTER_SHOP_CATEGORIES.map((cat) => ({
    category: cat.slug,
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const cat = MASTER_SHOP_CATEGORIES.find(
    (c) => c.slug.toLowerCase() === params.category.toLowerCase()
  );
  const title = cat ? `${cat.name} | CANDELA TILES & MARBLES` : "Shop | CANDELA";
  const description = cat ? cat.description : "Explore architectural surfaces.";

  return {
    title,
    description,
  };
}

export default function ShopCategoryPage({ params }: PageProps) {
  return <ShopCatalogueView categorySlug={params.category} />;
}
