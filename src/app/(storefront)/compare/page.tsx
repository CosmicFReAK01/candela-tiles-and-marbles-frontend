"use client";

import React from "react";
import Link from "next/link";
import { useCompare } from "@/context/CompareContext";
import { useItemCart } from "@/context/ItemCartContext";
import {
  SlidersHorizontal,
  Trash2,
  ShoppingBag,
  ArrowRight,
  MessageCircle,
  Check,
  X,
  Plus,
} from "lucide-react";

export default function ComparePage() {
  const { compareItems, removeFromCompare, clearCompare, maxCompareLimit } = useCompare();
  const { addToCart } = useItemCart();

  const emptySlotsCount = Math.max(0, maxCompareLimit - compareItems.length);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono text-candela-secondary mb-6">
        <Link href="/" className="hover:text-candela-accent">
          Home
        </Link>
        <span>/</span>
        <span className="text-candela-text font-semibold">Compare Products</span>
      </nav>

      {/* Header */}
      <div className="border-b border-candela-border pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-3xl sm:text-4xl font-semibold tracking-wide text-candela-text">
              Product Comparison
            </h1>
            <span className="font-mono text-xs text-candela-secondary bg-candela-surface px-2.5 py-1 border border-candela-border">
              {compareItems.length} of {maxCompareLimit} Products
            </span>
          </div>
          <p className="text-xs sm:text-sm text-candela-secondary mt-1 font-light">
            Compare material densities, surface finishes, dimensions, and physical test data side-by-side.
          </p>
        </div>

        {compareItems.length > 0 && (
          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 border border-candela-border bg-candela-surface px-3 py-1.5 text-xs font-mono uppercase text-candela-text hover:border-candela-accent"
            >
              <Plus className="h-3.5 w-3.5 text-candela-accent" />
              <span>Add Another Item</span>
            </Link>
            <button
              onClick={clearCompare}
              className="text-xs font-mono text-candela-secondary hover:text-red-500 transition px-2 py-1.5"
            >
              Clear Comparison
            </button>
          </div>
        )}
      </div>

      {compareItems.length === 0 ? (
        <div className="border border-candela-border bg-candela-surface p-16 text-center space-y-4">
          <div className="inline-flex p-4 bg-candela-bg border border-candela-border">
            <SlidersHorizontal className="h-8 w-8 text-candela-accent" />
          </div>
          <h2 className="font-heading text-2xl font-semibold">No Products in Comparison</h2>
          <p className="text-xs text-candela-secondary max-w-md mx-auto leading-relaxed">
            Click the comparison icon on any product card in the catalogue to evaluate up to 4 surfaces side-by-side.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-candela-accent px-6 py-2.5 text-xs font-mono uppercase font-semibold text-white hover:bg-candela-dark transition"
            >
              <span>Browse Catalogue</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto border border-candela-border bg-candela-surface">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <tbody>
              {/* Product Header Row */}
              <tr className="border-b border-candela-border bg-candela-bg">
                <td className="p-4 w-44 font-mono text-xs uppercase text-candela-secondary font-semibold align-top">
                  Product
                </td>
                {compareItems.map((item) => {
                  const waMsg = encodeURIComponent(
                    `Hello Candela Tiles & Marbles, I am interested in: ${item.name} (${item.sku}). Please share availability and quotation.`
                  );

                  return (
                    <td key={item.id} className="p-4 w-64 align-top border-l border-candela-border">
                      <div className="relative group">
                        <img
                          src={item.media.primaryImage}
                          alt={item.name}
                          className="h-36 w-full object-cover border border-candela-border mb-3"
                        />
                        <button
                          onClick={() => removeFromCompare(item.id)}
                          title="Remove from comparison"
                          className="absolute top-2 right-2 p-1 bg-candela-dark/80 text-white rounded-full hover:bg-red-600 transition"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="font-mono text-[10px] text-candela-secondary">
                        {item.sku}
                      </div>
                      <Link href={`/product/${item.slug}`}>
                        <h4 className="font-heading text-base font-bold text-candela-text hover:text-candela-accent transition line-clamp-1 mt-0.5">
                          {item.name}
                        </h4>
                      </Link>

                      <div className="font-mono text-base font-bold text-candela-accent my-2">
                        ₹{item.pricePerSqftInr.toLocaleString("en-IN")}
                        <span className="text-[10px] font-normal text-candela-secondary ml-1">
                          / sq.ft
                        </span>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => addToCart(item, 150, true, item.applications?.[0] || "General")}
                          className="flex-1 py-1.5 px-2 bg-candela-accent text-white font-mono text-[11px] uppercase font-semibold hover:bg-candela-dark transition text-center"
                        >
                          Add to BOQ
                        </button>
                        <a
                          href={`https://wa.me/917063099602?text=${waMsg}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="WhatsApp Enquiry"
                          className="p-1.5 border border-emerald-600/40 text-emerald-600 hover:bg-emerald-600 hover:text-white transition"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </a>
                      </div>
                    </td>
                  );
                })}

                {/* Empty slot placeholders */}
                {Array.from({ length: emptySlotsCount }).map((_, i) => (
                  <td
                    key={`empty-${i}`}
                    className="p-6 w-64 align-middle border-l border-candela-border text-center bg-candela-surface/40"
                  >
                    <div className="border border-dashed border-candela-border/80 p-6 flex flex-col items-center justify-center space-y-2">
                      <Plus className="h-6 w-6 text-candela-secondary" />
                      <span className="text-xs font-mono text-candela-secondary">
                        Add surface
                      </span>
                      <Link
                        href="/shop"
                        className="text-[11px] font-mono text-candela-accent underline font-semibold"
                      >
                        Browse Shop →
                      </Link>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Material */}
              <tr className="border-b border-candela-border/60">
                <td className="p-3.5 font-mono text-xs text-candela-secondary bg-candela-surface/80">
                  Material
                </td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-3.5 text-xs text-candela-text border-l border-candela-border">
                    {item.material || item.category}
                  </td>
                ))}
                {Array.from({ length: emptySlotsCount }).map((_, i) => (
                  <td key={i} className="border-l border-candela-border" />
                ))}
              </tr>

              {/* Dimensions */}
              <tr className="border-b border-candela-border/60 bg-candela-surface/30">
                <td className="p-3.5 font-mono text-xs text-candela-secondary">
                  Dimensions & Thickness
                </td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-3.5 text-xs font-mono text-candela-text border-l border-candela-border">
                    {item.dimensionsMm} ({item.thicknessMm}mm)
                  </td>
                ))}
                {Array.from({ length: emptySlotsCount }).map((_, i) => (
                  <td key={i} className="border-l border-candela-border" />
                ))}
              </tr>

              {/* Finish */}
              <tr className="border-b border-candela-border/60">
                <td className="p-3.5 font-mono text-xs text-candela-secondary bg-candela-surface/80">
                  Surface Finish
                </td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-3.5 text-xs text-candela-text border-l border-candela-border">
                    {item.finish}
                  </td>
                ))}
                {Array.from({ length: emptySlotsCount }).map((_, i) => (
                  <td key={i} className="border-l border-candela-border" />
                ))}
              </tr>

              {/* Colour */}
              <tr className="border-b border-candela-border/60 bg-candela-surface/30">
                <td className="p-3.5 font-mono text-xs text-candela-secondary">
                  Colour / Mineral
                </td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-3.5 text-xs text-candela-text border-l border-candela-border">
                    {item.colour || "Natural Stone"}
                  </td>
                ))}
                {Array.from({ length: emptySlotsCount }).map((_, i) => (
                  <td key={i} className="border-l border-candela-border" />
                ))}
              </tr>

              {/* Applications */}
              <tr className="border-b border-candela-border/60">
                <td className="p-3.5 font-mono text-xs text-candela-secondary bg-candela-surface/80">
                  Applications
                </td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-3.5 text-xs text-candela-text border-l border-candela-border">
                    <div className="flex flex-wrap gap-1">
                      {item.applications.map((app) => (
                        <span key={app} className="bg-candela-bg px-2 py-0.5 border border-candela-border text-[10px] font-mono">
                          {app}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
                {Array.from({ length: emptySlotsCount }).map((_, i) => (
                  <td key={i} className="border-l border-candela-border" />
                ))}
              </tr>

              {/* Collection */}
              <tr className="border-b border-candela-border/60 bg-candela-surface/30">
                <td className="p-3.5 font-mono text-xs text-candela-secondary">
                  Collection
                </td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-3.5 text-xs text-candela-text border-l border-candela-border">
                    {item.collectionName}
                  </td>
                ))}
                {Array.from({ length: emptySlotsCount }).map((_, i) => (
                  <td key={i} className="border-l border-candela-border" />
                ))}
              </tr>

              {/* Brand & Origin */}
              <tr className="border-b border-candela-border/60">
                <td className="p-3.5 font-mono text-xs text-candela-secondary bg-candela-surface/80">
                  Brand & Origin
                </td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-3.5 text-xs font-mono text-candela-text border-l border-candela-border">
                    {item.brand || "Candela Imports"} • {item.origin}
                  </td>
                ))}
                {Array.from({ length: emptySlotsCount }).map((_, i) => (
                  <td key={i} className="border-l border-candela-border" />
                ))}
              </tr>

              {/* Physical Specs */}
              <tr className="border-b border-candela-border/60 bg-candela-surface/30">
                <td className="p-3.5 font-mono text-xs text-candela-secondary">
                  Water Absorption
                </td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-3.5 text-xs font-mono text-candela-text border-l border-candela-border">
                    {item.specs.waterAbsorption || "0.15%"}
                  </td>
                ))}
                {Array.from({ length: emptySlotsCount }).map((_, i) => (
                  <td key={i} className="border-l border-candela-border" />
                ))}
              </tr>

              <tr className="border-b border-candela-border/60">
                <td className="p-3.5 font-mono text-xs text-candela-secondary bg-candela-surface/80">
                  Slip & Hardness
                </td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-3.5 text-xs font-mono text-candela-text border-l border-candela-border">
                    {item.specs.slipResistance} • {item.specs.mohsHardness}
                  </td>
                ))}
                {Array.from({ length: emptySlotsCount }).map((_, i) => (
                  <td key={i} className="border-l border-candela-border" />
                ))}
              </tr>

              {/* Warehouse stock */}
              <tr>
                <td className="p-3.5 font-mono text-xs text-candela-secondary bg-candela-surface/80">
                  Stock Availability
                </td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-3.5 text-xs font-mono text-emerald-700 font-semibold border-l border-candela-border">
                    {item.stockSqftAvailable ? `${item.stockSqftAvailable.toLocaleString("en-IN")} sq.ft` : "Ready Stock"}
                  </td>
                ))}
                {Array.from({ length: emptySlotsCount }).map((_, i) => (
                  <td key={i} className="border-l border-candela-border" />
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
