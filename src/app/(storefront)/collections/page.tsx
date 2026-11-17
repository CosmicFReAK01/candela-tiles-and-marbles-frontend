import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { fetchStorefrontCollections } from "@/lib/storefront-data";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Curated Collections | CANDELA TILES & MARBLES",
  description:
    "Explore our architectural collections: Premium, Luxury, Modern, Natural, Classic, New Arrivals, and Best Sellers.",
};

export default async function CollectionsPage() {
  const collections = await fetchStorefrontCollections();
  const visibleCollections = collections;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono text-candela-secondary mb-6">
        <Link href="/" className="hover:text-candela-accent">
          Home
        </Link>
        <span>/</span>
        <span className="text-candela-text font-semibold">Collections</span>
      </nav>

      {/* Header */}
      <div className="border-b border-candela-border pb-6 mb-10">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-candela-accent">
          Curated Portfolios
        </span>
        <h1 className="font-heading text-3xl sm:text-5xl font-semibold tracking-wide text-candela-text mt-1">
          Architectural Surface Collections
        </h1>
        <p className="text-xs sm:text-sm text-candela-secondary mt-2 font-light max-w-2xl leading-relaxed">
          Collections are curated product groups tailored by aesthetic sensibility, geologic origin, and architectural application.
        </p>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visibleCollections.map((col) => (
          <Link
            key={col.id}
            href={`/collections/${col.slug}`}
            className="group border border-candela-border bg-candela-surface overflow-hidden flex flex-col justify-between hover:border-candela-accent transition duration-300"
          >
            <div className="relative h-64 w-full overflow-hidden bg-candela-dark">
              <img
                src={col.cover_image_url}
                alt={col.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-candela-dark/90 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="font-mono text-[10px] uppercase tracking-widest text-candela-accent">
                  {col.product_count || 0} Curated Lots
                </span>
                <h3 className="font-heading text-2xl font-bold mt-0.5">{col.name}</h3>
              </div>
            </div>

            <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
              <p className="text-xs text-candela-text-secondary leading-relaxed line-clamp-3">
                {col.description}
              </p>

              <div className="pt-2 border-t border-candela-border flex items-center justify-between text-xs font-mono text-candela-accent font-semibold">
                <span>View Collection Slabs</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
