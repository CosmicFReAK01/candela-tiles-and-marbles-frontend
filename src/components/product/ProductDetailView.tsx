"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PublicProduct } from "@/types";
import { ProductMediaViewer } from "@/components/product/ProductMediaViewer";
import { CoverageCalculator } from "@/components/product/CoverageCalculator";
import { useWishlist } from "@/context/WishlistContext";
import { useCompare } from "@/context/CompareContext";
import { useCandelaStore } from "@/context/CandelaStoreContext";
import { ProductCard } from "@/components/product/ProductCard";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Heart,
  Layers,
  MapPin,
  MessageCircle,
  Package,
  RotateCw,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Warehouse,
  ArrowRight,
} from "lucide-react";

interface ProductDetailViewProps {
  product: PublicProduct;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toggleCompare, isInCompare } = useCompare();
  const { products } = useCandelaStore();

  const isWishlisted = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  const retailPrice = product.pricePerSqftInr || 1450;
  const stockSqft = product.stockSqftAvailable || 3420;
  const warehouse = product.warehouseZone || "Bhiwandi Slab Gallery — Bay A2";

  const whatsappMessage = encodeURIComponent(
    `Hello Candela Tiles & Marbles,\n\nI am interested in:\nProduct: ${product.name}\nProduct Code: ${product.sku}\nSize: ${product.dimensionsMm}\nFinish: ${product.finish}\n\nPlease share availability and project quotation.`
  );

  // Related products from same category or collection
  const relatedProducts = products
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.masterCategory === product.masterCategory ||
          p.category === product.category ||
          p.material === product.material)
    )
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-12">
      {/* 1. BREADCRUMBS */}
      <div className="flex items-center gap-2 text-xs font-mono text-candela-secondary border-b border-candela-border pb-4">
        <Link href="/shop" className="hover:text-candela-accent flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Shop
        </Link>
        <span>/</span>
        {product.masterCategory && (
          <>
            <Link
              href={`/shop/${product.masterCategory.toLowerCase().replace(/\s+/g, "-")}`}
              className="hover:text-candela-accent"
            >
              {product.masterCategory}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-candela-text font-medium truncate">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
        {/* Left 7 Columns: 3D GLB / 360° Turntable / Real High-Res Gallery Viewer */}
        <div className="lg:col-span-7 space-y-6">
          <div id="view360">
            <ProductMediaViewer product={product} />
          </div>

          {/* Quick Action Badges Under Media */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-candela-surface border border-candela-border text-xs font-mono">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 border transition ${
                  isWishlisted
                    ? "bg-red-50 text-red-600 border-red-300 font-semibold"
                    : "border-candela-border bg-candela-bg text-candela-text hover:border-candela-accent"
                }`}
              >
                <Heart className={`h-3.5 w-3.5 ${isWishlisted ? "fill-current" : ""}`} />
                <span>{isWishlisted ? "Saved in Wishlist" : "Save to Wishlist"}</span>
              </button>

              <button
                type="button"
                onClick={() => toggleCompare(product)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 border transition ${
                  isCompared
                    ? "bg-candela-dark text-candela-accent border-candela-accent font-semibold"
                    : "border-candela-border bg-candela-bg text-candela-text hover:border-candela-accent"
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>{isCompared ? "In Comparison" : "Compare (Max 4)"}</span>
              </button>
            </div>

            <Link
              href="/inspiration"
              className="inline-flex items-center gap-1.5 text-candela-accent hover:underline font-semibold"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Design Inspiration Ideas →</span>
            </Link>
          </div>

          {/* High-Resolution Photo Gallery Thumbnails */}
          {product.media.galleryImages && product.media.galleryImages.length > 0 && (
            <div className="border border-candela-border bg-candela-surface p-4 space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-candela-secondary block">
                Quarry Slab Inspection Photos & Vein Textures
              </span>
              <div className="grid grid-cols-3 gap-3">
                {product.media.galleryImages.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative h-28 overflow-hidden border border-candela-border bg-candela-dark/10 group cursor-pointer"
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.name} texture ${idx + 1}`}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-candela-dark/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-mono">
                      View High-Res
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Architectural Notes & Dry-Lay Guidance */}
          <div className="border border-candela-border bg-candela-surface p-6 space-y-3">
            <h3 className="font-heading text-xl font-semibold text-candela-text">
              Architectural & Dry-Lay Specification Notes
            </h3>
            <p className="text-xs text-candela-secondary leading-relaxed">
              {product.architecturalNotes}
            </p>
          </div>

          {/* Dealer & Quarry Sourcing Details from Admin Console */}
          <div className="border border-candela-border bg-candela-surface p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-candela-border pb-3">
              <Building2 className="h-4 w-4 text-candela-accent" />
              <h3 className="font-heading text-lg font-semibold text-candela-text">
                Dealer & Quarry Sourcing Verified
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-start gap-2.5">
                <Warehouse className="h-4 w-4 text-candela-accent shrink-0 mt-0.5" />
                <div>
                  <div className="text-candela-secondary font-mono text-[11px] uppercase">
                    Warehouse & Dispatch Bay
                  </div>
                  <div className="font-medium text-candela-text mt-0.5">{warehouse}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Package className="h-4 w-4 text-candela-accent shrink-0 mt-0.5" />
                <div>
                  <div className="text-candela-secondary font-mono text-[11px] uppercase">
                    Showroom Stock Available
                  </div>
                  <div className="font-mono font-semibold text-candela-accent mt-0.5">
                    {stockSqft.toLocaleString("en-IN")}{" "}
                    {product.masterCategory === "Tiles" || product.masterCategory === "Marbles" ? "sq.ft" : "units"}{" "}
                    Ready for Delivery
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-candela-accent shrink-0 mt-0.5" />
                <div>
                  <div className="text-candela-secondary font-mono text-[11px] uppercase">
                    Quarry Origin
                  </div>
                  <div className="font-medium text-candela-text mt-0.5">{product.origin}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Calendar className="h-4 w-4 text-candela-accent shrink-0 mt-0.5" />
                <div>
                  <div className="text-candela-secondary font-mono text-[11px] uppercase">
                    Quarry Lot Arrival
                  </div>
                  <div className="font-mono text-candela-text mt-0.5">
                    {product.lastRestockedAt || "2026-10-08"}
                  </div>
                </div>
              </div>
            </div>

            {product.dealerNotes && (
              <div className="border-t border-candela-border/60 pt-3 text-xs text-candela-secondary">
                <strong className="text-candela-text">Dealer Verification Note:</strong>{" "}
                {product.dealerNotes}
              </div>
            )}
          </div>
        </div>

        {/* Right 5 Columns: Price, Calculator, Attributes & Specs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border-b border-candela-border pb-5 space-y-3">
            <div className="flex items-center justify-between font-mono text-xs text-candela-secondary">
              <span className="bg-candela-dark text-candela-bg px-2 py-0.5 text-[10px]">
                {product.sku}
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" /> Available in Stock
              </span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-candela-text">
              {product.name}
            </h1>

            {/* Actual Customer Price */}
            <div className="bg-candela-surface border border-candela-border p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-candela-secondary block">
                  Customer Showroom Price
                </span>
                <div className="font-mono text-2xl font-bold text-candela-accent">
                  ₹{retailPrice.toLocaleString("en-IN")}{" "}
                  <span className="text-xs font-normal text-candela-secondary">
                    {product.masterCategory === "Tiles" || product.masterCategory === "Marbles" ? "/ sq.ft" : "/ pc"}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-candela-secondary uppercase block">
                  Coverage / Unit
                </span>
                <span className="font-mono text-sm font-semibold text-candela-text">
                  {product.sqftPerBox} sq.ft
                </span>
              </div>
            </div>

            {/* WhatsApp Enquiry Direct CTA */}
            <div className="pt-1">
              <a
                href={`https://wa.me/917063099602?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 text-xs font-mono uppercase font-semibold transition shadow-sm"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp Enquiry for this Product</span>
              </a>
            </div>

            <p className="text-xs sm:text-sm text-candela-secondary leading-relaxed font-light">
              {product.shortDescription}
            </p>

            {/* Categorization chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {product.style && (
                <span className="border border-candela-border bg-candela-surface px-2.5 py-1 text-[11px] text-candela-secondary">
                  Style: <strong className="text-candela-text">{product.style}</strong>
                </span>
              )}
              {product.material && (
                <span className="border border-candela-border bg-candela-surface px-2.5 py-1 text-[11px] text-candela-secondary">
                  Material: <strong className="text-candela-text">{product.material}</strong>
                </span>
              )}
              {product.colour && (
                <span className="border border-candela-border bg-candela-surface px-2.5 py-1 text-[11px] text-candela-secondary">
                  Colour: <strong className="text-candela-text">{product.colour}</strong>
                </span>
              )}
              {product.brand && (
                <span className="border border-candela-border bg-candela-surface px-2.5 py-1 text-[11px] text-candela-accent font-medium">
                  Brand: {product.brand}
                </span>
              )}
            </div>
          </div>

          {/* Area & Price Calculator + Add to Cart / Wishlist */}
          <CoverageCalculator product={product} />

          {/* Dynamic Technical Performance Matrix */}
          <div className="border border-candela-border bg-candela-bg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-candela-border pb-2">
              <h4 className="font-mono text-xs uppercase tracking-widest text-candela-secondary font-semibold">
                Technical Specifications &amp; Architectural Matrix
              </h4>
              <span className="font-mono text-[10px] text-candela-accent uppercase tracking-wider bg-candela-accent/10 px-2 py-0.5 border border-candela-accent/20">
                {product.masterCategory || product.category}
              </span>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Common Specifications */}
              <div className="border border-candela-border p-3 bg-candela-surface">
                <dt className="text-candela-secondary font-mono text-[10px] uppercase">Dimensions &amp; Gauge</dt>
                <dd className="mt-1 font-mono font-medium text-candela-text">
                  {product.dimensionsMm} {product.thicknessMm ? `(${product.thicknessMm}mm)` : ""}
                </dd>
              </div>

              {product.finish && (
                <div className="border border-candela-border p-3 bg-candela-surface">
                  <dt className="text-candela-secondary font-mono text-[10px] uppercase">Surface Finish</dt>
                  <dd className="mt-1 font-medium text-candela-text">{product.finish}</dd>
                </div>
              )}

              {/* Kitchen Specifics */}
              {product.masterCategory === "Kitchen" && (
                <>
                  {product.specs?.heatResistance && (
                    <div className="border border-candela-border p-3 bg-candela-surface">
                      <dt className="text-candela-secondary font-mono text-[10px] uppercase">Thermal &amp; Heat Resistance</dt>
                      <dd className="mt-1 font-mono text-candela-text">{product.specs.heatResistance}</dd>
                    </div>
                  )}
                  {product.specs?.foodGradeSafety && (
                    <div className="border border-candela-border p-3 bg-candela-surface">
                      <dt className="text-candela-secondary font-mono text-[10px] uppercase">Food Contact Safety</dt>
                      <dd className="mt-1 text-candela-text">{product.specs.foodGradeSafety}</dd>
                    </div>
                  )}
                  {product.specs?.scratchResistance && (
                    <div className="border border-candela-border p-3 bg-candela-surface">
                      <dt className="text-candela-secondary font-mono text-[10px] uppercase">Scratch Resistance</dt>
                      <dd className="mt-1 font-mono text-candela-text">{product.specs.scratchResistance}</dd>
                    </div>
                  )}
                  {product.specs?.acidImmunity && (
                    <div className="border border-candela-border p-3 bg-candela-surface">
                      <dt className="text-candela-secondary font-mono text-[10px] uppercase">Acid &amp; Stain Immunity</dt>
                      <dd className="mt-1 text-candela-text">{product.specs.acidImmunity}</dd>
                    </div>
                  )}
                  {product.specs?.sinkBowlConfig && (
                    <div className="border border-candela-border p-3 bg-candela-surface">
                      <dt className="text-candela-secondary font-mono text-[10px] uppercase">Bowl Configuration</dt>
                      <dd className="mt-1 text-candela-text">{product.specs.sinkBowlConfig}</dd>
                    </div>
                  )}
                  {product.specs?.spoutReach && (
                    <div className="border border-candela-border p-3 bg-candela-surface">
                      <dt className="text-candela-secondary font-mono text-[10px] uppercase">Spout Reach &amp; Swivel</dt>
                      <dd className="mt-1 font-mono text-candela-text">{product.specs.spoutReach}</dd>
                    </div>
                  )}
                </>
              )}

              {/* Bathroom Specifics */}
              {product.masterCategory === "Bathroom" && (
                <>
                  {product.specs?.wetDryZoneRating && (
                    <div className="border border-candela-border p-3 bg-candela-surface">
                      <dt className="text-candela-secondary font-mono text-[10px] uppercase">Wet / Dry Zone Ingress</dt>
                      <dd className="mt-1 font-mono text-candela-text">{product.specs.wetDryZoneRating}</dd>
                    </div>
                  )}
                  {product.specs?.antiBacterialGlaze && (
                    <div className="border border-candela-border p-3 bg-candela-surface">
                      <dt className="text-candela-secondary font-mono text-[10px] uppercase">Anti-Bacterial Glaze</dt>
                      <dd className="mt-1 text-candela-text">{product.specs.antiBacterialGlaze}</dd>
                    </div>
                  )}
                  {product.specs?.flushTechnology && (
                    <div className="border border-candela-border p-3 bg-candela-surface">
                      <dt className="text-candela-secondary font-mono text-[10px] uppercase">Flush Technology</dt>
                      <dd className="mt-1 font-mono text-candela-text">{product.specs.flushTechnology}</dd>
                    </div>
                  )}
                  {product.specs?.trapDistance && (
                    <div className="border border-candela-border p-3 bg-candela-surface">
                      <dt className="text-candela-secondary font-mono text-[10px] uppercase">Trap Distance (Rough-in)</dt>
                      <dd className="mt-1 font-mono text-candela-text">{product.specs.trapDistance}</dd>
                    </div>
                  )}
                  {product.specs?.cabinetMaterial && (
                    <div className="border border-candela-border p-3 bg-candela-surface">
                      <dt className="text-candela-secondary font-mono text-[10px] uppercase">Cabinet Material</dt>
                      <dd className="mt-1 text-candela-text">{product.specs.cabinetMaterial}</dd>
                    </div>
                  )}
                  {product.specs?.mirrorLighting && (
                    <div className="border border-candela-border p-3 bg-candela-surface">
                      <dt className="text-candela-secondary font-mono text-[10px] uppercase">Mirror Lighting &amp; Anti-Fog</dt>
                      <dd className="mt-1 text-candela-text">{product.specs.mirrorLighting}</dd>
                    </div>
                  )}
                </>
              )}

              {/* Wellness & Spa Specifics */}
              {product.masterCategory === "Wellness & Spa" && (
                <>
                  {product.specs?.jetCount && (
                    <div className="border border-candela-border p-3 bg-candela-surface">
                      <dt className="text-candela-secondary font-mono text-[10px] uppercase">Hydrotherapy Jet System</dt>
                      <dd className="mt-1 font-mono text-candela-text">{product.specs.jetCount}</dd>
                    </div>
                  )}
                  {product.specs?.cycleTestRating && (
                    <div className="border border-candela-border p-3 bg-candela-surface">
                      <dt className="text-candela-secondary font-mono text-[10px] uppercase">Pump Cycle Rating</dt>
                      <dd className="mt-1 font-mono text-candela-text">{product.specs.cycleTestRating}</dd>
                    </div>
                  )}
                  {product.specs?.bodyMaterial && (
                    <div className="border border-candela-border p-3 bg-candela-surface">
                      <dt className="text-candela-secondary font-mono text-[10px] uppercase">Shell Material</dt>
                      <dd className="mt-1 text-candela-text">{product.specs.bodyMaterial}</dd>
                    </div>
                  )}
                  {product.specs?.warrantyYears && (
                    <div className="border border-candela-border p-3 bg-candela-surface">
                      <dt className="text-candela-secondary font-mono text-[10px] uppercase">Structural Warranty</dt>
                      <dd className="mt-1 font-mono text-candela-text">{product.specs.warrantyYears}</dd>
                    </div>
                  )}
                </>
              )}

              {/* Faucets & Showers */}
              {(product.masterCategory === "Faucets" || product.masterCategory === "Showers") && (
                <>
                  {product.mountType && (
                    <div className="border border-candela-border p-3 bg-candela-surface">
                      <dt className="text-candela-secondary font-mono text-[10px] uppercase">Mounting Type</dt>
                      <dd className="mt-1 font-mono text-candela-text">{product.mountType}</dd>
                    </div>
                  )}
                  {product.specs?.flowRateLpm && (
                    <div className="border border-candela-border p-3 bg-candela-surface">
                      <dt className="text-candela-secondary font-mono text-[10px] uppercase">Flow Rate (LPM)</dt>
                      <dd className="mt-1 font-mono text-candela-text">{product.specs.flowRateLpm}</dd>
                    </div>
                  )}
                  {product.specs?.operatingPressureBar && (
                    <div className="border border-candela-border p-3 bg-candela-surface">
                      <dt className="text-candela-secondary font-mono text-[10px] uppercase">Operating Pressure</dt>
                      <dd className="mt-1 font-mono text-candela-text">{product.specs.operatingPressureBar}</dd>
                    </div>
                  )}
                  {product.specs?.cartridgeType && (
                    <div className="border border-candela-border p-3 bg-candela-surface">
                      <dt className="text-candela-secondary font-mono text-[10px] uppercase">Cartridge Core</dt>
                      <dd className="mt-1 font-mono text-candela-text">{product.specs.cartridgeType}</dd>
                    </div>
                  )}
                </>
              )}

              {/* Tiles & Marbles Specifics */}
              {(product.masterCategory === "Tiles" || product.masterCategory === "Marbles" || (!["Kitchen", "Bathroom", "Wellness & Spa", "Faucets", "Showers", "Sanitaryware"].includes(product.masterCategory || ""))) && (
                <>
                  <div className="border border-candela-border p-3 bg-candela-surface">
                    <dt className="text-candela-secondary font-mono text-[10px] uppercase">Water Absorption</dt>
                    <dd className="mt-1 font-mono text-candela-text">
                      {product.specs?.waterAbsorption || "< 0.05% (Impervious)"}
                    </dd>
                  </div>
                  <div className="border border-candela-border p-3 bg-candela-surface">
                    <dt className="text-candela-secondary font-mono text-[10px] uppercase">Slip &amp; Scratch Hardness</dt>
                    <dd className="mt-1 font-mono text-candela-text">
                      {product.specs?.slipResistance || "R10"} • {product.specs?.mohsHardness || "6.5 Mohs"}
                    </dd>
                  </div>
                  {product.origin && (
                    <div className="border border-candela-border p-3 bg-candela-surface">
                      <dt className="text-candela-secondary font-mono text-[10px] uppercase">Quarry / Origin Country</dt>
                      <dd className="mt-1 text-candela-text">{product.origin}</dd>
                    </div>
                  )}
                </>
              )}

              {/* Dynamic Custom Specifications added by Admin */}
              {product.specs?.customSpecs?.map((customSpec, idx) => (
                <div key={idx} className="border border-candela-border p-3 bg-candela-surface">
                  <dt className="text-candela-secondary font-mono text-[10px] uppercase">{customSpec.label}</dt>
                  <dd className="mt-1 font-medium text-candela-text">{customSpec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Related Products / Complete the Look */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-candela-border pt-12 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-candela-accent">
                Architectural Harmony
              </span>
              <h3 className="font-heading text-2xl font-bold text-candela-text mt-0.5">
                Complete the Look & Similar Surfaces
              </h3>
            </div>
            <Link
              href="/shop"
              className="text-xs font-mono text-candela-accent hover:underline flex items-center gap-1"
            >
              <span>Explore Entire Shop</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
