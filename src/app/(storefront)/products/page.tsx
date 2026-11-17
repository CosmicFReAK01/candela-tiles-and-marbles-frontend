"use client";

import React, { Suspense, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useCandelaStore } from "@/context/CandelaStoreContext";
import { MaterialCategory, PublicProduct, SurfaceFinish } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  Filter,
  Grid3X3,
  LayoutGrid,
  List,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";

const SPACES = [
  "All",
  "Living Room",
  "Feature Wall",
  "Countertop",
  "Bathroom Sanctuary",
  "Facade",
  "Commercial Space",
];

const CATEGORIES: ("All" | MaterialCategory)[] = [
  "All",
  "Italian Marble",
  "Sintered Stone",
  "Porcelain Slab",
  "Onyx & Quartzite",
  "Travertine",
  "Ceramic",
];

const STYLES = [
  "All",
  "Marble Look Tile",
  "Wood Look Tile",
  "Travertine Look Tile",
  "Terrazzo Look",
  "Subway Tile",
  "Mosaic Tile",
  "Concrete Look Tile",
];

const SHAPES = [
  "All",
  "Large Format Slab",
  "Rectangle",
  "Square",
  "Hexagon",
  "Chevron",
];

const FINISHES: ("All" | SurfaceFinish)[] = [
  "All",
  "Bookmatched Polished",
  "Silk Honed",
  "Natural Matte",
  "Leathered",
  "Fluted Architectural",
];

const COLOURS = [
  { name: "All", hex: "transparent" },
  { name: "Bianco", hex: "#F8F8FF" },
  { name: "Black", hex: "#1A1A1A" },
  { name: "Beige", hex: "#F5F5DC" },
  { name: "Gold", hex: "#D4AF37" },
  { name: "Grey", hex: "#707070" },
  { name: "Green", hex: "#2E5834" },
];

const BRANDS = [
  "All",
  "Kajaria Ceramics",
  "Somany Ceramics",
  "Nitco Tiles",
  "Hindware Italian Collection",
  "Simpolo Ceramics",
  "Johnson Tiles",
];

const PRICE_TIERS = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under ₹1,000 / sq.ft", min: 0, max: 1000 },
  { label: "₹1,000 – ₹1,800 / sq.ft", min: 1000, max: 1800 },
  { label: "Above ₹1,800 / sq.ft", min: 1800, max: Infinity },
];

type SortOption = "featured" | "price-asc" | "price-desc" | "name" | "thickness";
type ViewMode = "grid-3" | "grid-4" | "list";

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { products } = useCandelaStore();

  // Read URL params
  const initialSearch = searchParams.get("search") || searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "All";
  const initialStyle = searchParams.get("style") || "All";
  const initialSpace = searchParams.get("space") || "All";
  const initialShape = searchParams.get("shape") || "All";
  const initialColour = searchParams.get("colour") || "All";
  const initialFinish = searchParams.get("finish") || "All";
  const initialBrand = searchParams.get("brand") || "All";

  // State
  const [search, setSearch] = useState<string>(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedStyle, setSelectedStyle] = useState<string>(initialStyle);
  const [selectedSpace, setSelectedSpace] = useState<string>(initialSpace);
  const [selectedShape, setSelectedShape] = useState<string>(initialShape);
  const [selectedColour, setSelectedColour] = useState<string>(initialColour);
  const [selectedFinish, setSelectedFinish] = useState<string>(initialFinish);
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand);
  const [selectedPriceTier, setSelectedPriceTier] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [viewMode, setViewMode] = useState<ViewMode>("grid-3");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state if URL query params change
  useEffect(() => {
    const q = searchParams.get("search") || searchParams.get("q") || "";
    const cat = searchParams.get("category") || "All";
    const st = searchParams.get("style") || "All";
    const sp = searchParams.get("space") || "All";
    const sh = searchParams.get("shape") || "All";
    const col = searchParams.get("colour") || "All";
    const fin = searchParams.get("finish") || "All";
    const br = searchParams.get("brand") || "All";

    setSearch(q);
    setSelectedCategory(cat);
    setSelectedStyle(st);
    setSelectedSpace(sp);
    setSelectedShape(sh);
    setSelectedColour(col);
    setSelectedFinish(fin);
    setSelectedBrand(br);
  }, [searchParams]);

  // Compute active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (search) count++;
    if (selectedCategory !== "All") count++;
    if (selectedStyle !== "All") count++;
    if (selectedSpace !== "All") count++;
    if (selectedShape !== "All") count++;
    if (selectedColour !== "All") count++;
    if (selectedFinish !== "All") count++;
    if (selectedBrand !== "All") count++;
    if (selectedPriceTier !== 0) count++;
    if (inStockOnly) count++;
    return count;
  }, [
    search,
    selectedCategory,
    selectedStyle,
    selectedSpace,
    selectedShape,
    selectedColour,
    selectedFinish,
    selectedBrand,
    selectedPriceTier,
    inStockOnly,
  ]);

  const resetAllFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSelectedStyle("All");
    setSelectedSpace("All");
    setSelectedShape("All");
    setSelectedColour("All");
    setSelectedFinish("All");
    setSelectedBrand("All");
    setSelectedPriceTier(0);
    setInStockOnly(false);
  };

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search query
        if (search) {
          const q = search.toLowerCase();
          const match =
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            (p.style && p.style.toLowerCase().includes(q)) ||
            (p.colour && p.colour.toLowerCase().includes(q)) ||
            p.applications.some((app) => app.toLowerCase().includes(q));
          if (!match) return false;
        }

        // Category / Material
        if (selectedCategory !== "All" && p.category !== selectedCategory) {
          return false;
        }

        // Style
        if (selectedStyle !== "All" && p.style && !p.style.toLowerCase().includes(selectedStyle.toLowerCase())) {
          return false;
        }

        // Space / Application
        if (selectedSpace !== "All") {
          const hasSpace = p.applications.some((app) =>
            app.toLowerCase().includes(selectedSpace.toLowerCase())
          );
          if (!hasSpace) return false;
        }

        // Shape / Format
        if (selectedShape !== "All" && p.shape && !p.shape.toLowerCase().includes(selectedShape.toLowerCase())) {
          return false;
        }

        // Colour
        if (selectedColour !== "All" && p.colour && !p.colour.toLowerCase().includes(selectedColour.toLowerCase())) {
          return false;
        }

        // Finish
        if (selectedFinish !== "All" && p.finish !== selectedFinish) {
          return false;
        }

        // Brand
        if (selectedBrand !== "All" && p.brand && !p.brand.toLowerCase().includes(selectedBrand.toLowerCase())) {
          return false;
        }

        // Price Tier
        const price = p.pricePerSqftInr || 1450;
        const tier = PRICE_TIERS[selectedPriceTier];
        if (price < tier.min || price > tier.max) {
          return false;
        }

        // In Stock
        if (inStockOnly && (p.stockSqftAvailable || 0) <= 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.pricePerSqftInr || 1450;
        const priceB = b.pricePerSqftInr || 1450;
        if (sortBy === "price-asc") return priceA - priceB;
        if (sortBy === "price-desc") return priceB - priceA;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "thickness") return b.thicknessMm - a.thicknessMm;
        return 0; // featured default
      });
  }, [
    products,
    search,
    selectedCategory,
    selectedStyle,
    selectedSpace,
    selectedShape,
    selectedColour,
    selectedFinish,
    selectedBrand,
    selectedPriceTier,
    inStockOnly,
    sortBy,
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-8">
      {/* Catalog Top Title & Search Bar */}
      <div className="border-b border-candela-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-candela-accent">
            <Sparkles className="h-3.5 w-3.5" />
            <span>ARCHITECTURAL SLABS & TILES CATALOG</span>
          </div>
          <h1 className="mt-1 font-heading text-3xl sm:text-5xl text-candela-text">
            Curated Surfaces & Formats
          </h1>
          <p className="text-xs text-candela-secondary mt-1 max-w-xl leading-relaxed">
            Filter our imported Italian marble slabs, sintered stone, and vitrified tiles across space, style, shape, finish, brand, and actual price.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-candela-secondary" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search SKU, marble, style, room..."
            className="w-full border border-candela-border bg-candela-surface pl-10 pr-4 py-2.5 text-xs text-candela-text focus:border-candela-accent focus:outline-none shadow-sm"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-2.5 text-candela-secondary hover:text-candela-text"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Layout: Left Filter Sidebar + Right Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ============================================================== */}
        {/* LEFT FILTER SIDEBAR (Desktop)                                  */}
        {/* ============================================================== */}
        <aside className="hidden lg:block lg:col-span-3 border border-candela-border bg-candela-surface p-5 space-y-6 sticky top-24 max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-candela-border pb-3">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider font-semibold text-candela-text">
              <SlidersHorizontal className="h-3.5 w-3.5 text-candela-accent" />
              <span>Faceted Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-candela-accent text-white px-1.5 py-0.2 rounded-full text-[10px]">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-[11px] font-mono text-red-600 hover:underline cursor-pointer"
              >
                Reset All
              </button>
            )}
          </div>

          {/* 1. Explore by Space / Room (Hindware pattern) */}
          <div className="space-y-2">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-candela-accent font-semibold">
              Explore by Space / Application
            </label>
            <div className="space-y-1">
              {SPACES.map((space) => (
                <button
                  key={space}
                  type="button"
                  onClick={() => setSelectedSpace(space)}
                  className={`w-full text-left px-2.5 py-1.5 text-xs transition flex items-center justify-between cursor-pointer ${
                    selectedSpace === space
                      ? "bg-candela-accent text-white font-medium"
                      : "text-candela-secondary hover:bg-candela-bg hover:text-candela-text"
                  }`}
                >
                  <span>{space}</span>
                  {selectedSpace === space && <Check className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Material Category */}
          <div className="space-y-2 border-t border-candela-border/60 pt-4">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-candela-accent font-semibold">
              Material Composition
            </label>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-2.5 py-1.5 text-xs transition flex items-center justify-between cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-candela-accent text-white font-medium"
                      : "text-candela-secondary hover:bg-candela-bg hover:text-candela-text"
                  }`}
                >
                  <span>{cat}</span>
                  {selectedCategory === cat && <Check className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Style Archetype */}
          <div className="space-y-2 border-t border-candela-border/60 pt-4">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-candela-accent font-semibold">
              Style Archetype
            </label>
            <div className="space-y-1">
              {STYLES.map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setSelectedStyle(style)}
                  className={`w-full text-left px-2.5 py-1.5 text-xs transition flex items-center justify-between cursor-pointer ${
                    selectedStyle === style
                      ? "bg-candela-accent text-white font-medium"
                      : "text-candela-secondary hover:bg-candela-bg hover:text-candela-text"
                  }`}
                >
                  <span>{style}</span>
                  {selectedStyle === style && <Check className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Format & Shape */}
          <div className="space-y-2 border-t border-candela-border/60 pt-4">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-candela-accent font-semibold">
              Format & Shape
            </label>
            <div className="space-y-1">
              {SHAPES.map((sh) => (
                <button
                  key={sh}
                  type="button"
                  onClick={() => setSelectedShape(sh)}
                  className={`w-full text-left px-2.5 py-1.5 text-xs transition flex items-center justify-between cursor-pointer ${
                    selectedShape === sh
                      ? "bg-candela-accent text-white font-medium"
                      : "text-candela-secondary hover:bg-candela-bg hover:text-candela-text"
                  }`}
                >
                  <span>{sh}</span>
                  {selectedShape === sh && <Check className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Surface Finish */}
          <div className="space-y-2 border-t border-candela-border/60 pt-4">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-candela-accent font-semibold">
              Surface Finish
            </label>
            <div className="space-y-1">
              {FINISHES.map((fin) => (
                <button
                  key={fin}
                  type="button"
                  onClick={() => setSelectedFinish(fin)}
                  className={`w-full text-left px-2.5 py-1.5 text-xs transition flex items-center justify-between cursor-pointer ${
                    selectedFinish === fin
                      ? "bg-candela-accent text-white font-medium"
                      : "text-candela-secondary hover:bg-candela-bg hover:text-candela-text"
                  }`}
                >
                  <span>{fin}</span>
                  {selectedFinish === fin && <Check className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* 6. Colour Swatches */}
          <div className="space-y-2 border-t border-candela-border/60 pt-4">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-candela-accent font-semibold">
              Mineral Colour
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COLOURS.map((col) => (
                <button
                  key={col.name}
                  type="button"
                  onClick={() => setSelectedColour(col.name)}
                  className={`px-2.5 py-1 text-xs border transition flex items-center gap-1.5 cursor-pointer ${
                    selectedColour === col.name
                      ? "border-candela-accent bg-candela-accent text-white font-semibold"
                      : "border-candela-border bg-candela-bg text-candela-secondary hover:border-candela-accent"
                  }`}
                >
                  {col.name !== "All" && (
                    <span
                      className="h-3 w-3 rounded-full border border-candela-border shrink-0"
                      style={{ background: col.hex }}
                    />
                  )}
                  <span>{col.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 7. Actual Price Range Filter */}
          <div className="space-y-2 border-t border-candela-border/60 pt-4">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-candela-accent font-semibold">
              Actual Price Tier (₹/Sq.Ft)
            </label>
            <div className="space-y-1">
              {PRICE_TIERS.map((tier, idx) => (
                <button
                  key={tier.label}
                  type="button"
                  onClick={() => setSelectedPriceTier(idx)}
                  className={`w-full text-left px-2.5 py-1.5 text-xs transition flex items-center justify-between cursor-pointer ${
                    selectedPriceTier === idx
                      ? "bg-candela-accent text-white font-medium"
                      : "text-candela-secondary hover:bg-candela-bg hover:text-candela-text"
                  }`}
                >
                  <span>{tier.label}</span>
                  {selectedPriceTier === idx && <Check className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* 8. Authorized Brands */}
          <div className="space-y-2 border-t border-candela-border/60 pt-4">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-candela-accent font-semibold">
              Brand Partner
            </label>
            <div className="space-y-1">
              {BRANDS.map((brand) => (
                <button
                  key={brand}
                  type="button"
                  onClick={() => setSelectedBrand(brand)}
                  className={`w-full text-left px-2.5 py-1.5 text-xs transition flex items-center justify-between cursor-pointer ${
                    selectedBrand === brand
                      ? "bg-candela-accent text-white font-medium"
                      : "text-candela-secondary hover:bg-candela-bg hover:text-candela-text"
                  }`}
                >
                  <span>{brand}</span>
                  {selectedBrand === brand && <Check className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* In-Stock Toggle */}
          <div className="border-t border-candela-border/60 pt-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-candela-text">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="h-4 w-4 accent-candela-accent"
              />
              <span>In-Stock Showroom Lots Only</span>
            </label>
          </div>
        </aside>

        {/* ============================================================== */}
        {/* RIGHT CATALOG DISPLAY AREA                                     */}
        {/* ============================================================== */}
        <section className="lg:col-span-9 space-y-6">
          {/* Controls Bar: Mobile filter button, Active filter tags, Sort, View mode */}
          <div className="border border-candela-border bg-candela-surface p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Mobile filter button & Match count */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                  className="lg:hidden inline-flex items-center gap-1.5 border border-candela-accent bg-candela-accent px-3 py-1.5 text-xs font-mono uppercase text-white"
                >
                  <Filter className="h-3.5 w-3.5" />
                  <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ""}</span>
                </button>

                <span className="font-mono text-xs text-candela-secondary">
                  Showing <strong className="text-candela-text">{filteredProducts.length}</strong> of{" "}
                  {products.length} architectural surfaces
                </span>
              </div>

              {/* Sort By & View Mode */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs font-mono">
                  <span className="text-candela-secondary hidden sm:inline">SORT BY:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="border border-candela-border bg-candela-bg px-2.5 py-1.5 text-xs text-candela-text focus:border-candela-accent focus:outline-none"
                  >
                    <option value="featured">Featured Slabs</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name">Name (A-Z)</option>
                    <option value="thickness">Thickness (20mm First)</option>
                  </select>
                </div>

                {/* View Switcher */}
                <div className="hidden sm:flex items-center border border-candela-border bg-candela-bg">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid-3")}
                    className={`p-1.5 transition ${
                      viewMode === "grid-3"
                        ? "bg-candela-accent text-white"
                        : "text-candela-secondary hover:text-candela-text"
                    }`}
                    title="3 Columns Grid"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("grid-4")}
                    className={`p-1.5 transition ${
                      viewMode === "grid-4"
                        ? "bg-candela-accent text-white"
                        : "text-candela-secondary hover:text-candela-text"
                    }`}
                    title="4 Columns Compact"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 transition ${
                      viewMode === "list"
                        ? "bg-candela-accent text-white"
                        : "text-candela-secondary hover:text-candela-text"
                    }`}
                    title="Detailed Specification List"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filter Chips Bar */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-candela-border/60">
                <span className="text-[10px] font-mono uppercase text-candela-secondary">
                  Active Filters:
                </span>

                {search && (
                  <span className="inline-flex items-center gap-1 bg-candela-bg border border-candela-border px-2 py-0.5 text-xs font-mono text-candela-text">
                    &ldquo;{search}&rdquo;
                    <button type="button" onClick={() => setSearch("")} className="hover:text-red-700">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {selectedCategory !== "All" && (
                  <span className="inline-flex items-center gap-1 bg-candela-bg border border-candela-border px-2 py-0.5 text-xs font-mono text-candela-text">
                    Material: {selectedCategory}
                    <button type="button" onClick={() => setSelectedCategory("All")} className="hover:text-red-700">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {selectedSpace !== "All" && (
                  <span className="inline-flex items-center gap-1 bg-candela-bg border border-candela-border px-2 py-0.5 text-xs font-mono text-candela-text">
                    Space: {selectedSpace}
                    <button type="button" onClick={() => setSelectedSpace("All")} className="hover:text-red-700">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {selectedStyle !== "All" && (
                  <span className="inline-flex items-center gap-1 bg-candela-bg border border-candela-border px-2 py-0.5 text-xs font-mono text-candela-text">
                    Style: {selectedStyle}
                    <button type="button" onClick={() => setSelectedStyle("All")} className="hover:text-red-700">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {selectedShape !== "All" && (
                  <span className="inline-flex items-center gap-1 bg-candela-bg border border-candela-border px-2 py-0.5 text-xs font-mono text-candela-text">
                    Shape: {selectedShape}
                    <button type="button" onClick={() => setSelectedShape("All")} className="hover:text-red-700">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {selectedFinish !== "All" && (
                  <span className="inline-flex items-center gap-1 bg-candela-bg border border-candela-border px-2 py-0.5 text-xs font-mono text-candela-text">
                    Finish: {selectedFinish}
                    <button type="button" onClick={() => setSelectedFinish("All")} className="hover:text-red-700">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {selectedColour !== "All" && (
                  <span className="inline-flex items-center gap-1 bg-candela-bg border border-candela-border px-2 py-0.5 text-xs font-mono text-candela-text">
                    Colour: {selectedColour}
                    <button type="button" onClick={() => setSelectedColour("All")} className="hover:text-red-700">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {selectedBrand !== "All" && (
                  <span className="inline-flex items-center gap-1 bg-candela-bg border border-candela-border px-2 py-0.5 text-xs font-mono text-candela-text">
                    Brand: {selectedBrand}
                    <button type="button" onClick={() => setSelectedBrand("All")} className="hover:text-red-700">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {selectedPriceTier !== 0 && (
                  <span className="inline-flex items-center gap-1 bg-candela-bg border border-candela-border px-2 py-0.5 text-xs font-mono text-candela-text">
                    Price: {PRICE_TIERS[selectedPriceTier].label}
                    <button type="button" onClick={() => setSelectedPriceTier(0)} className="hover:text-red-700">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {inStockOnly && (
                  <span className="inline-flex items-center gap-1 bg-candela-bg border border-candela-border px-2 py-0.5 text-xs font-mono text-candela-text">
                    In-Stock Only
                    <button type="button" onClick={() => setInStockOnly(false)} className="hover:text-red-700">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-xs text-candela-accent hover:underline ml-auto font-mono"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Mobile Filter Drawer Overlay */}
          {mobileFilterOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/70 flex justify-end">
              <div className="w-full max-w-xs bg-candela-bg border-l border-candela-border h-full p-5 overflow-y-auto space-y-6">
                <div className="flex items-center justify-between border-b border-candela-border pb-3">
                  <div className="font-mono text-xs uppercase font-semibold text-candela-text flex items-center gap-2">
                    <Filter className="h-4 w-4 text-candela-accent" />
                    <span>Filter Surfaces</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 text-candela-secondary hover:text-candela-text"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Mobile Facet Accordions */}
                <div className="space-y-4 text-xs font-mono">
                  {/* Space */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-candela-accent uppercase">Space / Room</span>
                    <select
                      value={selectedSpace}
                      onChange={(e) => setSelectedSpace(e.target.value)}
                      className="w-full border border-candela-border bg-candela-surface p-2"
                    >
                      {SPACES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Material */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-candela-accent uppercase">Material</span>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full border border-candela-border bg-candela-surface p-2"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Style */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-candela-accent uppercase">Style</span>
                    <select
                      value={selectedStyle}
                      onChange={(e) => setSelectedStyle(e.target.value)}
                      className="w-full border border-candela-border bg-candela-surface p-2"
                    >
                      {STYLES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-candela-accent uppercase">Price Tier</span>
                    <select
                      value={selectedPriceTier}
                      onChange={(e) => setSelectedPriceTier(Number(e.target.value))}
                      className="w-full border border-candela-border bg-candela-surface p-2"
                    >
                      {PRICE_TIERS.map((pt, idx) => (
                        <option key={pt.label} value={idx}>{pt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* In Stock */}
                  <label className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="h-4 w-4 accent-candela-accent"
                    />
                    <span>In-Stock Lots Only</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-candela-border space-y-2">
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    className="w-full bg-candela-accent py-2.5 text-xs font-mono uppercase text-white font-semibold"
                  >
                    Apply Filters ({filteredProducts.length} Lots)
                  </button>
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="w-full border border-candela-border py-2 text-xs font-mono uppercase text-candela-secondary"
                  >
                    Reset All
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Product Grid / List Results */}
          {filteredProducts.length === 0 ? (
            <div className="border border-dashed border-candela-border p-12 text-center space-y-3 bg-candela-surface">
              <h3 className="font-heading text-2xl text-candela-text">
                No surfaces match your selected filters
              </h3>
              <p className="text-xs text-candela-secondary max-w-md mx-auto">
                Try widening your space or price filter, or reset your search parameters to view all quarry lots.
              </p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1.5 bg-candela-accent px-4 py-2 text-xs font-mono uppercase text-white hover:bg-candela-dark transition cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : viewMode === "list" ? (
            /* List View */
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="border border-candela-border bg-candela-surface p-4 flex flex-col sm:flex-row gap-5 hover:border-candela-accent transition group"
                >
                  <div className="relative h-44 sm:h-36 sm:w-48 shrink-0 overflow-hidden border border-candela-border bg-candela-dark/10">
                    <img
                      src={product.media.primaryImage}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <span className="absolute bottom-2 left-2 bg-candela-dark/80 text-candela-bg px-2 py-0.5 font-mono text-[10px]">
                      {product.dimensionsMm}
                    </span>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-candela-secondary uppercase">
                        {product.sku} • {product.origin}
                      </span>
                      <span className="bg-candela-bg border border-candela-border px-2 py-0.5 font-mono text-[10px] text-candela-accent">
                        {product.category}
                      </span>
                    </div>

                    <Link href={`/products/${product.slug}`}>
                      <h3 className="font-heading text-2xl font-semibold text-candela-text group-hover:text-candela-accent transition">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-xs text-candela-secondary line-clamp-2">
                      {product.shortDescription}
                    </p>

                    <div className="flex flex-wrap gap-2 text-[11px] font-mono text-candela-secondary pt-1">
                      <span>Finish: <strong className="text-candela-text">{product.finish}</strong></span>
                      <span>•</span>
                      <span>Thickness: <strong className="text-candela-text">{product.thicknessMm}mm</strong></span>
                      <span>•</span>
                      <span>Stock: <strong className="text-candela-text">{(product.stockSqftAvailable || 0).toLocaleString("en-IN")} sq.ft</strong></span>
                    </div>
                  </div>

                  <div className="border-t sm:border-t-0 sm:border-l border-candela-border pt-3 sm:pt-0 sm:pl-5 flex sm:flex-col justify-between items-end shrink-0 sm:w-44">
                    <div className="text-right">
                      <div className="text-[10px] font-mono uppercase text-candela-secondary">Showroom Price</div>
                      <div className="font-mono text-lg font-bold text-candela-accent">
                        ₹{(product.pricePerSqftInr || 1450).toLocaleString("en-IN")}{" "}
                        <span className="text-xs font-normal text-candela-secondary">/ sq.ft</span>
                      </div>
                    </div>

                    <Link
                      href={`/products/${product.slug}`}
                      className="bg-candela-accent text-white px-4 py-2 text-xs font-mono uppercase tracking-wider hover:bg-candela-dark transition text-center w-full"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Grid View (3 or 4 columns) */
            <div
              className={`grid grid-cols-1 gap-6 sm:grid-cols-2 ${
                viewMode === "grid-4" ? "lg:grid-cols-4" : "lg:grid-cols-3"
              }`}
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center font-mono text-xs text-candela-secondary">
          Loading Architectural Catalog...
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
