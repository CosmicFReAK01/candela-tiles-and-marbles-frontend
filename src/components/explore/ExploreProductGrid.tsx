"use client";

import React from "react";
import Link from "next/link";
import { PublicProduct } from "@/types";
import { useCandelaStore } from "@/context/CandelaStoreContext";
import { ProductCard } from "@/components/product/ProductCard";
import { ArrowRight, Compass } from "lucide-react";

interface ExploreProductGridProps {
  type: string;
  slug: string;
  readableTitle: string;
  initialProducts?: PublicProduct[];
}

export function ExploreProductGrid({
  type,
  slug,
  readableTitle,
  initialProducts = [],
}: ExploreProductGridProps) {
  const { products, isLoaded } = useCandelaStore();

  const activeProducts = isLoaded ? products : initialProducts;
  const rawSlug = slug.toLowerCase().trim();

  const matchingProducts = activeProducts.filter((p) => {
    if (type === "rooms") {
      return p.rooms?.some((r) => r.toLowerCase().includes(rawSlug.replace(/-/g, " ")));
    }
    if (type === "styles") {
      return p.style?.toLowerCase().includes(rawSlug);
    }
    if (type === "materials") {
      return (
        p.material?.toLowerCase().includes(rawSlug) ||
        p.category?.toLowerCase().includes(rawSlug)
      );
    }
    if (type === "colours") {
      return p.colour?.toLowerCase().includes(rawSlug);
    }
    if (type === "finishes") {
      return p.finish?.toLowerCase().includes(rawSlug);
    }
    if (type === "applications") {
      return p.applications?.some((app) => app.toLowerCase().includes(rawSlug));
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Dynamic Count Header Bar */}
      <div className="flex items-center justify-between border-b border-candela-border pb-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-candela-secondary bg-candela-surface px-3 py-1 border border-candela-border">
            {matchingProducts.length} Lots Available
          </span>
          <span className="text-xs text-candela-secondary hidden sm:inline">
            Live showroom stock &amp; quarry allocations
          </span>
        </div>
        <Link
          href="/shop"
          className="text-xs font-mono text-candela-accent hover:underline flex items-center gap-1"
        >
          <span>Full Shop Catalogue</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {matchingProducts.length === 0 ? (
        <div className="p-12 border border-candela-border bg-candela-surface text-center space-y-4">
          <p className="text-sm font-light text-candela-secondary">
            No active lots currently matched to &ldquo;{readableTitle}&rdquo;. Our showroom inventory is continuously updated.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-candela-accent px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-white hover:bg-candela-dark transition"
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Explore Entire Catalogue</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {matchingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
