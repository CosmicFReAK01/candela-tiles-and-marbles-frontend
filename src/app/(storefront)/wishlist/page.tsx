"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useCompare } from "@/context/CompareContext";
import { useItemCart } from "@/context/ItemCartContext";
import {
  Heart,
  ShoppingBag,
  SlidersHorizontal,
  Trash2,
  ArrowRight,
  Share2,
  MessageCircle,
  FileText,
  Check,
} from "lucide-react";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCompare, isInCompare } = useCompare();
  const { addToCart } = useItemCart();

  const [copied, setCopied] = useState(false);

  const handleShareWishlist = () => {
    const text = `Candela Tiles & Marbles Saved Wishlist (${wishlist.length} items):\n` +
      wishlist.map((item, idx) => `${idx + 1}. ${item.name} (${item.sku}) — ₹${item.pricePerSqftInr}/sq.ft`).join("\n");
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } else {
      alert(text);
    }
  };

  const allWishlistWhatsAppMsg = encodeURIComponent(
    `Hello Candela Tiles & Marbles,\n\nI would like to enquire about my saved architectural wishlist:\n\n` +
      wishlist.map((item, idx) => `${idx + 1}. ${item.name} (${item.sku})`).join("\n") +
      `\n\nPlease share batch availability and quotation.`
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono text-candela-secondary mb-6">
        <Link href="/" className="hover:text-candela-accent">
          Home
        </Link>
        <span>/</span>
        <span className="text-candela-text font-semibold">Wishlist</span>
      </nav>

      {/* Header */}
      <div className="border-b border-candela-border pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-3xl sm:text-4xl font-semibold tracking-wide text-candela-text">
              Saved Wishlist
            </h1>
            <span className="font-mono text-xs text-candela-secondary bg-candela-surface px-2.5 py-1 border border-candela-border">
              {wishlist.length} Items Saved
            </span>
          </div>
          <p className="text-xs sm:text-sm text-candela-secondary mt-1 font-light">
            Review your shortlisted architectural surfaces, move to comparison, or request an integrated BOQ quotation.
          </p>
        </div>

        {wishlist.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleShareWishlist}
              className="inline-flex items-center gap-1.5 border border-candela-border bg-candela-surface px-3.5 py-2 text-xs font-mono uppercase text-candela-text hover:border-candela-accent transition"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Copied Summary</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5 text-candela-accent" />
                  <span>Share Wishlist</span>
                </>
              )}
            </button>

            <a
              href={`https://wa.me/917063099602?text=${allWishlistWhatsAppMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-emerald-600 text-white px-4 py-2 text-xs font-mono uppercase font-semibold hover:bg-emerald-700 transition"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>Enquire on WhatsApp</span>
            </a>

            <button
              onClick={clearWishlist}
              className="text-xs font-mono text-candela-secondary hover:text-red-500 transition px-2 py-2"
              title="Clear all saved products"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Wishlist Items Grid */}
      {wishlist.length === 0 ? (
        <div className="border border-candela-border bg-candela-surface p-16 text-center space-y-4">
          <div className="inline-flex p-4 bg-candela-bg border border-candela-border">
            <Heart className="h-8 w-8 text-candela-accent" />
          </div>
          <h2 className="font-heading text-2xl font-semibold">Your Wishlist is Empty</h2>
          <p className="text-xs text-candela-secondary max-w-md mx-auto leading-relaxed">
            Explore our curated collections of Italian marble slabs, porcelain tiles, and luxury bathware to shortlist items for your project.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-candela-accent px-6 py-2.5 text-xs font-mono uppercase font-semibold text-white hover:bg-candela-dark transition"
            >
              <span>Explore Catalogue</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((product) => {
            const isCompared = isInCompare(product.id);

            return (
              <div
                key={product.id}
                className="group border border-candela-border bg-candela-surface flex flex-col justify-between hover:border-candela-accent transition shadow-sm"
              >
                <div>
                  <div className="relative h-60 w-full overflow-hidden bg-candela-dark">
                    <img
                      src={product.media.primaryImage}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-candela-dark/80 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute top-3 left-3">
                      <span className="bg-candela-dark/90 px-2 py-0.5 font-mono text-[9px] uppercase text-candela-bg border border-candela-border/20">
                        {product.masterCategory || product.category}
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      title="Remove from wishlist"
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-candela-dark/80 text-white hover:bg-red-600 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-candela-bg bg-candela-dark/80 px-2.5 py-1">
                      <span>{product.dimensionsMm}</span>
                      <span className="text-candela-accent">{product.finish}</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between font-mono text-[10px] text-candela-secondary">
                      <span>{product.sku}</span>
                      <span>{product.origin}</span>
                    </div>

                    <Link href={`/product/${product.slug}`}>
                      <h3 className="font-heading text-lg font-bold text-candela-text group-hover:text-candela-accent transition line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-xs text-candela-secondary line-clamp-2">
                      {product.shortDescription}
                    </p>

                    <div className="font-mono text-sm font-bold text-candela-accent pt-1">
                      ₹{product.pricePerSqftInr.toLocaleString("en-IN")}/sq.ft
                    </div>
                  </div>
                </div>

                <div className="border-t border-candela-border p-3 bg-candela-bg grid grid-cols-2 gap-2 text-xs font-mono">
                  <button
                    onClick={() => addToCompare(product)}
                    className={`py-1.5 px-2 text-center border transition flex items-center justify-center gap-1 ${
                      isCompared
                        ? "bg-candela-dark text-candela-accent border-candela-accent font-semibold"
                        : "border-candela-border hover:border-candela-accent text-candela-text"
                    }`}
                  >
                    <SlidersHorizontal className="h-3 w-3" />
                    <span>{isCompared ? "In Compare" : "Compare"}</span>
                  </button>

                  <button
                    onClick={() =>
                      addToCart(product, 150, true, product.applications?.[0] || "General")
                    }
                    className="py-1.5 px-2 bg-candela-accent text-white text-center hover:bg-candela-dark transition flex items-center justify-center gap-1 uppercase font-semibold"
                  >
                    <ShoppingBag className="h-3 w-3" />
                    <span>Add to BOQ</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
