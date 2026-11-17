"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useItemCart } from "@/context/ItemCartContext";
import { useCandelaStore } from "@/context/CandelaStoreContext";
import { ArrowRight, Bookmark, ShoppingBag, Trash2, X, Plus } from "lucide-react";

export function ItemCartDrawer() {
  const {
    cartItems,
    wishlistIds,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartSqft,
    toggleWishlist,
    addToCart,
    totalEffectiveSqft,
    totalBoxes,
  } = useItemCart();
  const { products: allProducts } = useCandelaStore();

  const [activeTab, setActiveTab] = useState<"cart" | "wishlist">("cart");
  const wishlistProducts = allProducts.filter((p) => wishlistIds.includes(p.id));

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="flex h-full w-full max-w-lg flex-col border-l border-candela-border bg-candela-bg shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-candela-border px-6 py-4 bg-candela-surface">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-candela-text">
              {activeTab === "cart" ? "My Item Cart" : "Saved Wishlist"}
            </h2>
            <p className="text-xs text-candela-secondary">
              {activeTab === "cart"
                ? `${cartItems.length} Surface Slabs Added`
                : `${wishlistIds.length} Saved Surfaces`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="border border-candela-border p-2 text-candela-secondary hover:text-candela-text hover:bg-candela-bg transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-candela-border bg-candela-surface/60 text-xs font-mono uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setActiveTab("cart")}
            className={`flex-1 py-3 text-center border-b-2 transition cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "cart"
                ? "border-candela-accent text-candela-text font-semibold bg-candela-bg"
                : "border-transparent text-candela-secondary hover:text-candela-text"
            }`}
          >
            <ShoppingBag className="h-3.5 w-3.5 text-candela-accent" />
            <span>Item Cart ({cartItems.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("wishlist")}
            className={`flex-1 py-3 text-center border-b-2 transition cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "wishlist"
                ? "border-candela-accent text-candela-text font-semibold bg-candela-bg"
                : "border-transparent text-candela-secondary hover:text-candela-text"
            }`}
          >
            <Bookmark className="h-3.5 w-3.5 text-candela-accent" />
            <span>Wishlist ({wishlistIds.length})</span>
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === "cart" ? (
            cartItems.length === 0 ? (
              <div className="border border-dashed border-candela-border p-10 text-center space-y-3 bg-candela-surface">
                <ShoppingBag className="h-8 w-8 text-candela-accent mx-auto opacity-70" />
                <p className="font-heading text-xl text-candela-text">
                  Your Item Cart is Empty
                </p>
                <p className="text-xs text-candela-secondary leading-relaxed">
                  Browse our surfaces by Style, Colour, Shape, Material, or Brand and add slabs to your cart.
                </p>
                <Link
                  href="/products"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-block mt-2 bg-candela-accent px-4 py-2 text-xs font-medium uppercase text-white hover:bg-candela-dark transition"
                >
                  Explore Surfaces
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="border border-candela-border bg-candela-surface p-4 flex gap-4 transition hover:border-candela-accent"
                >
                  {/* Real Image of the Item */}
                  <div className="relative h-24 w-24 shrink-0 border border-candela-border overflow-hidden bg-candela-bg">
                    <Image
                      src={item.product.media.primaryImage}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-[10px] uppercase text-candela-secondary">
                          {item.product.sku}
                        </span>
                        <h4 className="font-heading text-base font-semibold text-candela-text line-clamp-1">
                          {item.product.name}
                        </h4>
                        <div className="text-[11px] text-candela-secondary">
                          {item.product.finish} • {item.product.dimensionsMm}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-candela-secondary hover:text-red-700 p-1 cursor-pointer"
                        title="Remove from Cart"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between border-t border-candela-border pt-2 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-candela-secondary uppercase font-mono">
                          Sq.Ft:
                        </span>
                        <input
                          type="number"
                          min={10}
                          step={10}
                          value={item.requestedSqft}
                          onChange={(e) =>
                            updateCartSqft(
                              item.product.id,
                              Number(e.target.value),
                              item.includeWastage10Percent
                            )
                          }
                          className="w-16 border border-candela-border bg-candela-bg px-2 py-0.5 font-mono text-xs text-candela-text"
                        />
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-xs font-semibold text-candela-accent">
                          ₹{((item.product.pricePerSqftInr || 1450) * item.effectiveSqft).toLocaleString("en-IN")}
                        </div>
                        <div className="text-[10px] font-mono text-candela-secondary">
                          ₹{(item.product.pricePerSqftInr || 1450).toLocaleString("en-IN")}/sq.ft • {item.effectiveSqft} sq.ft
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )
          ) : wishlistProducts.length === 0 ? (
            <div className="border border-dashed border-candela-border p-10 text-center space-y-3 bg-candela-surface">
              <Bookmark className="h-8 w-8 text-candela-accent mx-auto opacity-70" />
              <p className="font-heading text-xl text-candela-text">
                Your Wishlist is Empty
              </p>
              <p className="text-xs text-candela-secondary leading-relaxed">
                Click the bookmark icon on any stone slab or tile to save it for later review.
              </p>
            </div>
          ) : (
            wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="border border-candela-border bg-candela-surface p-4 flex gap-4 transition hover:border-candela-accent"
              >
                <div className="relative h-20 w-20 shrink-0 border border-candela-border overflow-hidden bg-candela-bg">
                  <Image
                    src={product.media.primaryImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <span className="font-mono text-[10px] uppercase text-candela-secondary">
                        {product.sku}
                      </span>
                      <h4 className="font-heading text-base font-semibold text-candela-text">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-candela-secondary">
                        {product.category} • {product.finish}
                      </p>
                      <div className="font-mono text-xs font-semibold text-candela-accent mt-0.5">
                        ₹{(product.pricePerSqftInr || 1450).toLocaleString("en-IN")} / sq.ft
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product.id)}
                      className="text-candela-secondary hover:text-red-700 p-1 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => addToCart(product)}
                    className="inline-flex items-center gap-1.5 bg-candela-accent px-3 py-1.5 text-[11px] uppercase tracking-wider text-white hover:bg-candela-dark transition cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    Move to Cart
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer with Total Estimated Order Value */}
        {activeTab === "cart" && cartItems.length > 0 && (
          <div className="border-t border-candela-border bg-candela-surface p-6 space-y-4">
            <div className="space-y-1.5 border-b border-candela-border pb-3">
              <div className="flex justify-between text-xs">
                <span className="uppercase tracking-wider text-candela-secondary">
                  Total Coverage (10% wastage included)
                </span>
                <span className="font-mono font-semibold text-candela-text">
                  {totalEffectiveSqft} sq.ft • {totalBoxes} Slabs
                </span>
              </div>
              <div className="flex justify-between items-center text-sm pt-1">
                <span className="uppercase tracking-wider text-xs font-semibold text-candela-text">
                  Total Estimated Value
                </span>
                <span className="font-mono text-lg font-bold text-candela-accent">
                  ₹{cartItems
                    .reduce(
                      (acc, i) =>
                        acc + (i.product.pricePerSqftInr || 1450) * i.effectiveSqft,
                      0
                    )
                    .toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/cart"
                onClick={() => setIsCartOpen(false)}
                className="flex items-center justify-center border border-candela-border bg-candela-bg py-3 text-xs font-mono uppercase tracking-wider text-candela-text hover:border-candela-accent transition"
              >
                View Full Cart
              </Link>
              <Link
                href="/enquiry"
                onClick={() => setIsCartOpen(false)}
                className="flex items-center justify-center gap-1.5 bg-candela-accent py-3 text-xs font-medium uppercase tracking-widest text-white hover:bg-candela-dark transition"
              >
                <span>Checkout Quote</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Backwards compatibility export
export const QuoteBasketDrawer = ItemCartDrawer;
