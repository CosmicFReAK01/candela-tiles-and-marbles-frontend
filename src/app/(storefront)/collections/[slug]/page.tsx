import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  fetchStorefrontCollections,
  fetchStorefrontProducts,
  DEFAULT_STOREFRONT_COLLECTIONS,
} from "@/lib/storefront-data";
import { CollectionProductGrid } from "@/components/collection/CollectionProductGrid";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const collections = await fetchStorefrontCollections();
  const collection =
    collections.find((c) => c.slug.toLowerCase() === params.slug.toLowerCase()) ||
    DEFAULT_STOREFRONT_COLLECTIONS.find((c) => c.slug.toLowerCase() === params.slug.toLowerCase());

  if (!collection) {
    const formatted = params.slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return { title: `${formatted} Collection | CANDELA TILES & MARBLES` };
  }

  return {
    title: `${collection.title || collection.name} | CANDELA TILES & MARBLES`,
    description: collection.description,
  };
}

export default async function CollectionDetailPage({ params }: PageProps) {
  const [collections, allProducts] = await Promise.all([
    fetchStorefrontCollections(),
    fetchStorefrontProducts(),
  ]);

  const collection =
    collections.find((c) => c.slug.toLowerCase() === params.slug.toLowerCase()) ||
    DEFAULT_STOREFRONT_COLLECTIONS.find((c) => c.slug.toLowerCase() === params.slug.toLowerCase()) || {
      id: `col-${params.slug}`,
      name:
        params.slug
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ") + " Collection",
      title:
        params.slug
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ") + " Collection",
      slug: params.slug,
      description: "Curated architectural stone, monolithic slabs, and designer surfaces.",
      cover_image_url:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
      imageUrl:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
      display_order: 99,
      is_published: true,
      product_count: 0,
      itemCount: 0,
    };

  const initialMatchingProducts = allProducts.filter(
    (p) =>
      p.collectionSlug?.toLowerCase() === collection.slug.toLowerCase() ||
      (collection.slug === "new-arrivals" && (p.isNewArrival || p.isFeatured)) ||
      (collection.slug === "best-sellers" && p.isFeatured)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono text-candela-secondary">
        <Link href="/" className="hover:text-candela-accent">
          Home
        </Link>
        <span>/</span>
        <Link href="/collections" className="hover:text-candela-accent">
          Collections
        </Link>
        <span>/</span>
        <span className="text-candela-text font-semibold">{collection.name}</span>
      </nav>

      {/* Hero Banner */}
      <div className="relative border border-candela-border bg-candela-dark text-white p-8 sm:p-14 overflow-hidden">
        <img
          src={collection.cover_image_url}
          alt={collection.name}
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-candela-accent">
            Curated Architectural Portfolio
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-semibold tracking-wide">
            {collection.name}
          </h1>
          <p className="text-xs sm:text-sm text-candela-border/90 leading-relaxed font-light">
            {collection.description}
          </p>
        </div>
      </div>

      {/* Dynamic Products Grid */}
      <CollectionProductGrid
        collectionSlug={collection.slug}
        initialProducts={initialMatchingProducts}
      />
    </div>
  );
}
