"use client";

import React, { useState } from "react";
import { PublicProduct } from "@/types";
import { calculateCoverage, useItemCart } from "@/context/ItemCartContext";
import { Calculator, Check, Heart, ShoppingBag, Sparkles } from "lucide-react";

interface CoverageCalculatorProps {
  product: PublicProduct;
}

export function CoverageCalculator({ product }: CoverageCalculatorProps) {
  const { addToCart, toggleWishlist, isInWishlist, setIsCartOpen } = useItemCart();
  const [requestedSqft, setRequestedSqft] = useState<number>(350);
  const [includeWastage, setIncludeWastage] = useState<boolean>(true);
  const [applicationNote, setApplicationNote] = useState<string>(
    product.applications[0] || "Flooring"
  );
  const [addedToast, setAddedToast] = useState<boolean>(false);

  const isFavorited = isInWishlist(product.id);

  const { effectiveSqft, estimatedBoxes } = calculateCoverage(
    requestedSqft,
    product.sqftPerBox,
    includeWastage
  );

  const handleAddToCart = () => {
    addToCart(product, requestedSqft, includeWastage, applicationNote);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  return (
    <div className="border border-candela-border bg-candela-surface p-6 space-y-5">
      <div className="flex items-center justify-between border-b border-candela-border pb-4">
        <div className="flex items-center gap-2">
          <Calculator className="h-4 w-4 text-candela-accent" />
          <h3 className="font-heading text-xl font-semibold text-candela-text">
            Project Area & Slab Estimator
          </h3>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-mono uppercase tracking-wider text-candela-secondary">
            Showroom Price
          </div>
          <div className="font-mono text-base sm:text-lg font-bold text-candela-accent">
            ₹{(product.pricePerSqftInr || 1450).toLocaleString("en-IN")}{" "}
            <span className="text-xs font-normal text-candela-secondary">/ sq.ft</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-candela-secondary mb-1.5">
            Net Project Area (Sq. Ft.)
          </label>
          <input
            type="number"
            min={20}
            step={10}
            value={requestedSqft}
            onChange={(e) => setRequestedSqft(Math.max(10, Number(e.target.value)))}
            className="w-full border border-candela-border bg-candela-bg px-3.5 py-2.5 font-mono text-sm text-candela-text focus:border-candela-accent focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-candela-secondary mb-1.5">
            Application Zone
          </label>
          <select
            value={applicationNote}
            onChange={(e) => setApplicationNote(e.target.value)}
            className="w-full border border-candela-border bg-candela-bg px-3.5 py-2.5 text-sm text-candela-text focus:border-candela-accent focus:outline-none"
          >
            {product.applications.map((app) => (
              <option key={app} value={app}>
                {app}
              </option>
            ))}
            <option value="Custom Architectural Detail">
              Custom Architectural Detail
            </option>
          </select>
        </div>
      </div>

      <label className="flex items-center gap-2.5 cursor-pointer text-xs text-candela-secondary">
        <input
          type="checkbox"
          checked={includeWastage}
          onChange={(e) => setIncludeWastage(e.target.checked)}
          className="h-4 w-4 accent-candela-accent"
        />
        <span>
          Include recommended <strong>+10% cutting & bookmatch wastage</strong>{" "}
          (Indian IS-15622 architectural standard)
        </span>
      </label>

      {/* Computed Output Grid with Project Cost Calculation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border border-candela-border bg-candela-bg divide-x divide-y sm:divide-y-0 divide-candela-border text-center">
        <div className="p-3">
          <div className="text-[11px] uppercase tracking-wider text-candela-secondary">
            Total Area
          </div>
          <div className="mt-1 font-mono text-base font-semibold text-candela-text">
            {effectiveSqft} sq.ft
          </div>
        </div>
        <div className="p-3">
          <div className="text-[11px] uppercase tracking-wider text-candela-secondary">
            Slab Coverage
          </div>
          <div className="mt-1 font-mono text-base font-semibold text-candela-text">
            {product.sqftPerBox} sq.ft
          </div>
        </div>
        <div className="p-3">
          <div className="text-[11px] uppercase tracking-wider text-candela-secondary">
            Est. Slabs
          </div>
          <div className="mt-1 font-mono text-base font-semibold text-candela-accent">
            {estimatedBoxes} {estimatedBoxes === 1 ? "Slab" : "Slabs"}
          </div>
        </div>
        <div className="p-3">
          <div className="text-[11px] uppercase tracking-wider text-candela-secondary">
            Estimated Cost
          </div>
          <div className="mt-1 font-mono text-base font-bold text-candela-accent">
            ₹{((product.pricePerSqftInr || 1450) * effectiveSqft).toLocaleString("en-IN")}
          </div>
        </div>
      </div>

      {/* Primary CTAs: Add to Item Cart & Wishlist */}
      <div className="space-y-2.5 pt-1">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-2 bg-candela-accent px-6 py-3.5 text-xs sm:text-sm font-medium uppercase tracking-widest text-white transition hover:bg-candela-dark cursor-pointer"
          >
            {addedToast ? (
              <>
                <Check className="h-4 w-4" />
                Added to Item Cart
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" />
                Add to Item Cart
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            title={isFavorited ? "Remove from Wishlist" : "Save to Wishlist"}
            className={`border px-4 py-3.5 transition flex items-center justify-center cursor-pointer ${
              isFavorited
                ? "border-red-400 bg-red-50 text-red-600"
                : "border-candela-border bg-candela-bg text-candela-secondary hover:text-candela-accent hover:border-candela-accent"
            }`}
          >
            <Heart className={`h-5 w-5 ${isFavorited ? "fill-current" : ""}`} />
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-candela-secondary pt-1">
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-candela-accent" />
            Saved to your local Item Cart & Wishlist.
          </span>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="font-medium text-candela-accent underline hover:text-candela-dark"
          >
            Open Cart Drawer
          </button>
        </div>
      </div>
    </div>
  );
}
