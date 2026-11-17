"use client";

import React from "react";
import Link from "next/link";
import { PublicProduct } from "@/types";
import { useCandelaStore } from "@/context/CandelaStoreContext";
import { ProductDetailView } from "@/components/product/ProductDetailView";
import { ArrowLeft, Compass, Sparkles, MessageCircle } from "lucide-react";

interface ProductDetailSlugContainerProps {
  slug: string;
  initialProduct?: PublicProduct;
}

export function ProductDetailSlugContainer({
  slug,
  initialProduct,
}: ProductDetailSlugContainerProps) {
  const { products, isLoaded } = useCandelaStore();

  const decodedSlug = decodeURIComponent(slug).toLowerCase().trim();

  // Find product from live client store (including newly added admin items) or fallback to initial product
  const product =
    products.find(
      (p) =>
        p.slug?.toLowerCase().trim() === decodedSlug ||
        p.id?.toLowerCase().trim() === decodedSlug
    ) || initialProduct;

  // Show a refined loading skeleton while store hydrates
  if (!isLoaded && !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 px-4 py-20">
        <div className="relative flex items-center justify-center">
          <div className="h-12 w-12 rounded-full border-2 border-candela-accent/20 border-t-candela-accent animate-spin" />
          <span className="absolute font-serif text-xs font-bold text-candela-accent">C</span>
        </div>
        <div className="text-center space-y-1">
          <p className="font-heading text-lg font-medium text-candela-text">
            Loading Surface Specifications
          </p>
          <p className="font-mono text-xs text-candela-secondary">
            Retrieving slab calibration &amp; warehouse lot data...
          </p>
        </div>
      </div>
    );
  }

  // Not found state if the product truly doesn't exist
  if (!product) {
    const whatsappQuery = encodeURIComponent(
      `Hello Candela Tiles & Marbles,\n\nI am looking for the item or specification referenced as: "${slug}".\nPlease let me know if similar marble/tile slabs or bathware lots are available.`
    );

    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-20 text-center space-y-8">
        <div className="inline-flex items-center gap-2 border border-candela-accent/30 bg-candela-accent/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-candela-accent">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Surface Catalogue</span>
        </div>

        <div className="space-y-3">
          <h1 className="font-heading text-3xl sm:text-5xl font-semibold text-candela-text">
            Product Not Found
          </h1>
          <p className="text-sm text-candela-secondary max-w-lg mx-auto font-light leading-relaxed">
            The architectural surface or fixture specified by{" "}
            <code className="bg-candela-dark/10 px-2 py-0.5 font-mono text-xs text-candela-text">
              {slug}
            </code>{" "}
            could not be located in our current catalogue or may have been unlisted by the showroom inventory team.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-candela-accent px-6 py-3 font-mono text-xs uppercase tracking-wider text-white hover:bg-candela-dark transition"
          >
            <Compass className="h-4 w-4" />
            <span>Browse Full Catalogue</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-candela-border bg-candela-surface px-6 py-3 font-mono text-xs uppercase tracking-wider text-candela-text hover:border-candela-accent transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Home</span>
          </Link>

          <a
            href={`https://wa.me/917063099602?text=${whatsappQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-[#25D366]/40 bg-[#25D366]/10 px-6 py-3 font-mono text-xs uppercase tracking-wider text-[#25D366] hover:bg-[#25D366]/20 transition"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Inquire on WhatsApp</span>
          </a>
        </div>
      </div>
    );
  }

  return <ProductDetailView product={product} />;
}
