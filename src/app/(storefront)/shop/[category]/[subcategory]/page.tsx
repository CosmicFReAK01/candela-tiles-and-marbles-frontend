import React from "react";
import { Metadata } from "next";
import { ShopCatalogueView } from "@/components/catalogue/ShopCatalogueView";
import { MASTER_SHOP_CATEGORIES } from "@/lib/catalogue-taxonomy";

interface PageProps {
  params: {
    category: string;
    subcategory: string;
  };
}

export function generateStaticParams() {
  const paths: { category: string; subcategory: string }[] = [];
  MASTER_SHOP_CATEGORIES.forEach((cat) => {
    cat.subcategories.forEach((sub) => {
      paths.push({
        category: cat.slug,
        subcategory: sub.slug,
      });
    });
  });
  return paths;
}

export function generateMetadata({ params }: PageProps): Metadata {
  const cat = MASTER_SHOP_CATEGORIES.find(
    (c) => c.slug.toLowerCase() === params.category.toLowerCase()
  );
  const sub = cat?.subcategories.find(
    (s) => s.slug.toLowerCase() === params.subcategory.toLowerCase()
  );

  const title = sub && cat
    ? `${sub.name} — ${cat.name} | CANDELA TILES & MARBLES`
    : "Shop | CANDELA";

  return {
    title,
    description: `Explore premium ${sub?.name || "surfaces"} curated by Candela Tiles & Marbles.`,
  };
}

export default function ShopSubcategoryPage({ params }: PageProps) {
  return (
    <ShopCatalogueView
      categorySlug={params.category}
      subcategorySlug={params.subcategory}
    />
  );
}
