"use client";

import React from "react";
import Link from "next/link";
import { PublicProduct } from "@/types";
import { useCandelaStore } from "@/context/CandelaStoreContext";
import { ProductCard } from "@/components/product/ProductCard";
import { ArrowRight } from "lucide-react";

interface CollectionProductGridProps {
  collectionSlug: string;
  initialProducts?: PublicProduct[];
}

export function CollectionProductGrid({
  collectionSlug,
  initialProducts = [],
}: CollectionProductGridProps) {
  const { products, isLoaded } = useCandelaStore();

  const activeProducts = isLoaded ? products : initialProducts;

  const targetSlug = collectionSlug.toLowerCase().trim();

  const matchingProducts = activeProducts.filter((p) => {
    if (!p.media?.primaryImage || p.media.primaryImage.trim() === "") return false;
    const pColSlug = p.collectionSlug?.toLowerCase().trim();
    if (pColSlug === targetSlug) return true;
    if (targetSlug === "new-arrivals" && (p.isNewArrival || p.isFeatured)) return true;
    if (targetSlug === "best-sellers" && p.isFeatured) return true;
    return false;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-candela-border pb-4">
        <div className="flex items-center gap-3">
          <h2 className="font-heading text-2xl font-semibold">
            Available Surfaces in this Edition
          </h2>
          <span className="font-mono text-xs text-candela-secondary bg-candela-surface px-2.5 py-0.5 border border-candela-border">
            {matchingProducts.length} Lots
          </span>
        </div>
        <Link
          href="/shop"
          className="text-xs font-mono text-candela-accent hover:underline flex items-center gap-1"
        >
          <span>View Full Catalogue</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {matchingProducts.length === 0 ? (
        <div className="p-12 border border-candela-border text-center text-xs font-mono text-candela-secondary">
          No active lots currently allocated to this collection. Check our Bhiwandi showroom inventory.
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
