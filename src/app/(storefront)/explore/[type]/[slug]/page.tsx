import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { fetchStorefrontProducts } from "@/lib/storefront-data";
import { ExploreProductGrid } from "@/components/explore/ExploreProductGrid";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    type: string;
    slug: string;
  };
}

export function generateMetadata({ params }: PageProps): Metadata {
  const title = params.slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${title} Surfaces | Explore | CANDELA TILES & MARBLES`,
    description: `Browse curated ${title.toLowerCase()} tiles, marbles, and architectural surfaces at Candela.`,
  };
}

export default async function ExploreDetailPage({ params }: PageProps) {
  const rawSlug = params.slug.toLowerCase();
  const readableTitle = params.slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const allProducts = await fetchStorefrontProducts();
  const initialMatchingProducts = allProducts.filter((p) => {
    if (params.type === "rooms") {
      return p.rooms?.some((r) => r.toLowerCase().includes(rawSlug.replace(/-/g, " ")));
    }
    if (params.type === "styles") {
      return p.style?.toLowerCase().includes(rawSlug);
    }
    if (params.type === "materials") {
      return (
        p.material?.toLowerCase().includes(rawSlug) ||
        p.category.toLowerCase().includes(rawSlug)
      );
    }
    if (params.type === "colours") {
      return p.colour?.toLowerCase().includes(rawSlug);
    }
    if (params.type === "finishes") {
      return p.finish.toLowerCase().includes(rawSlug);
    }
    if (params.type === "applications") {
      return p.applications.some((app) => app.toLowerCase().includes(rawSlug));
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono text-candela-secondary">
        <Link href="/" className="hover:text-candela-accent">
          Home
        </Link>
        <span>/</span>
        <Link href="/explore" className="hover:text-candela-accent capitalize">
          Explore
        </Link>
        <span>/</span>
        <span className="capitalize">{params.type}</span>
        <span>/</span>
        <span className="text-candela-text font-semibold">{readableTitle}</span>
      </nav>

      {/* Header */}
      <div className="border-b border-candela-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-candela-accent">
            Curated by {params.type.replace(/s$/, "")}
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-semibold tracking-wide text-candela-text mt-1">
            {readableTitle} Surfaces
          </h1>
          <p className="text-xs sm:text-sm text-candela-secondary mt-1 font-light max-w-2xl leading-relaxed">
            Architectural solutions specified for {readableTitle.toLowerCase()} applications across residential and commercial projects.
          </p>
        </div>
      </div>

      {/* Dynamic Products Grid */}
      <ExploreProductGrid
        type={params.type}
        slug={params.slug}
        readableTitle={readableTitle}
        initialProducts={initialMatchingProducts}
      />
    </div>
  );
}
