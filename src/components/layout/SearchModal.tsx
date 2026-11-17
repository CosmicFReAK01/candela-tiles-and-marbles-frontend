"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCandelaStore } from "@/context/CandelaStoreContext";
import { ArrowRight, Search, X, Sparkles, Box, ArrowUpRight } from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  "Calacatta Viola",
  "Travertino Navona",
  "Nero Marquina",
  "Wood Look Tile",
  "Hexagon",
  "Sintered Stone",
  "Kitchen Countertop",
  "Bathroom Sanctuary",
];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { products } = useCandelaStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.trim().toLowerCase();
  const results = cleanQuery
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(cleanQuery) ||
          p.sku.toLowerCase().includes(cleanQuery) ||
          p.category.toLowerCase().includes(cleanQuery) ||
          (p.style && p.style.toLowerCase().includes(cleanQuery)) ||
          (p.colour && p.colour.toLowerCase().includes(cleanQuery)) ||
          (p.brand && p.brand.toLowerCase().includes(cleanQuery)) ||
          p.applications.some((app) => app.toLowerCase().includes(cleanQuery))
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-md pt-16 sm:pt-24 px-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-candela-bg border border-candela-border shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-candela-border px-5 py-4 bg-candela-surface">
          <Search className="h-5 w-5 text-candela-accent shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by marble name, SKU, style, colour, material or space..."
            className="w-full bg-transparent text-sm sm:text-base font-normal text-candela-text placeholder:text-candela-secondary focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 text-candela-secondary hover:text-candela-text"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 border border-candela-border text-xs font-mono uppercase text-candela-secondary hover:text-candela-text hover:border-candela-accent"
          >
            ESC
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Default State: Popular Suggestions */}
          {!query && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-candela-secondary">
                <Sparkles className="h-3.5 w-3.5 text-candela-accent" />
                <span>Popular Architectural Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="border border-candela-border bg-candela-surface px-3 py-1.5 text-xs text-candela-text hover:border-candela-accent hover:text-candela-accent transition cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-candela-border">
                <span className="text-xs font-mono uppercase tracking-wider text-candela-secondary block mb-3">
                  Quick Category Jump
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <Link
                    href="/products?space=Living+Room"
                    onClick={onClose}
                    className="border border-candela-border p-2.5 bg-candela-surface hover:border-candela-accent transition text-center"
                  >
                    Living Room Slabs
                  </Link>
                  <Link
                    href="/products?space=Countertop"
                    onClick={onClose}
                    className="border border-candela-border p-2.5 bg-candela-surface hover:border-candela-accent transition text-center"
                  >
                    Kitchen Countertops
                  </Link>
                  <Link
                    href="/products?space=Bathroom+Sanctuary"
                    onClick={onClose}
                    className="border border-candela-border p-2.5 bg-candela-surface hover:border-candela-accent transition text-center"
                  >
                    Bathroom Sanctuaries
                  </Link>
                  <Link
                    href="/products?category=Italian+Marble"
                    onClick={onClose}
                    className="border border-candela-border p-2.5 bg-candela-surface hover:border-candela-accent transition text-center"
                  >
                    Italian Marbles
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Search Results */}
          {query && results.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-candela-secondary pb-2 border-b border-candela-border">
                <span>FOUND {results.length} MATCHING SURFACES</span>
                <Link
                  href={`/products?q=${encodeURIComponent(query)}`}
                  onClick={onClose}
                  className="text-candela-accent hover:underline flex items-center gap-1"
                >
                  View in Catalog <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="divide-y divide-candela-border">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 py-3 hover:bg-candela-surface/80 px-2 transition group"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden border border-candela-border bg-candela-dark/10">
                      <img
                        src={product.media.primaryImage}
                        alt={product.name}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-candela-secondary uppercase">
                          {product.sku}
                        </span>
                        <span className="border border-candela-border px-1.5 py-0.2 text-[9px] text-candela-secondary">
                          {product.category}
                        </span>
                      </div>
                      <h4 className="font-heading text-base font-semibold text-candela-text group-hover:text-candela-accent transition truncate">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-candela-secondary truncate">
                        {product.origin} • {product.dimensionsMm} • {product.finish}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono text-xs font-bold text-candela-accent">
                        ₹{(product.pricePerSqftInr || 1450).toLocaleString("en-IN")}{" "}
                        <span className="text-[10px] font-normal text-candela-secondary">
                          / sq.ft
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-candela-secondary flex items-center gap-1 justify-end group-hover:text-candela-accent">
                        Inspect <ArrowUpRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {query && results.length === 0 && (
            <div className="py-12 text-center space-y-3">
              <Box className="h-8 w-8 text-candela-secondary mx-auto opacity-60" />
              <h3 className="font-heading text-xl text-candela-text">
                No matching surfaces found for &ldquo;{query}&rdquo;
              </h3>
              <p className="text-xs text-candela-secondary max-w-sm mx-auto">
                Try searching for broader terms like &ldquo;Marble&rdquo;, &ldquo;Sintered&rdquo;, &ldquo;Travertine&rdquo;, or browse our full collection library.
              </p>
              <Link
                href="/products"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 bg-candela-accent px-4 py-2 text-xs font-mono uppercase text-white hover:bg-candela-dark transition"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
