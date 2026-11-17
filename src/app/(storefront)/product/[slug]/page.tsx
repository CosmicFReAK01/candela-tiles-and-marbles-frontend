import React from "react";
import { Metadata } from "next";
import { fetchStorefrontProductBySlug } from "@/lib/storefront-data";
import { ProductDetailSlugContainer } from "@/components/product/ProductDetailSlugContainer";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await fetchStorefrontProductBySlug(params.slug);
  if (!product) {
    const readable = decodeURIComponent(params.slug)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      title: `${readable} | CANDELA TILES & MARBLES`,
      description:
        "Explore architectural surfaces, Italian marble slabs, and designer bathware at Candela.",
    };
  }

  return {
    title: `${product.name} | CANDELA TILES & MARBLES`,
    description: product.shortDescription,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await fetchStorefrontProductBySlug(params.slug);

  return (
    <ProductDetailSlugContainer
      slug={params.slug}
      initialProduct={product || undefined}
    />
  );
}
