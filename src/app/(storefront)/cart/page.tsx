"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useItemCart } from "@/context/ItemCartContext";
import { buildWhatsAppEnquiryUrl, candelaApi } from "@/lib/api";
import { EnquirySubmissionPayload } from "@/types";
import {
  ArrowRight,
  Bookmark,
  CheckCircle2,
  MessageSquare,
  Send,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useCandelaStore } from "@/context/CandelaStoreContext";

export default function CartPage() {
  const {
    cartItems,
    wishlistIds,
    removeFromCart,
    updateCartSqft,
    toggleWishlist,
    addToCart,
    clearCart,
    totalEffectiveSqft,
    totalBoxes,
  } = useItemCart();
  const { products: allProducts } = useCandelaStore();

  const [activeTab, setActiveTab] = useState<"cart" | "wishlist">("cart");
  const [clientName, setClientName] = useState("");
  const [phoneWhatsApp, setPhoneWhatsApp] = useState("");
  const [email, setEmail] = useState("");
  const [projectCity, setProjectCity] = useState("Mumbai / Navi Mumbai");
  const [notes, setNotes] = useState("");
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [lastPayload, setLastPayload] = useState<EnquirySubmissionPayload | null>(null);

  const wishlistProducts = allProducts.filter((p) => wishlistIds.includes(p.id));

  const handleCheckoutEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    const payload: EnquirySubmissionPayload = {
      clientName: clientName || "Valued Client",
      role: "Architect / Interior Designer",
      phoneWhatsApp,
      email,
      projectCity,
      projectTimeline: "1-3 Months",
      notes,
      items: cartItems.map((i) => ({
        productId: i.product.id,
        sku: i.product.sku,
        productName: i.product.name,
        requestedSqft: i.requestedSqft,
        effectiveSqft: i.effectiveSqft,
        estimatedBoxes: i.estimatedBoxes,
        applicationNote: i.applicationNote || "Flooring / Feature Wall",
      })),
    };
    const res = await candelaApi.submitEnquiry(payload);
    setLastPayload(payload);
    setSubmittedRef(res.referenceCode);
    clearCart();
  };

  if (submittedRef && lastPayload) {
    const waUrl = buildWhatsAppEnquiryUrl(lastPayload, submittedRef);
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="border border-candela-accent bg-candela-surface p-8 space-y-6">
          <div className="flex items-center gap-3 text-candela-accent">
            <CheckCircle2 className="h-7 w-7" />
            <span className="font-mono text-xs uppercase tracking-widest">
              ITEM CART ENQUIRY REGISTERED
            </span>
          </div>
          <h1 className="font-heading text-4xl text-candela-text">
            Quote Reference:{" "}
            <span className="font-mono text-candela-accent">{submittedRef}</span>
          </h1>
          <p className="text-sm text-candela-secondary leading-relaxed">
            Your items have been submitted to our Showroom Trade Desk. An architectural consultant will prepare trade pricing, slab lot photographs, and dry-lay schedules.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-candela-accent px-6 py-3.5 text-xs font-medium uppercase tracking-widest text-white hover:bg-candela-dark"
            >
              <MessageSquare className="h-4 w-4" />
              Chat on WhatsApp with Reference
            </a>
            <Link
              href="/products"
              className="border border-candela-border bg-candela-bg px-6 py-3.5 font-mono text-xs uppercase text-candela-text hover:border-candela-accent"
            >
              Continue Browsing →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 space-y-8">
      <div className="border-b border-candela-border pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-candela-accent">
            CUSTOMER SELECTION & QUOTE DESK
          </span>
          <h1 className="mt-1 font-heading text-4xl sm:text-5xl text-candela-text">
            Item Cart & Saved Slabs
          </h1>
        </div>

        <div className="flex border border-candela-border bg-candela-surface text-xs font-mono uppercase">
          <button
            type="button"
            onClick={() => setActiveTab("cart")}
            className={`px-4 py-2 flex items-center gap-2 transition ${
              activeTab === "cart"
                ? "bg-candela-accent text-white font-medium"
                : "text-candela-secondary hover:text-candela-text"
            }`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Cart ({cartItems.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("wishlist")}
            className={`px-4 py-2 flex items-center gap-2 transition ${
              activeTab === "wishlist"
                ? "bg-candela-accent text-white font-medium"
                : "text-candela-secondary hover:text-candela-text"
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>Wishlist ({wishlistIds.length})</span>
          </button>
        </div>
      </div>

      {activeTab === "cart" ? (
        cartItems.length === 0 ? (
          <div className="border border-dashed border-candela-border p-16 text-center space-y-4 bg-candela-surface">
            <ShoppingBag className="h-12 w-12 text-candela-accent mx-auto opacity-60" />
            <h2 className="font-heading text-3xl text-candela-text">
              Your Item Cart is Currently Empty
            </h2>
            <p className="max-w-md mx-auto text-xs text-candela-secondary leading-relaxed">
              Explore our marble, sintered stone, and architectural porcelain by Style, Colour, Shape, Material, or Brand and add liked items.
            </p>
            <Link
              href="/products"
              className="inline-block bg-candela-accent px-6 py-3 text-xs font-medium uppercase tracking-wider text-white hover:bg-candela-dark transition"
            >
              Browse All Surfaces
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left 7 Columns: Items List */}
            <div className="lg:col-span-7 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="border border-candela-border bg-candela-surface p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5"
                >
                  <div className="relative h-24 w-24 shrink-0 border border-candela-border overflow-hidden bg-candela-bg">
                    <Image
                      src={item.product.media.primaryImage}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-1">
                    <span className="font-mono text-xs text-candela-secondary">
                      {item.product.sku} • {item.product.origin}
                    </span>
                    <h3 className="font-heading text-xl font-semibold text-candela-text">
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-candela-secondary">
                      {item.product.finish} • {item.product.dimensionsMm} • {item.applicationNote}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-candela-secondary">
                        Sq.Ft Area
                      </label>
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
                        className="mt-1 w-20 border border-candela-border bg-candela-bg px-2 py-1 font-mono text-xs text-candela-text"
                      />
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-xs font-semibold text-candela-accent">
                        ₹{((item.product.pricePerSqftInr || 1450) * item.effectiveSqft).toLocaleString("en-IN")}
                      </div>
                      <div className="text-[10px] text-candela-secondary">
                        ₹{(item.product.pricePerSqftInr || 1450).toLocaleString("en-IN")}/sq.ft
                      </div>
                      <div className="text-[10px] text-candela-secondary">
                        {item.effectiveSqft} sq.ft ({item.estimatedBoxes} Slabs)
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 text-candela-secondary hover:text-red-700 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="border border-candela-border bg-candela-bg p-4 flex justify-between items-center font-mono text-xs">
                <div>
                  <div className="text-candela-secondary">CONSOLIDATED SELECTION:</div>
                  <div className="font-semibold text-candela-text">
                    {totalEffectiveSqft} Sq.Ft ({totalBoxes} Slabs / Crates)
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-candela-secondary text-[11px]">ESTIMATED VALUE:</div>
                  <div className="text-base font-bold text-candela-accent">
                    ₹{cartItems
                      .reduce(
                        (acc, i) =>
                          acc + (i.product.pricePerSqftInr || 1450) * i.effectiveSqft,
                        0
                      )
                      .toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Request Pricing Form */}
            <form
              onSubmit={handleCheckoutEnquiry}
              className="lg:col-span-5 border border-candela-border bg-candela-surface p-6 space-y-4"
            >
              <h2 className="font-heading text-2xl font-semibold text-candela-text">
                Request Item Price & BOQ
              </h2>
              <p className="text-xs text-candela-secondary">
                Submit your saved items for quotation from our Showroom Trade Desk.
              </p>
              <div>
                <label className="block text-xs uppercase tracking-wider text-candela-secondary mb-1">
                  Full Name *
                </label>
                <input
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Ar. Priya Sharma"
                  className="w-full border border-candela-border bg-candela-bg px-3.5 py-2.5 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-candela-secondary mb-1">
                    WhatsApp *
                  </label>
                  <input
                    required
                    value={phoneWhatsApp}
                    onChange={(e) => setPhoneWhatsApp(e.target.value)}
                    placeholder="+91 98201 XXXXX"
                    className="w-full border border-candela-border bg-candela-bg px-3.5 py-2.5 font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-candela-secondary mb-1">
                    City
                  </label>
                  <input
                    value={projectCity}
                    onChange={(e) => setProjectCity(e.target.value)}
                    className="w-full border border-candela-border bg-candela-bg px-3.5 py-2.5 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-candela-secondary mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="priya@designstudio.in"
                  className="w-full border border-candela-border bg-candela-bg px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-candela-secondary mb-1">
                  Project Notes (Dry-Lay / Cutting Schedule)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-candela-border bg-candela-bg px-3.5 py-2 text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-candela-accent px-6 py-3.5 text-xs font-medium uppercase tracking-widest text-white hover:bg-candela-dark cursor-pointer transition"
              >
                <Send className="h-4 w-4" />
                Submit Cart For Price Quotation
              </button>
            </form>
          </div>
        )
      ) : (
        /* Wishlist View */
        wishlistProducts.length === 0 ? (
          <div className="border border-dashed border-candela-border p-16 text-center space-y-4 bg-candela-surface">
            <Bookmark className="h-12 w-12 text-candela-accent mx-auto opacity-60" />
            <h2 className="font-heading text-3xl text-candela-text">
              Your Wishlist is Empty
            </h2>
            <p className="max-w-md mx-auto text-xs text-candela-secondary leading-relaxed">
              Save your favorite slabs and tiles by clicking the bookmark icon while browsing.
            </p>
            <Link
              href="/products"
              className="inline-block bg-candela-accent px-6 py-3 text-xs font-medium uppercase tracking-wider text-white hover:bg-candela-dark transition"
            >
              Explore Slabs & Tiles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="border border-candela-border bg-candela-surface overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-60 w-full overflow-hidden bg-candela-bg">
                    <Image
                      src={product.media.primaryImage}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-3 right-3 p-2 bg-candela-dark/90 text-candela-accent border border-candela-border hover:bg-red-700 hover:text-white cursor-pointer transition"
                      title="Remove from Wishlist"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="font-mono text-[10px] text-candela-secondary">
                      {product.sku} • {product.origin}
                    </div>
                    <Link
                      href={`/products/${product.slug}`}
                      className="block font-heading text-xl font-semibold text-candela-text hover:text-candela-accent"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-candela-secondary line-clamp-2">
                      {product.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="border-t border-candela-border p-4 bg-candela-bg flex items-center justify-between">
                  <span className="font-mono text-xs text-candela-accent">Request Price</span>
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(product);
                      setActiveTab("cart");
                    }}
                    className="bg-candela-accent px-4 py-2 text-xs font-medium uppercase text-white hover:bg-candela-dark cursor-pointer transition flex items-center gap-1.5"
                  >
                    <span>Move to Cart</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
