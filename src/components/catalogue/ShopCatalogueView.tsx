"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useCandelaStore } from "@/context/CandelaStoreContext";
import { PublicProduct, MasterCategory } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";
import {
  MASTER_SHOP_CATEGORIES,
  CATEGORY_FILTERS_CONFIG,
} from "@/lib/catalogue-taxonomy";
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
  X,
  ArrowRight,
} from "lucide-react";

interface ShopCatalogueViewProps {
  categorySlug?: string;
  subcategorySlug?: string;
  titleOverride?: string;
  descriptionOverride?: string;
}

function CatalogueContent({
  categorySlug,
  subcategorySlug,
  titleOverride,
  descriptionOverride,
}: ShopCatalogueViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products } = useCandelaStore();

  // Find active category config if present
  const currentCategory = useMemo(() => {
    if (!categorySlug) return null;
    return (
      MASTER_SHOP_CATEGORIES.find(
        (c) => c.slug.toLowerCase() === categorySlug.toLowerCase()
      ) || null
    );
  }, [categorySlug]);

  // Find active subcategory if present
  const currentSubcategory = useMemo(() => {
    if (!currentCategory || !subcategorySlug) return null;
    return (
      currentCategory.subcategories.find(
        (s) => s.slug.toLowerCase() === subcategorySlug.toLowerCase()
      ) || null
    );
  }, [currentCategory, subcategorySlug]);

  // Dynamic filter definitions based on category
  const activeFilterDefinitions = useMemo(() => {
    const key = categorySlug ? categorySlug.toLowerCase() : "tiles";
    return CATEGORY_FILTERS_CONFIG[key] || CATEGORY_FILTERS_CONFIG["tiles"];
  }, [categorySlug]);

  // View mode
  const [viewMode, setViewMode] = useState<"grid4" | "grid3" | "list">("grid3");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "recommended" | "price-asc" | "price-desc" | "name"
  >("recommended");

  // Selected filters: map of filter key -> array of selected values
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  // Sync state from URL parameters on mount
  useEffect(() => {
    const filtersFromUrl: Record<string, string[]> = {};
    searchParams.forEach((value, key) => {
      if (key !== "sort" && key !== "q") {
        filtersFromUrl[key] = value.split(",").map((v) => v.trim());
      }
    });

    // If subcategory is in route param, enforce it in filters
    if (currentSubcategory) {
      filtersFromUrl["subcategory"] = [currentSubcategory.name];
    }

    setSelectedFilters(filtersFromUrl);

    if (searchParams.get("sort")) {
      setSortBy(searchParams.get("sort") as any);
    }
    if (searchParams.get("q")) {
      setSearchQuery(searchParams.get("q") || "");
    }
  }, [searchParams, currentSubcategory]);

  // Toggle filter value
  const handleToggleFilter = (filterKey: string, value: string) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[filterKey] || [];
      const exists = currentValues.includes(value);
      const newValues = exists
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      const updated = { ...prev };
      if (newValues.length === 0) {
        delete updated[filterKey];
      } else {
        updated[filterKey] = newValues;
      }
      return updated;
    });
  };

  const handleClearAllFilters = () => {
    if (currentSubcategory) {
      setSelectedFilters({ subcategory: [currentSubcategory.name] });
    } else {
      setSelectedFilters({});
    }
    setSearchQuery("");
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Exclude items without an updated image
      if (!p.media?.primaryImage || p.media.primaryImage.trim() === "") return false;

      // 1. Category match if route is scoped
      if (currentCategory) {
        const catSlug = currentCategory.slug.toLowerCase();
        const catName = currentCategory.name.toLowerCase();
        const matchesCat =
          p.masterCategory?.toLowerCase() === catName ||
          p.category.toLowerCase().includes(catName) ||
          (p.categories && p.categories.some((c) => c.toLowerCase() === catName)) ||
          // Support generic classification aliases for primary divisions
          (catSlug === "tiles" &&
            (p.masterCategory?.toLowerCase() === "tiles" ||
              p.category.toLowerCase().includes("tile") ||
              p.category.toLowerCase().includes("porcelain") ||
              p.category.toLowerCase().includes("ceramic") ||
              p.category.toLowerCase().includes("vitrified"))) ||
          (catSlug === "marbles" &&
            (p.masterCategory?.toLowerCase() === "marbles" ||
              p.category.toLowerCase().includes("marble") ||
              p.category.toLowerCase().includes("travertine") ||
              p.category.toLowerCase().includes("onyx")));
        if (!matchesCat) return false;
      }

      // Helper for intelligent subcategory and category matching
      const matchesSubcategoryItem = (v: string): boolean => {
        const normVal = v.toLowerCase().trim();
        const sub = (p.subcategory || "").toLowerCase();
        const cat = (p.category || "").toLowerCase();
        const name = (p.name || "").toLowerCase();
        const desc = (p.shortDescription || "").toLowerCase();
        const style = (p.style || "").toLowerCase();
        const finish = (p.finish || "").toLowerCase();
        const shape = (p.shape || "").toLowerCase();
        const collection = (p.collectionName || "").toLowerCase();
        const apps = (p.applications || []).map((a) => a.toLowerCase());
        const rooms = (p.rooms || []).map((r) => r.toLowerCase());
        const multiSubs = (p.subcategories || []).map((s) => s.toLowerCase());
        const multiCats = (p.categories || []).map((c) => c.toLowerCase());
        const slip = (p.specs?.slipResistance || "").toLowerCase();
        const dims = (p.dimensionsMm || "").toLowerCase();

        // Direct/exact or comma-separated list match
        if (
          sub === normVal ||
          sub.includes(normVal) ||
          multiSubs.includes(normVal) ||
          multiCats.includes(normVal) ||
          multiSubs.some((s) => s.includes(normVal) || normVal.includes(s))
        ) {
          return true;
        }

        // 1. Floor Tiles
        if (normVal === "floor tiles" || normVal === "floor" || normVal === "flore tiles") {
          return (
            sub.includes("floor") ||
            sub.includes("flore") ||
            apps.some((a) => a.includes("floor") || a.includes("lobby") || a.includes("living")) ||
            rooms.some(
              (r) =>
                r.includes("living") ||
                r.includes("bedroom") ||
                r.includes("commercial") ||
                r.includes("hall")
            ) ||
            name.includes("floor") ||
            desc.includes("floor") ||
            cat.includes("porcelain") ||
            cat.includes("vitrified")
          );
        }

        // 2. Wall Tiles
        if (normVal === "wall tiles" || normVal === "wall") {
          return (
            sub.includes("wall") ||
            apps.some(
              (a) =>
                a.includes("wall") ||
                a.includes("cladding") ||
                a.includes("splashback") ||
                a.includes("facade") ||
                a.includes("niche")
            ) ||
            rooms.some((r) => r.includes("bathroom") || r.includes("kitchen")) ||
            name.includes("wall") ||
            name.includes("mosaic") ||
            name.includes("fluted") ||
            desc.includes("wall") ||
            desc.includes("cladding") ||
            cat.includes("ceramic")
          );
        }

        // 3. Bathroom Tiles
        if (normVal === "bathroom tiles" || normVal === "bathroom") {
          return (
            sub.includes("bath") ||
            rooms.some((r) => r.includes("bath") || r.includes("powder")) ||
            apps.some(
              (a) =>
                a.includes("bath") ||
                a.includes("wet") ||
                a.includes("shower") ||
                a.includes("sanctuary") ||
                a.includes("vanity")
            ) ||
            name.includes("bath") ||
            desc.includes("bath") ||
            desc.includes("shower")
          );
        }

        // 4. Kitchen Tiles
        if (normVal === "kitchen tiles" || normVal === "kitchen") {
          return (
            sub.includes("kitchen") ||
            rooms.some((r) => r.includes("kitchen") || r.includes("dining")) ||
            apps.some(
              (a) =>
                a.includes("kitchen") ||
                a.includes("countertop") ||
                a.includes("splashback") ||
                a.includes("island") ||
                a.includes("culinary")
            ) ||
            name.includes("kitchen") ||
            desc.includes("kitchen") ||
            desc.includes("culinary")
          );
        }

        // 5. Outdoor Tiles
        if (normVal === "outdoor tiles" || normVal === "outdoor") {
          return (
            sub.includes("outdoor") ||
            sub.includes("exterior") ||
            sub.includes("paver") ||
            rooms.some(
              (r) =>
                r.includes("outdoor") ||
                r.includes("balcony") ||
                r.includes("terrace") ||
                r.includes("patio")
            ) ||
            apps.some(
              (a) =>
                a.includes("outdoor") ||
                a.includes("facade") ||
                a.includes("exterior") ||
                a.includes("paver") ||
                a.includes("patio") ||
                a.includes("balcony") ||
                a.includes("landscape")
            ) ||
            name.includes("outdoor") ||
            name.includes("paver") ||
            name.includes("exterior") ||
            desc.includes("outdoor") ||
            desc.includes("exterior") ||
            desc.includes("paver") ||
            (typeof p.thicknessMm === "number" && p.thicknessMm >= 18)
          );
        }

        // 6. Large Format Tiles
        if (normVal === "large format tiles" || normVal === "large format") {
          const hasLargeDim = /\b(1200|1600|2000|2400|2800|3000|3200)\b/.test(dims);
          return (
            hasLargeDim ||
            sub.includes("large format") ||
            sub.includes("slab") ||
            shape.includes("large slab") ||
            shape.includes("slab") ||
            cat.includes("slab") ||
            name.includes("slab") ||
            name.includes("grande") ||
            desc.includes("large format") ||
            desc.includes("monolithic") ||
            desc.includes("slab")
          );
        }

        // 7. Designer Tiles
        if (normVal === "designer tiles" || normVal === "designer") {
          return (
            sub.includes("designer") ||
            sub.includes("mosaic") ||
            sub.includes("moroccan") ||
            sub.includes("azulejo") ||
            sub.includes("fluted") ||
            sub.includes("accent") ||
            sub.includes("hand-painted") ||
            style.includes("luxury") ||
            style.includes("designer") ||
            style.includes("artisanal") ||
            collection.includes("designer") ||
            collection.includes("luxury") ||
            shape.includes("hexagon") ||
            shape.includes("mosaic") ||
            shape.includes("chevron") ||
            name.includes("mosaic") ||
            name.includes("hexagon") ||
            name.includes("azulejo") ||
            name.includes("floral") ||
            name.includes("fluted") ||
            desc.includes("mosaic") ||
            desc.includes("artisanal") ||
            desc.includes("designer")
          );
        }

        // 8. Anti-Skid Tiles
        if (
          normVal === "anti-skid tiles" ||
          normVal === "anti-skid" ||
          normVal === "anti-slip" ||
          normVal === "non-skid"
        ) {
          return (
            sub.includes("anti-skid") ||
            sub.includes("anti-slip") ||
            slip.includes("r10") ||
            slip.includes("r11") ||
            slip.includes("r12") ||
            slip.includes("r13") ||
            slip.includes("grip") ||
            slip.includes("anti-slip") ||
            slip.includes("anti-skid") ||
            finish.includes("matte") ||
            finish.includes("textured") ||
            finish.includes("rustic") ||
            finish.includes("grip") ||
            finish.includes("silk") ||
            name.includes("anti-skid") ||
            name.includes("anti-slip") ||
            desc.includes("anti-skid") ||
            desc.includes("anti-slip") ||
            desc.includes("grip")
          );
        }

        // General fallback for all other categories (e.g. Natural Marble, Toilets / WCs, etc.)
        const strippedKey = normVal
          .replace(/tiles|tile|marble|marbles|sanitaryware/g, "")
          .trim();
        if (strippedKey.length >= 3) {
          return (
            sub.includes(strippedKey) ||
            cat.includes(strippedKey) ||
            name.includes(strippedKey) ||
            apps.some((a) => a.includes(strippedKey)) ||
            rooms.some((r) => r.includes(strippedKey))
          );
        }

        return false;
      };

      // 2. Subcategory match if specified in route URL
      if (currentSubcategory) {
        if (!matchesSubcategoryItem(currentSubcategory.name)) {
          return false;
        }
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.shortDescription && p.shortDescription.toLowerCase().includes(q)) ||
          p.material?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.colour?.toLowerCase().includes(q) ||
          p.style?.toLowerCase().includes(q) ||
          (p.applications && p.applications.some((a) => a.toLowerCase().includes(q))) ||
          (p.rooms && p.rooms.some((r) => r.toLowerCase().includes(q)));
        if (!matchesSearch) return false;
      }

      // 4. Dynamic category-aware filters
      for (const [key, values] of Object.entries(selectedFilters)) {
        if (!values || values.length === 0) continue;

        if (key === "subcategory" || key === "category") {
          const match = values.some((v) => matchesSubcategoryItem(v));
          if (!match) return false;
        } else if (key === "material") {
          const match = values.some((v) => {
            const vLower = v.toLowerCase().trim();
            const pMat = (p.material || "").toLowerCase();
            const pCat = (p.category || "").toLowerCase();
            const pSub = (p.subcategory || "").toLowerCase();
            const pDesc = (p.shortDescription || "").toLowerCase();
            const pName = (p.name || "").toLowerCase();

            if (pMat.includes(vLower) || vLower.includes(pMat)) return true;
            if (pCat.includes(vLower) || vLower.includes(pCat)) return true;
            if (pSub.includes(vLower) || pDesc.includes(vLower) || pName.includes(vLower))
              return true;

            // Handle Vitrified / Porcelain / Sintered equivalencies
            if (
              vLower.includes("vitrified") &&
              (pMat.includes("porcelain") || pCat.includes("gvt") || p.sku.includes("GVT"))
            )
              return true;
            if (
              vLower.includes("sintered") &&
              (pMat.includes("sintered") || pCat.includes("sintered"))
            )
              return true;
            return false;
          });
          if (!match) return false;
        } else if (key === "colour") {
          const match = values.some((v) => {
            const vLower = v.toLowerCase().trim();
            if (p.colour?.toLowerCase().includes(vLower)) return true;
            if (p.colours && p.colours.some((c) => c.toLowerCase().includes(vLower)))
              return true;
            if (p.name.toLowerCase().includes(vLower)) return true;
            if (p.shortDescription && p.shortDescription.toLowerCase().includes(vLower))
              return true;
            return false;
          });
          if (!match) return false;
        } else if (key === "finish") {
          const match = values.some((v) => {
            const vLower = v.toLowerCase().trim();
            const pFinish = (p.finish || "").toLowerCase();
            if (pFinish.includes(vLower) || vLower.includes(pFinish)) return true;
            if (
              vLower === "matte" &&
              (pFinish.includes("matte") ||
                pFinish.includes("honed") ||
                pFinish.includes("silk") ||
                pFinish.includes("natural"))
            )
              return true;
            if (
              vLower === "polished" &&
              (pFinish.includes("polished") ||
                pFinish.includes("glossy") ||
                pFinish.includes("mirror"))
            )
              return true;
            if (
              vLower === "glossy" &&
              (pFinish.includes("glossy") || pFinish.includes("polished"))
            )
              return true;
            if (
              vLower === "silk honed" &&
              (pFinish.includes("silk") || pFinish.includes("honed"))
            )
              return true;
            if (
              vLower === "textured" &&
              (pFinish.includes("textured") ||
                pFinish.includes("rustic") ||
                pFinish.includes("grip") ||
                pFinish.includes("fluted"))
            )
              return true;
            return false;
          });
          if (!match) return false;
        } else if (key === "size") {
          const match = values.some((v) => {
            const cleanV = v.toLowerCase().replace(/[\s\-_]/g, "");
            const cleanDim = (p.dimensionsMm || "").toLowerCase().replace(/[\s\-_]/g, "");
            if (cleanDim.includes(cleanV) || cleanV.includes(cleanDim)) return true;

            const vNums = v.match(/\d+/g);
            const pNums = (p.dimensionsMm || "").match(/\d+/g);
            if (vNums && pNums && vNums.length >= 2 && pNums.length >= 2) {
              const [vW, vH] = vNums.map(Number);
              const pW = Number(pNums[0]);
              const pH = Number(pNums[1]);
              return (vW === pW && vH === pH) || (vW === pH && vH === pW);
            }
            return false;
          });
          if (!match) return false;
        } else if (key === "thickness") {
          const match = values.some((v) => {
            const vNum = parseInt(v.replace(/[^\d]/g, ""), 10);
            const pNum =
              typeof p.thicknessMm === "number"
                ? p.thicknessMm
                : parseInt(String(p.thicknessMm || "").replace(/[^\d]/g, ""), 10);
            if (!isNaN(vNum) && !isNaN(pNum) && vNum === pNum) return true;
            return (
              `${p.thicknessMm}mm`.toLowerCase().replace(/\s/g, "") ===
              v.toLowerCase().replace(/\s/g, "")
            );
          });
          if (!match) return false;
        } else if (key === "application") {
          const match = values.some((v) => {
            const vLower = v.toLowerCase().trim();
            if (
              p.applications &&
              p.applications.some(
                (app) => app.toLowerCase().includes(vLower) || vLower.includes(app.toLowerCase())
              )
            )
              return true;
            if (
              p.rooms &&
              p.rooms.some(
                (r) => r.toLowerCase().includes(vLower) || vLower.includes(r.toLowerCase())
              )
            )
              return true;
            if (
              vLower === "floor" &&
              p.applications?.some((a) => a.toLowerCase().includes("floor"))
            )
              return true;
            if (
              vLower === "wall" &&
              p.applications?.some(
                (a) => a.toLowerCase().includes("wall") || a.toLowerCase().includes("cladding")
              )
            )
              return true;
            return false;
          });
          if (!match) return false;
        } else if (key === "room") {
          const match = values.some((v) => {
            const vLower = v.toLowerCase().trim();
            if (
              p.rooms &&
              p.rooms.some(
                (r) => r.toLowerCase().includes(vLower) || vLower.includes(r.toLowerCase())
              )
            )
              return true;
            if (
              p.applications &&
              p.applications.some(
                (a) => a.toLowerCase().includes(vLower) || vLower.includes(a.toLowerCase())
              )
            )
              return true;
            return false;
          });
          if (!match) return false;
        } else if (key === "style") {
          const match = values.some((v) => {
            const vLower = v.toLowerCase().trim();
            return (
              (p.style || "").toLowerCase().includes(vLower) ||
              (p.collectionName || "").toLowerCase().includes(vLower)
            );
          });
          if (!match) return false;
        } else if (key === "brand") {
          const match = values.some((v) => {
            const vLower = v.toLowerCase().trim();
            const pBrand = (p.brand || "").toLowerCase();
            return (
              pBrand.includes(vLower) ||
              vLower.includes(pBrand) ||
              pBrand.split(/\s|\(/)[0] === vLower.split(/\s|\(/)[0]
            );
          });
          if (!match) return false;
        } else if (key === "mountType") {
          const match = values.some((v) =>
            (p.mountType || "").toLowerCase().includes(v.toLowerCase().trim())
          );
          if (!match) return false;
        } else if (key === "flushType") {
          const match = values.some((v) =>
            (p.flushType || "").toLowerCase().includes(v.toLowerCase().trim())
          );
          if (!match) return false;
        } else if (key === "waterFlow") {
          const match = values.some((v) =>
            (p.waterFlow || "").toLowerCase().includes(v.toLowerCase().trim())
          );
          if (!match) return false;
        } else if (key === "origin") {
          const match = values.some((v) =>
            (p.origin || "").toLowerCase().includes(v.toLowerCase().trim())
          );
          if (!match) return false;
        }
      }

      return true;
    });
  }, [products, currentCategory, currentSubcategory, searchQuery, selectedFilters]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === "price-asc") {
      return list.sort((a, b) => a.pricePerSqftInr - b.pricePerSqftInr);
    }
    if (sortBy === "price-desc") {
      return list.sort((a, b) => b.pricePerSqftInr - a.pricePerSqftInr);
    }
    if (sortBy === "name") {
      return list.sort((a, b) => a.name.localeCompare(b.name));
    }
    // recommended
    return list;
  }, [filteredProducts, sortBy]);

  // Total active filter tags count
  const activeFiltersCount = useMemo(() => {
    return Object.values(selectedFilters).reduce(
      (sum, values) => sum + values.length,
      0
    );
  }, [selectedFilters]);

  // Computed page title and description
  const pageTitle =
    titleOverride ||
    (currentSubcategory
      ? currentSubcategory.name
      : currentCategory
      ? currentCategory.name
      : "Shop All Surfaces & Architectural Hardware");

  const pageDescription =
    descriptionOverride ||
    (currentSubcategory
      ? `Curated ${currentSubcategory.name} in large format porcelain, imported marble, and bespoke finishes.`
      : currentCategory
      ? currentCategory.description
      : "Browse Candela's comprehensive database-driven catalogue of tiles, natural marbles, luxury sanitaryware, faucets, and hardware.");

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      {/* 1. BREADCRUMBS */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs font-mono text-candela-secondary mb-6"
      >
        <Link href="/" className="hover:text-candela-accent transition">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-candela-accent transition">
          Shop
        </Link>
        {currentCategory && (
          <>
            <span>/</span>
            <Link
              href={`/shop/${currentCategory.slug}`}
              className="hover:text-candela-accent transition"
            >
              {currentCategory.name}
            </Link>
          </>
        )}
        {currentSubcategory && (
          <>
            <span>/</span>
            <span className="text-candela-accent font-semibold">
              {currentSubcategory.name}
            </span>
          </>
        )}
      </nav>

      {/* 2. HEADER: Category Title & Description */}
      <div className="border-b border-candela-border pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-3xl sm:text-4xl font-semibold tracking-wide text-candela-text">
              {pageTitle}
            </h1>
            <span className="font-mono text-xs text-candela-secondary bg-candela-surface px-2.5 py-1 border border-candela-border">
              {sortedProducts.length} Products
            </span>
          </div>
          <p className="max-w-3xl text-xs sm:text-sm text-candela-secondary mt-2 leading-relaxed font-light">
            {pageDescription}
          </p>
        </div>

        {/* Quick subcategory pills if at category level */}
        {currentCategory && !currentSubcategory && (
          <div className="flex flex-wrap gap-1.5 max-w-md">
            {currentCategory.subcategories.map((sub) => (
              <Link
                key={sub.slug}
                href={`/shop/${currentCategory.slug}/${sub.slug}`}
                className="text-[11px] font-mono px-2.5 py-1 bg-candela-surface border border-candela-border hover:border-candela-accent hover:text-candela-accent transition"
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 3. CONTROL BAR: Search, Filter Toggle, Sort, View Switcher */}
      <div className="border border-candela-border bg-candela-surface/80 p-3 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[240px] max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-candela-secondary" />
            <input
              type="text"
              placeholder="Search by stone name, code, material..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-candela-bg border border-candela-border pl-8 pr-3 py-1.5 text-xs text-candela-text focus:border-candela-accent focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-candela-secondary hover:text-candela-text"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden inline-flex items-center gap-1.5 border border-candela-border bg-candela-bg px-3 py-1.5 text-xs font-mono uppercase"
          >
            <Filter className="h-3.5 w-3.5 text-candela-accent" />
            <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-candela-secondary hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-candela-bg border border-candela-border px-3 py-1.5 text-xs text-candela-text focus:border-candela-accent focus:outline-none cursor-pointer"
            >
              <option value="recommended">Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>

          {/* View Mode Switcher */}
          <div className="hidden sm:flex items-center border border-candela-border bg-candela-bg">
            <button
              onClick={() => setViewMode("grid3")}
              title="3-Column Gallery View"
              className={`p-1.5 transition ${
                viewMode === "grid3"
                  ? "bg-candela-dark text-white"
                  : "text-candela-secondary hover:text-candela-text"
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("grid4")}
              title="4-Column Compact Grid"
              className={`p-1.5 transition ${
                viewMode === "grid4"
                  ? "bg-candela-dark text-white"
                  : "text-candela-secondary hover:text-candela-text"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              title="Architectural Specification List"
              className={`p-1.5 transition ${
                viewMode === "list"
                  ? "bg-candela-dark text-white"
                  : "text-candela-secondary hover:text-candela-text"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. ACTIVE FILTER TAGS PILLS */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-candela-surface/40 border border-candela-border text-xs font-mono">
          <span className="text-candela-secondary uppercase text-[10px] tracking-wider">
            Active Filters ({activeFiltersCount}):
          </span>

          {Object.entries(selectedFilters).map(([key, values]) =>
            values.map((val) => (
              <span
                key={`${key}-${val}`}
                className="inline-flex items-center gap-1.5 bg-candela-bg border border-candela-accent/40 px-2 py-0.5 text-candela-text text-[11px]"
              >
                <span className="text-candela-secondary capitalize">{key}:</span>
                <span className="font-semibold text-candela-accent">{val}</span>
                <button
                  onClick={() => handleToggleFilter(key, val)}
                  className="hover:text-red-500 transition ml-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))
          )}

          <button
            onClick={handleClearAllFilters}
            className="text-xs text-candela-accent underline hover:text-candela-dark transition ml-2 font-mono"
          >
            Clear All
          </button>
        </div>
      )}

      {/* 5. MAIN CONTENT: Sidebar Filters + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* DESKTOP FILTER SIDEBAR */}
        <aside className="hidden lg:block border border-candela-border bg-candela-surface p-5 space-y-6 sticky top-24 max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-candela-border pb-3">
            <span className="font-heading text-sm uppercase tracking-[0.16em] font-semibold text-candela-text flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-candela-accent" />
              <span>Category Filters</span>
            </span>
            {activeFiltersCount > 0 && (
              <button
                onClick={handleClearAllFilters}
                className="text-[11px] font-mono text-candela-accent hover:underline"
              >
                Reset
              </button>
            )}
          </div>

          {activeFilterDefinitions.map((filter) => {
            const currentSelected = selectedFilters[filter.key] || [];

            return (
              <div key={filter.key} className="space-y-2.5 pb-4 border-b border-candela-border/60">
                <div className="flex items-center justify-between text-xs font-mono font-semibold uppercase tracking-wider text-candela-text">
                  <span>{filter.label}</span>
                  {currentSelected.length > 0 && (
                    <span className="text-candela-accent text-[10px]">
                      ({currentSelected.length})
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {filter.values.map((val) => {
                    const isChecked = currentSelected.includes(val);

                    return (
                      <label
                        key={val}
                        className="flex items-center gap-2 text-xs text-candela-text-secondary hover:text-candela-text cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleFilter(filter.key, val)}
                          className="h-3.5 w-3.5 rounded-none border-candela-border text-candela-accent focus:ring-0"
                        />
                        <span className={isChecked ? "text-candela-accent font-medium" : ""}>
                          {val}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </aside>

        {/* PRODUCT GRID CONTAINER */}
        <div className="lg:col-span-3">
          {sortedProducts.length === 0 ? (
            <div className="border border-candela-border bg-candela-surface p-12 text-center space-y-4">
              <div className="inline-flex p-3 bg-candela-bg border border-candela-border">
                <Search className="h-6 w-6 text-candela-accent" />
              </div>
              <h3 className="font-heading text-xl font-semibold">No Surfaces Matched</h3>
              <p className="text-xs text-candela-secondary max-w-md mx-auto">
                No products found matching your current filter criteria. Try clearing some filters or searching for alternative marble or porcelain specifications.
              </p>
              <button
                onClick={handleClearAllFilters}
                className="inline-flex items-center gap-2 bg-candela-accent px-5 py-2 text-xs font-mono uppercase text-white hover:bg-candela-dark transition"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : viewMode === "list" ? (
            /* Architectural List View */
            <div className="space-y-4">
              {sortedProducts.map((p) => (
                <div
                  key={p.id}
                  className="border border-candela-border bg-candela-surface p-4 flex flex-col md:flex-row items-center gap-6 hover:border-candela-accent transition"
                >
                  <img
                    src={p.media.primaryImage}
                    alt={p.name}
                    className="h-32 w-32 object-cover shrink-0"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 font-mono text-[10px] text-candela-secondary">
                      <span>{p.sku}</span>
                      <span>•</span>
                      <span>{p.origin}</span>
                    </div>
                    <Link href={`/product/${p.slug}`}>
                      <h4 className="font-heading text-lg font-bold hover:text-candela-accent transition">
                        {p.name}
                      </h4>
                    </Link>
                    <p className="text-xs text-candela-secondary line-clamp-2">
                      {p.shortDescription}
                    </p>
                    <div className="flex flex-wrap gap-2 text-[10px] font-mono text-candela-secondary pt-1">
                      <span>{p.dimensionsMm}</span>
                      <span>•</span>
                      <span>{p.finish}</span>
                      <span>•</span>
                      <span>{p.material}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 flex flex-col items-end gap-2">
                    <div className="font-mono text-base font-bold text-candela-accent">
                      ₹{p.pricePerSqftInr.toLocaleString("en-IN")}/sq.ft
                    </div>
                    <Link
                      href={`/product/${p.slug}`}
                      className="inline-flex items-center gap-1 bg-candela-accent px-4 py-1.5 text-xs font-mono text-white hover:bg-candela-dark transition"
                    >
                      <span>View Specifications</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Grid View */
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${
                viewMode === "grid4" ? "lg:grid-cols-3" : "lg:grid-cols-3"
              }`}
            >
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-candela-bg animate-fadeIn">
          <div className="flex items-center justify-between border-b border-candela-border px-6 py-4 bg-candela-surface">
            <span className="font-heading text-lg tracking-wider">FILTERS</span>
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="p-1 text-candela-text hover:text-candela-accent"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {activeFilterDefinitions.map((filter) => {
              const currentSelected = selectedFilters[filter.key] || [];

              return (
                <div key={filter.key} className="space-y-2 border-b border-candela-border pb-4">
                  <div className="font-mono text-xs font-bold uppercase text-candela-text">
                    {filter.label}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {filter.values.map((val) => {
                      const isChecked = currentSelected.includes(val);
                      return (
                        <label
                          key={val}
                          className="flex items-center gap-2 text-xs text-candela-secondary"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleFilter(filter.key, val)}
                            className="h-3.5 w-3.5 rounded-none"
                          />
                          <span className={isChecked ? "text-candela-accent font-semibold" : ""}>
                            {val}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-candela-border p-4 bg-candela-surface flex gap-3">
            <button
              onClick={handleClearAllFilters}
              className="flex-1 py-2.5 border border-candela-border text-xs font-mono uppercase"
            >
              Clear
            </button>
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="flex-1 py-2.5 bg-candela-accent text-white text-xs font-mono uppercase font-semibold"
            >
              Apply ({filteredProducts.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function ShopCatalogueView(props: ShopCatalogueViewProps) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-6 py-24 text-center font-mono text-xs text-candela-secondary">
          Loading architectural catalogue...
        </div>
      }
    >
      <CatalogueContent {...props} />
    </Suspense>
  );
}
