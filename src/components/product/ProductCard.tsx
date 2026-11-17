"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PublicProduct } from "@/types";
import { useItemCart } from "@/context/ItemCartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCompare } from "@/context/CompareContext";
import { Box, Check, Heart, ShoppingBag, SlidersHorizontal, RotateCw, MessageCircle } from "lucide-react";

interface ProductCardProps {
  product: PublicProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useItemCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toggleCompare, isInCompare } = useCompare();

  const [justAdded, setJustAdded] = useState(false);
  const isWishlisted = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 150, true, product.applications?.[0] || "General Area");
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare(product);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Candela Tiles & Marbles,\n\nI am interested in:\nProduct: ${product.name}\nSKU: ${product.sku}\nDimensions: ${product.dimensionsMm}\n\nPlease share availability and project quotation.`
  );

  const imageSrc =
    product.media?.primaryImage ||
    (product as any).mainImageUrl ||
    (product as any).primary_image_url ||
    (product as any).imageUrl ||
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

  const stockSqft = product.stockSqftAvailable ?? ((product as any).stock_sqft_available ? Number((product as any).stock_sqft_available) : undefined);
  const isAvailable = product.inStock !== false && ((stockSqft === undefined) || stockSqft > 0);

  return (
    <div className="group border border-candela-border bg-candela-surface flex flex-col justify-between transition-all duration-300 hover:border-candela-accent hover:shadow-xl relative">
      <div>
        {/* Real Product Image with Badges */}
        <div className="relative h-64 w-full overflow-hidden bg-candela-dark/10">
          <Link href={`/product/${product.slug}`} className="block h-full w-full">
            <img
              src={imageSrc}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </Link>
          <div className="absolute inset-0 bg-gradient-to-t from-candela-dark/80 via-transparent to-transparent pointer-events-none" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
            <div className="flex flex-col gap-1.5 items-start">
              <span className="bg-candela-dark/90 backdrop-blur-sm px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-candela-bg border border-candela-border/20">
                {product.masterCategory || product.category}
              </span>

              {/* Live Database Stock Badge */}
              {stockSqft !== undefined && stockSqft > 0 ? (
                <span className="bg-emerald-950/90 backdrop-blur-sm px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-emerald-400 border border-emerald-500/30 flex items-center gap-1 shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {stockSqft.toLocaleString("en-IN")}{" "}
                  {product.masterCategory === "Tiles" || product.masterCategory === "Marbles" ? "sq.ft in stock" : "pcs in stock"}
                </span>
              ) : isAvailable ? (
                <span className="bg-emerald-950/90 backdrop-blur-sm px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-emerald-400 border border-emerald-500/30">
                  Ready in Depot
                </span>
              ) : (
                <span className="bg-amber-950/90 backdrop-blur-sm px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-amber-400 border border-amber-500/30">
                  Quarry Lot On Order
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {(product.media?.glbModelUrl || (product.media?.frames360Urls && product.media.frames360Urls.length > 0)) && (
                <Link
                  href={`/product/${product.slug}#view360`}
                  title="Interactive 360° View Available"
                  className="inline-flex items-center gap-1 bg-candela-bg/95 backdrop-blur-sm px-2 py-1 font-mono text-[10px] text-candela-text border border-candela-border/30 hover:border-candela-accent transition"
                >
                  <RotateCw className="h-3 w-3 text-candela-accent animate-spin-slow" />
                  <span className="hidden sm:inline">360°</span>
                </Link>
              )}

              {/* Compare toggle */}
              <button
                type="button"
                onClick={handleToggleCompare}
                title={isCompared ? "Remove from comparison" : "Add to comparison (Max 4)"}
                className={`p-1.5 rounded-full backdrop-blur-md transition ${isCompared
                  ? "bg-candela-accent text-white"
                  : "bg-candela-dark/60 text-white hover:bg-candela-dark"
                  }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
              </button>

              {/* Wishlist toggle */}
              <button
                type="button"
                onClick={handleToggleWishlist}
                title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                className={`p-1.5 rounded-full backdrop-blur-md transition ${isWishlisted
                  ? "bg-red-500 text-white"
                  : "bg-candela-dark/60 text-white hover:bg-candela-dark"
                  }`}
              >
                <Heart className={`h-3.5 w-3.5 ${isWishlisted ? "fill-current" : ""}`} />
              </button>
            </div>
          </div>

          {/* Bottom image metadata */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-candela-bg text-xs">
            <span className="font-mono text-[10px] bg-candela-dark/80 px-2 py-0.5">
              {product.dimensionsMm}
            </span>
            <span className="font-mono text-[10px] text-candela-accent font-semibold bg-candela-dark/80 px-2 py-0.5">
              {product.finish}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between font-mono text-[10px] text-candela-secondary">
            <span>{product.sku}</span>
            <span>{product.origin}</span>
          </div>

          <Link href={`/product/${product.slug}`}>
            <h3 className="font-heading text-lg font-semibold text-candela-text group-hover:text-candela-accent transition line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-candela-secondary line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>

          <div className="flex flex-wrap gap-1 pt-1">
            {product.style && (
              <span className="border border-candela-border/70 bg-candela-bg px-2 py-0.5 text-[10px] text-candela-secondary font-mono">
                {product.style}
              </span>
            )}
            {product.material && (
              <span className="border border-candela-border/70 bg-candela-bg px-2 py-0.5 text-[10px] text-candela-secondary font-mono">
                {product.material}
              </span>
            )}
            {product.brand && (
              <span className="border border-candela-border/70 bg-candela-bg px-2 py-0.5 text-[10px] text-candela-accent font-mono">
                {product.brand}
              </span>
            )}
          </div>

          {/* Stock Level & Warehouse Zone Bar */}
          <div className="flex items-center justify-between text-[10px] font-mono border-t border-candela-border/40 pt-2 text-candela-secondary">
            <span className="truncate max-w-[55%]">{product.warehouseZone || "Bhiwandi Central Depot"}</span>
            <span className={stockSqft !== undefined && stockSqft > 0 ? "text-emerald-600 font-semibold shrink-0" : "text-candela-secondary shrink-0"}>
              {stockSqft !== undefined && stockSqft > 0
                ? `${stockSqft.toLocaleString("en-IN")} ${product.masterCategory === "Tiles" || product.masterCategory === "Marbles" ? "sq.ft" : "pcs"} Lot`
                : isAvailable ? "Lot In Yard" : "Pre-Order"}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Actions with Actual Price */}
      <div className="border-t border-candela-border p-3 bg-candela-bg flex items-center justify-between gap-2">
        <div>
          <div className="text-[9px] font-mono uppercase tracking-wider text-candela-secondary">
            Price / Unit
          </div>
          <div className="font-mono text-sm font-bold text-candela-accent">
            ₹{(product.pricePerSqftInr || 1450).toLocaleString("en-IN")}
            <span className="text-[9px] font-normal text-candela-secondary ml-1">
              {product.masterCategory === "Tiles" || product.masterCategory === "Marbles" ? "/ sq.ft" : "/ pc"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* WhatsApp Direct Inquiry */}
          <a
            href={`https://wa.me/917063099602?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Enquire on WhatsApp"
            className="p-1.5 border border-emerald-600/40 text-emerald-600 hover:bg-emerald-600 hover:text-white transition"
          >
            <MessageCircle className="h-3.5 w-3.5" />
          </a>

          {/* Details Link */}
          <Link
            href={`/product/${product.slug}`}
            className="text-[10px] font-mono text-candela-secondary hover:text-candela-accent transition px-2 py-1.5 border border-candela-border hover:border-candela-accent"
          >
            Details
          </Link>

          {/* Add to Cart / BOQ button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="inline-flex items-center gap-1 bg-candela-accent px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wider text-white transition hover:bg-candela-dark cursor-pointer shadow-sm"
          >
            {justAdded ? (
              <>
                <Check className="h-3 w-3" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-3 w-3" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
