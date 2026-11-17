"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCandelaStore } from "@/context/CandelaStoreContext";
import { PublicProduct } from "@/types";
import {
  Sparkles,
  Sliders,
  RotateCw,
  Share2,
  MessageCircle,
  Check,
  ArrowRight,
  Eye,
  Layers,
  Image as ImageIcon,
} from "lucide-react";

const ROOM_PRESETS = [
  {
    id: "living-room",
    name: "Living Room Pavilion",
    subtitle: "Double-height wall & seamless floor",
    baseImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    surfaces: ["Flooring", "Feature Wall"],
  },
  {
    id: "bathroom",
    name: "Master Bathroom Sanctuary",
    subtitle: "Vanity feature & walk-in shower",
    baseImage:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80",
    surfaces: ["Flooring", "Feature Wall", "Countertop"],
  },
  {
    id: "kitchen",
    name: "Contemporary Island Kitchen",
    subtitle: "3.2m seamless waterfall island",
    baseImage:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80",
    surfaces: ["Countertop", "Flooring"],
  },
  {
    id: "patio",
    name: "Outdoor Verandah & Deck",
    subtitle: "20mm anti-slip exterior pavers",
    baseImage:
      "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1600&q=80",
    surfaces: ["Flooring", "Facade"],
  },
];

export default function RoomVisualizerPage() {
  const { products } = useCandelaStore();

  const [activeRoom, setActiveRoom] = useState(ROOM_PRESETS[0]);
  const [activeSurface, setActiveSurface] = useState("Flooring");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [splitSliderPosition, setSplitSliderPosition] = useState(50);
  const [sheenLevel, setSheenLevel] = useState<"Polished" | "Silk Honed" | "Matte">("Polished");
  const [copied, setCopied] = useState(false);

  const selectedProduct: PublicProduct | undefined =
    products.find((p) => p.id === selectedProductId) || products[0];

  if (!selectedProduct) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 text-center">
        <h1 className="font-heading text-3xl text-candela-text">
          Interactive Room Visualizer
        </h1>
        <p className="mt-3 font-mono text-xs uppercase tracking-widest text-candela-secondary">
          Loading live stone archive...
        </p>
      </div>
    );
  }

  const handleShareVisualizer = () => {
    const text = `Candela Room Visualizer Setup:\nRoom: ${activeRoom.name}\nSurface: ${activeSurface}\nSelected Stone: ${selectedProduct.name} (${selectedProduct.sku})\nPrice: ₹${selectedProduct.pricePerSqftInr}/sq.ft`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      alert(text);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Candela Tiles & Marbles,\n\nI created a room visualisation:\nRoom: ${activeRoom.name}\nSurface: ${activeSurface}\nProduct: ${selectedProduct.name} (${selectedProduct.sku})\n\nPlease share dry-lay availability and sample delivery details.`
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono text-candela-secondary mb-6">
        <Link href="/" className="hover:text-candela-accent">
          Home
        </Link>
        <span>/</span>
        <span className="text-candela-text font-semibold">Interactive Room Visualizer</span>
      </nav>

      {/* Header */}
      <div className="border-b border-candela-border pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 border border-candela-accent/40 bg-candela-surface px-3 py-1 font-mono text-xs uppercase tracking-widest text-candela-accent mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Real-Time Surface Simulator</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-semibold tracking-wide text-candela-text">
            Architectural Room Visualizer
          </h1>
          <p className="text-xs sm:text-sm text-candela-secondary mt-1 font-light max-w-2xl">
            Simulate bookmatched Italian marbles and large-format porcelain slabs in architectural spaces. Adjust split sliders to preview before-and-after surface transformations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShareVisualizer}
            className="inline-flex items-center gap-1.5 border border-candela-border bg-candela-surface px-3.5 py-2 text-xs font-mono uppercase text-candela-text hover:border-candela-accent transition"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5 text-candela-accent" />
                <span>Share Look</span>
              </>
            )}
          </button>

          <a
            href={`https://wa.me/917063099602?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-emerald-600 text-white px-4 py-2 text-xs font-mono uppercase font-semibold hover:bg-emerald-700 transition"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>Enquire on WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Main Visualizer Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Visualizer Canvas (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative border border-candela-border bg-black aspect-[16/10] overflow-hidden select-none">
            {/* Base Original Room Image (Background) */}
            <img
              src={activeRoom.baseImage}
              alt="Original Room Preset"
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Simulated Transformed Layer with Texture Blend */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                clipPath: `polygon(0 0, ${splitSliderPosition}% 0, ${splitSliderPosition}% 100%, 0 100%)`,
              }}
            >
              <img
                src={selectedProduct.media.primaryImage}
                alt="Selected Stone Texture Overlay"
                className={`h-full w-full object-cover transition-opacity duration-300 ${
                  sheenLevel === "Polished"
                    ? "brightness-105 contrast-115"
                    : sheenLevel === "Silk Honed"
                    ? "brightness-95 contrast-100"
                    : "brightness-90 contrast-95"
                }`}
              />
              <div
                className={`absolute inset-0 pointer-events-none ${
                  sheenLevel === "Polished"
                    ? "bg-gradient-to-tr from-transparent via-white/20 to-transparent mix-blend-overlay"
                    : "bg-black/10"
                }`}
              />
              <div className="absolute top-4 left-4 bg-candela-dark/90 px-3 py-1 font-mono text-[10px] text-candela-accent border border-candela-border/30">
                SIMULATED: {selectedProduct.name}
              </div>
            </div>

            {/* Split Slider Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize shadow-2xl z-20 pointer-events-none"
              style={{ left: `${splitSliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-candela-dark text-white border-2 border-white flex items-center justify-center text-[10px] font-mono shadow-xl">
                ⇄
              </div>
            </div>

            {/* Top Right Original Tag */}
            <div className="absolute top-4 right-4 bg-candela-dark/90 px-3 py-1 font-mono text-[10px] text-white/80 border border-candela-border/30">
              ORIGINAL SPACE
            </div>

            {/* Interactive Slider Input */}
            <input
              type="range"
              min="0"
              max="100"
              value={splitSliderPosition}
              onChange={(e) => setSplitSliderPosition(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
              aria-label="Before and after split slider"
            />
          </div>

          {/* Slider controls & Sheen Toggles */}
          <div className="border border-candela-border bg-candela-surface p-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="text-candela-secondary">Split View:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={splitSliderPosition}
                onChange={(e) => setSplitSliderPosition(Number(e.target.value))}
                className="w-36 accent-candela-accent cursor-pointer"
              />
              <span className="text-candela-text font-bold">{splitSliderPosition}%</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-candela-secondary">Surface Sheen:</span>
              {(["Polished", "Silk Honed", "Matte"] as const).map((finish) => (
                <button
                  key={finish}
                  onClick={() => setSheenLevel(finish)}
                  className={`px-2.5 py-1 text-[11px] border transition ${
                    sheenLevel === finish
                      ? "bg-candela-dark text-candela-accent border-candela-accent font-semibold"
                      : "border-candela-border bg-candela-bg text-candela-text hover:border-candela-accent"
                  }`}
                >
                  {finish}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Configuration Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* 1. Choose Room Preset */}
          <div className="border border-candela-border bg-candela-surface p-5 space-y-3">
            <div className="font-heading text-sm uppercase tracking-wider font-semibold text-candela-text">
              1. Select Room Environment
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ROOM_PRESETS.map((room) => (
                <button
                  key={room.id}
                  onClick={() => {
                    setActiveRoom(room);
                    setActiveSurface(room.surfaces[0]);
                  }}
                  className={`p-2.5 text-left border transition ${
                    activeRoom.id === room.id
                      ? "border-candela-accent bg-candela-bg shadow-sm"
                      : "border-candela-border bg-candela-bg/40 hover:border-candela-accent"
                  }`}
                >
                  <div className="font-heading text-xs font-semibold text-candela-text line-clamp-1">
                    {room.name}
                  </div>
                  <div className="text-[10px] text-candela-secondary line-clamp-1 mt-0.5">
                    {room.subtitle}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Target Surface */}
          <div className="border border-candela-border bg-candela-surface p-5 space-y-3">
            <div className="font-heading text-sm uppercase tracking-wider font-semibold text-candela-text">
              2. Target Surface in {activeRoom.name}
            </div>
            <div className="flex flex-wrap gap-2">
              {activeRoom.surfaces.map((surface) => (
                <button
                  key={surface}
                  onClick={() => setActiveSurface(surface)}
                  className={`px-3 py-1.5 text-xs font-mono border transition ${
                    activeSurface === surface
                      ? "bg-candela-dark text-candela-accent border-candela-accent font-semibold"
                      : "border-candela-border bg-candela-bg text-candela-text hover:border-candela-accent"
                  }`}
                >
                  {surface}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Pick Surface Stone from Live Catalogue */}
          <div className="border border-candela-border bg-candela-surface p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-heading text-sm uppercase tracking-wider font-semibold text-candela-text">
                3. Choose Surface Stone
              </div>
              <Link href="/shop" className="text-[10px] font-mono text-candela-accent hover:underline">
                Full Shop →
              </Link>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {products.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProductId(p.id)}
                  className={`w-full p-2 border text-left flex items-center gap-3 transition ${
                    selectedProduct.id === p.id
                      ? "border-candela-accent bg-candela-bg shadow-sm"
                      : "border-candela-border bg-candela-bg/40 hover:border-candela-accent"
                  }`}
                >
                  <img
                    src={p.media.primaryImage}
                    alt={p.name}
                    className="h-12 w-12 object-cover border border-candela-border shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-heading text-xs font-bold text-candela-text truncate">
                      {p.name}
                    </div>
                    <div className="text-[10px] font-mono text-candela-secondary truncate">
                      {p.material || p.category} • {p.dimensionsMm}
                    </div>
                    <div className="text-[11px] font-mono font-semibold text-candela-accent mt-0.5">
                      ₹{p.pricePerSqftInr.toLocaleString("en-IN")}/sq.ft
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Summary Card */}
          <div className="border border-candela-border bg-candela-bg p-4 space-y-3">
            <div className="text-xs font-mono uppercase text-candela-secondary">
              Active Specification
            </div>
            <div className="space-y-1">
              <div className="font-heading text-base font-bold text-candela-text">
                {selectedProduct.name}
              </div>
              <div className="text-xs text-candela-secondary">
                {selectedProduct.origin} • {selectedProduct.dimensionsMm} • {selectedProduct.finish}
              </div>
            </div>
            <Link
              href={`/product/${selectedProduct.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-candela-accent hover:underline"
            >
              <span>View Product Detail & 360° View</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
