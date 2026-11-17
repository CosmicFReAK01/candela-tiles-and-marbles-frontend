import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  fetchStorefrontCollections,
  fetchStorefrontProducts,
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
  const collection = collections.find(
    (c) => c.slug.toLowerCase() === params.slug.toLowerCase()
  );
  if (!collection) return { title: "Collection | CANDELA" };

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

  const collection = collections.find(
    (c) => c.slug.toLowerCase() === params.slug.toLowerCase()
  );
  if (!collection) notFound();

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
