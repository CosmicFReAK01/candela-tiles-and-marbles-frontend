"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useItemCart } from "@/context/ItemCartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCompare } from "@/context/CompareContext";
import { useCandelaStore } from "@/context/CandelaStoreContext";
import { SearchModal } from "./SearchModal";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  ChevronDown,
  Compass,
  Heart,
  Home,
  Layers,
  MapPin,
  Menu,
  Palette,
  Phone,
  Search,
  Shapes,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
  Eye,
  FileText,
  Package,
} from "lucide-react";

export function StorefrontHeader() {
  const { totalItemsCount, subtotalInr, toggleDrawer } = useItemCart();
  const { wishlistCount } = useWishlist();
  const { compareCount } = useCompare();
  const { homePageCms } = useCandelaStore();

  const phoneDisplay = homePageCms.phone || "+91 98201 44812";
  const phoneTel = phoneDisplay.replace(/\s+/g, "");

  const [activeMenu, setActiveMenu] = useState<"shop" | "collections" | "explore" | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>("shop");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (menu: "shop" | "collections" | "explore") => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 220);
  };

  // Close menus on Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMenu(null);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-candela-border/60 bg-candela-bg/95 backdrop-blur-md transition-all">
        {/* Top Advisory Bar */}
        <div className="border-b border-candela-border/40 bg-candela-dark text-candela-bg text-[11px] font-sans tracking-wide">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-2">
            <div className="flex items-center gap-4 text-candela-border">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-candela-accent" />
                <span>Bhiwandi Slab Gallery &amp; Navi Mumbai Experience Centre</span>
              </span>
              <span className="hidden md:inline text-candela-border/40">|</span>
              <span className="hidden md:inline text-candela-border/90">
                {homePageCms.announcementText || "Direct Italian Quarry Slabs • Architect & Trade Desk"}
              </span>
            </div>

            <div className="flex items-center gap-5">
              <a
                href={`tel:${phoneTel}`}
                className="inline-flex items-center gap-1.5 text-candela-accent hover:text-white transition font-mono"
              >
                <Phone className="h-3 w-3" />
                <span>{phoneDisplay}</span>
              </a>
              <span className="text-candela-border/40">|</span>
              <Link
                href="/enquiry/track/CND-2026-8492"
                className="hover:text-candela-accent transition font-mono hidden sm:inline"
              >
                Track Quote
              </Link>
              <Link
                href="/admin"
                className="hover:text-candela-accent transition font-mono text-[10px] text-candela-border/70"
              >
                Staff Login
              </Link>
            </div>
          </div>
        </div>

        {/* Tier 1: Brand Header Row - CANDELA TILES & MARBLES in the middle on top of all the nav */}
        <div className="relative border-b border-candela-border/30 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
          <div className="mx-auto max-w-7xl">
            {/* Desktop Layout (lg and up) - Robust 3-Column Grid that guarantees aspect ratio */}
            <div className="hidden lg:grid grid-cols-12 items-center gap-4">
              {/* Left Column (3 cols): Search Catalogue */}
              <div className="col-span-3 flex items-center justify-start min-w-0">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Search Catalogue"
                  className="flex items-center gap-2 border border-candela-border/60 bg-candela-surface/60 hover:bg-candela-surface px-3 py-1.5 text-xs text-candela-text-secondary hover:text-candela-text transition max-w-full"
                >
                  <Search className="h-3.5 w-3.5 text-candela-accent shrink-0" />
                  <span className="font-mono text-[11px] truncate">Search catalogue...</span>
                </button>
              </div>

              {/* Middle Column (6 cols): CANDELA TILES & MARBLES strictly centered on top */}
              <div className="col-span-6 text-center min-w-0">
                <Link
                  href="/"
                  className="inline-block group focus:outline-none text-center max-w-full"
                  onClick={() => setActiveMenu(null)}
                >
                  <span className="font-heading text-lg xl:text-2xl 2xl:text-3xl tracking-[0.16em] xl:tracking-[0.22em] text-candela-text group-hover:text-candela-accent transition-colors duration-200 uppercase font-light whitespace-nowrap block truncate">
                    CANDELA TILES &amp; MARBLES
                  </span>
                </Link>
              </div>

              {/* Right Column (3 cols): Wishlist, Compare, Enquire, Cart - STRICTLY INSIDE THE SCREEN */}
              <div className="col-span-3 flex items-center justify-end gap-2 xl:gap-3 shrink-0">
                {/* WISHLIST BUTTON */}
                <Link
                  href="/wishlist"
                  className="relative p-1.5 xl:p-2 text-candela-text hover:text-candela-accent transition shrink-0"
                  title="View Saved Wishlist"
                >
                  <Heart className="h-4 w-4" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-candela-accent text-[9px] font-bold text-white">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {/* COMPARE BUTTON */}
                <Link
                  href="/compare"
                  className="relative p-1.5 xl:p-2 text-candela-text hover:text-candela-accent transition shrink-0"
                  title="Compare Products (Up to 4)"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {compareCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-candela-dark text-[9px] font-bold text-candela-accent border border-candela-accent">
                      {compareCount}
                    </span>
                  )}
                </Link>

                {/* ENQUIRE DIRECT BUTTON */}
                <Link
                  href="/enquiry"
                  className="hidden xl:inline-flex items-center gap-1.5 border border-candela-border bg-candela-surface px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-candela-text hover:border-candela-accent hover:text-candela-accent transition shrink-0"
                >
                  <FileText className="h-3.5 w-3.5 text-candela-accent" />
                  <span>Enquire</span>
                </Link>

                {/* ITEM CART DRAWER TRIGGER */}
                <button
                  onClick={toggleDrawer}
                  aria-label="View Item Cart"
                  className="relative inline-flex items-center gap-1.5 border border-candela-accent bg-candela-accent/10 hover:bg-candela-accent hover:text-white px-2.5 xl:px-3 py-1.5 text-xs font-medium text-candela-accent transition shrink-0"
                >
                  <ShoppingBag className="h-3.5 w-3.5 shrink-0" />
                  <span className="font-mono text-[11px] font-semibold">{totalItemsCount}</span>
                  {subtotalInr > 0 && (
                    <span className="hidden 2xl:inline border-l border-candela-accent/40 pl-2 font-mono text-[11px]">
                      ₹{subtotalInr.toLocaleString("en-IN")}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Mobile / Tablet Layout (< lg) - Protected from horizontal overflow */}
            <div className="lg:hidden flex items-center justify-between w-full">
              {/* Left: Mobile Hamburger Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
                className="p-1.5 -ml-1 text-candela-text hover:text-candela-accent transition shrink-0"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              {/* Center: Brand Title (Centered, truncated if needed) */}
              <div className="flex-1 text-center px-1.5 min-w-0">
                <Link
                  href="/"
                  className="inline-block group focus:outline-none max-w-full text-center"
                  onClick={() => setActiveMenu(null)}
                >
                  <span className="font-heading text-xs sm:text-base md:text-lg tracking-[0.12em] sm:tracking-[0.18em] text-candela-text uppercase font-light block truncate">
                    CANDELA TILES &amp; MARBLES
                  </span>
                </Link>
              </div>

              {/* Right: Search, Wishlist, Cart - GUARANTEED shrink-0 and strictly inside aspect ratio */}
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                {/* SEARCH BUTTON */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Search Catalogue"
                  className="p-1.5 text-candela-text hover:text-candela-accent transition shrink-0"
                >
                  <Search className="h-4 w-4 text-candela-accent" />
                </button>

                {/* WISHLIST BUTTON */}
                <Link
                  href="/wishlist"
                  className="relative p-1.5 text-candela-text hover:text-candela-accent transition shrink-0"
                  title="View Saved Wishlist"
                >
                  <Heart className="h-4 w-4" />
                  {wishlistCount > 0 && (
                    <span className="absolute top-0 right-0 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-candela-accent text-[8px] font-bold text-white">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {/* ITEM CART DRAWER TRIGGER */}
                <button
                  onClick={toggleDrawer}
                  aria-label="View Item Cart"
                  className="relative inline-flex items-center gap-1 border border-candela-accent bg-candela-accent/10 hover:bg-candela-accent hover:text-white px-2 py-1 text-xs font-medium text-candela-accent transition shrink-0"
                >
                  <ShoppingBag className="h-3.5 w-3.5 shrink-0" />
                  <span className="font-mono text-[11px] font-semibold">{totalItemsCount}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tier 2: All The Navigation Links - Directly below the brand title */}
        <div className="bg-candela-bg/95">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Desktop Primary Navigation */}
            <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-2 2xl:gap-3 py-2">
              <Link
                href="/"
                className="px-3 xl:px-4 py-1.5 text-xs font-medium uppercase tracking-[0.15em] text-candela-text hover:text-candela-accent transition"
              >
                Home
              </Link>

              {/* SHOP MEGA MENU */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("shop")}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href="/shop"
                  onClick={() => setActiveMenu(null)}
                  className={`inline-flex items-center gap-1 px-3 xl:px-4 py-1.5 text-xs font-medium uppercase tracking-[0.15em] transition ${
                    activeMenu === "shop"
                      ? "text-candela-accent"
                      : "text-candela-text hover:text-candela-accent"
                  }`}
                >
                  <span>Shop</span>
                  <ChevronDown
                    className={`h-3 w-3 transition-transform duration-200 ${
                      activeMenu === "shop" ? "rotate-180" : ""
                    }`}
                  />
                </Link>
              </div>

              {/* COLLECTIONS MEGA MENU */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("collections")}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href="/collections"
                  onClick={() => setActiveMenu(null)}
                  className={`inline-flex items-center gap-1 px-3 xl:px-4 py-1.5 text-xs font-medium uppercase tracking-[0.15em] transition ${
                    activeMenu === "collections"
                      ? "text-candela-accent"
                      : "text-candela-text hover:text-candela-accent"
                  }`}
                >
                  <span>Collections</span>
                  <ChevronDown
                    className={`h-3 w-3 transition-transform duration-200 ${
                      activeMenu === "collections" ? "rotate-180" : ""
                    }`}
                  />
                </Link>
              </div>

              {/* EXPLORE MEGA MENU */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("explore")}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href="/explore"
                  onClick={() => setActiveMenu(null)}
                  className={`inline-flex items-center gap-1 px-3 xl:px-4 py-1.5 text-xs font-medium uppercase tracking-[0.15em] transition ${
                    activeMenu === "explore"
                      ? "text-candela-accent"
                      : "text-candela-text hover:text-candela-accent"
                  }`}
                >
                  <span>Explore</span>
                  <ChevronDown
                    className={`h-3 w-3 transition-transform duration-200 ${
                      activeMenu === "explore" ? "rotate-180" : ""
                    }`}
                  />
                </Link>
              </div>

              <Link
                href="/inspiration"
                className="px-3 xl:px-4 py-1.5 text-xs font-medium uppercase tracking-[0.15em] text-candela-text hover:text-candela-accent transition flex items-center gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5 text-candela-accent" />
                <span>Inspiration</span>
              </Link>

              <Link
                href="/about"
                className="px-3 xl:px-4 py-1.5 text-xs font-medium uppercase tracking-[0.15em] text-candela-text hover:text-candela-accent transition"
              >
                About
              </Link>

              <Link
                href="/contact"
                className="px-3 xl:px-4 py-1.5 text-xs font-medium uppercase tracking-[0.15em] text-candela-text hover:text-candela-accent transition"
              >
                Contact
              </Link>
            </nav>

            {/* Mobile / Tablet Horizontal Category Scroll Bar */}
            <div className="lg:hidden flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-2 text-[11px] font-medium uppercase tracking-wider text-candela-text-secondary border-t border-candela-border/20">
              <Link
                href="/shop/tiles"
                className="px-2.5 py-1 whitespace-nowrap hover:text-candela-accent transition"
              >
                Tiles
              </Link>
              <span className="text-candela-border/40">•</span>
              <Link
                href="/shop/marbles"
                className="px-2.5 py-1 whitespace-nowrap hover:text-candela-accent transition"
              >
                Marbles
              </Link>
              <span className="text-candela-border/40">•</span>
              <Link
                href="/shop/collections"
                className="px-2.5 py-1 whitespace-nowrap hover:text-candela-accent transition"
              >
                Collections
              </Link>
              <span className="text-candela-border/40">•</span>
              <Link
                href="/explore"
                className="px-2.5 py-1 whitespace-nowrap hover:text-candela-accent transition"
              >
                Explore
              </Link>
              <span className="text-candela-border/40">•</span>
              <Link
                href="/inspiration"
                className="px-2.5 py-1 whitespace-nowrap text-candela-accent font-semibold transition"
              >
                Inspiration
              </Link>
              <span className="text-candela-border/40">•</span>
              <Link
                href="/contact"
                className="px-2.5 py-1 whitespace-nowrap hover:text-candela-accent transition"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>

        {/* =========================================================================
            DESKTOP MEGA MENUS (SHOP, COLLECTIONS, EXPLORE)
        ========================================================================= */}

        {/* 1. SHOP MEGA MENU */}
        {activeMenu === "shop" && (
          <div
            className="hidden lg:block border-t border-candela-border bg-candela-bg shadow-2xl transition-all animate-fadeIn"
            onMouseEnter={() => handleMouseEnter("shop")}
            onMouseLeave={handleMouseLeave}
          >
            <div className="mx-auto max-w-7xl px-8 py-8">
              <div className="grid grid-cols-5 gap-8">
                {/* TILES */}
                <div>
                  <Link
                    href="/shop/tiles"
                    onClick={() => setActiveMenu(null)}
                    className="group inline-flex items-center gap-1.5 font-heading text-sm uppercase tracking-[0.16em] text-candela-text hover:text-candela-accent transition pb-2 border-b border-candela-border w-full mb-3"
                  >
                    <span className="font-bold">TILES</span>
                    <ArrowRight className="h-3 w-3 text-candela-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  <ul className="space-y-1.5 text-xs text-candela-text-secondary">
                    {[
                      { name: "Floor Tiles", slug: "floor-tiles" },
                      { name: "Wall Tiles", slug: "wall-tiles" },
                      { name: "Bathroom Tiles", slug: "bathroom-tiles" },
                      { name: "Kitchen Tiles", slug: "kitchen-tiles" },
                      { name: "Outdoor Tiles", slug: "outdoor-tiles" },
                      { name: "Large Format Tiles", slug: "large-format-tiles" },
                      { name: "Designer Tiles", slug: "designer-tiles" },
                      { name: "Anti-Skid Tiles", slug: "anti-skid-tiles" },
                    ].map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/shop/tiles/${item.slug}`}
                          onClick={() => setActiveMenu(null)}
                          className="hover:text-candela-accent transition block py-0.5"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* MARBLES */}
                <div>
                  <Link
                    href="/shop/marbles"
                    onClick={() => setActiveMenu(null)}
                    className="group inline-flex items-center gap-1.5 font-heading text-sm uppercase tracking-[0.16em] text-candela-text hover:text-candela-accent transition pb-2 border-b border-candela-border w-full mb-3"
                  >
                    <span className="font-bold">MARBLES</span>
                    <ArrowRight className="h-3 w-3 text-candela-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  <ul className="space-y-1.5 text-xs text-candela-text-secondary">
                    {[
                      { name: "Natural Marble", slug: "natural-marble" },
                      { name: "Imported Marble", slug: "imported-marble" },
                      { name: "White Marble", slug: "white-marble" },
                      { name: "Beige Marble", slug: "beige-marble" },
                      { name: "Black Marble", slug: "black-marble" },
                      { name: "Premium Marble", slug: "premium-marble" },
                    ].map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/shop/marbles/${item.slug}`}
                          onClick={() => setActiveMenu(null)}
                          className="hover:text-candela-accent transition block py-0.5"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* BATHROOM */}
                <div>
                  <div className="font-heading text-sm uppercase tracking-[0.16em] text-candela-text pb-2 border-b border-candela-border w-full mb-3 font-bold">
                    BATHROOM
                  </div>
                  <ul className="space-y-1.5 text-xs text-candela-text-secondary">
                    <li>
                      <Link
                        href="/shop/sanitaryware"
                        onClick={() => setActiveMenu(null)}
                        className="font-medium text-candela-text hover:text-candela-accent transition block py-0.5"
                      >
                        Sanitaryware
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/shop/sanitaryware/wash-basins"
                        onClick={() => setActiveMenu(null)}
                        className="hover:text-candela-accent transition block pl-2 py-0.5"
                      >
                        Wash Basins
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/shop/sanitaryware/toilets-wcs"
                        onClick={() => setActiveMenu(null)}
                        className="hover:text-candela-accent transition block pl-2 py-0.5"
                      >
                        Toilets / WCs
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/shop/faucets"
                        onClick={() => setActiveMenu(null)}
                        className="font-medium text-candela-text hover:text-candela-accent transition block py-0.5 mt-1"
                      >
                        Faucets
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/shop/showers"
                        onClick={() => setActiveMenu(null)}
                        className="font-medium text-candela-text hover:text-candela-accent transition block py-0.5"
                      >
                        Showers
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/shop/bathroom-accessories"
                        onClick={() => setActiveMenu(null)}
                        className="font-medium text-candela-text hover:text-candela-accent transition block py-0.5"
                      >
                        Bathroom Accessories
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* HARDWARE */}
                <div>
                  <Link
                    href="/shop/hardware"
                    onClick={() => setActiveMenu(null)}
                    className="group inline-flex items-center gap-1.5 font-heading text-sm uppercase tracking-[0.16em] text-candela-text hover:text-candela-accent transition pb-2 border-b border-candela-border w-full mb-3"
                  >
                    <span className="font-bold">HARDWARE</span>
                    <ArrowRight className="h-3 w-3 text-candela-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  <ul className="space-y-1.5 text-xs text-candela-text-secondary">
                    {[
                      { name: "Door Hardware", slug: "door-hardware" },
                      { name: "Bathroom Hardware", slug: "bathroom-hardware" },
                      { name: "Kitchen Hardware", slug: "kitchen-hardware" },
                      { name: "Fittings", slug: "fittings" },
                      { name: "Accessories", slug: "accessories" },
                    ].map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/shop/hardware/${item.slug}`}
                          onClick={() => setActiveMenu(null)}
                          className="hover:text-candela-accent transition block py-0.5"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* FEATURED SPOTLIGHT */}
                <div className="border-l border-candela-border pl-6 bg-candela-surface/30 p-4">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-candela-accent mb-2">
                    FEATURED CURATION
                  </div>
                  <ul className="space-y-2 text-xs mb-4">
                    <li>
                      <Link
                        href="/collections/new-arrivals"
                        onClick={() => setActiveMenu(null)}
                        className="font-medium text-candela-text hover:text-candela-accent transition block"
                      >
                        New Arrivals 2026 →
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/collections/premium"
                        onClick={() => setActiveMenu(null)}
                        className="font-medium text-candela-text hover:text-candela-accent transition block"
                      >
                        Premium Collection →
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/collections/luxury"
                        onClick={() => setActiveMenu(null)}
                        className="font-medium text-candela-text hover:text-candela-accent transition block"
                      >
                        Luxury Collection →
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/collections/best-sellers"
                        onClick={() => setActiveMenu(null)}
                        className="font-medium text-candela-text hover:text-candela-accent transition block"
                      >
                        Best Sellers →
                      </Link>
                    </li>
                  </ul>
                  <Link
                    href="/shop"
                    onClick={() => setActiveMenu(null)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-candela-accent hover:underline uppercase tracking-wider font-mono"
                  >
                    <span>View All Shop Items</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. COLLECTIONS MEGA MENU */}
        {activeMenu === "collections" && (
          <div
            className="hidden lg:block border-t border-candela-border bg-candela-bg shadow-2xl transition-all animate-fadeIn"
            onMouseEnter={() => handleMouseEnter("collections")}
            onMouseLeave={handleMouseLeave}
          >
            <div className="mx-auto max-w-7xl px-8 py-8">
              <div className="grid grid-cols-4 gap-8">
                <div>
                  <div className="font-heading text-sm uppercase tracking-[0.16em] text-candela-text pb-2 border-b border-candela-border mb-3 font-bold">
                    CURATED EDITIONS
                  </div>
                  <ul className="space-y-2 text-xs text-candela-text-secondary">
                    {[
                      { name: "Premium Collection", slug: "premium", desc: "Rare monolithic quarry slabs" },
                      { name: "Luxury Collection", slug: "luxury", desc: "Opulent bookmatched statements" },
                      { name: "Modern Collection", slug: "modern", desc: "Minimal architectural palettes" },
                      { name: "Natural Collection", slug: "natural", desc: "Tactile travertine & honed slate" },
                      { name: "Classic Collection", slug: "classic", desc: "Enduring Statuario & Botticino" },
                    ].map((col) => (
                      <li key={col.slug}>
                        <Link
                          href={`/collections/${col.slug}`}
                          onClick={() => setActiveMenu(null)}
                          className="group block p-1.5 hover:bg-candela-surface transition"
                        >
                          <div className="font-medium text-candela-text group-hover:text-candela-accent">
                            {col.name}
                          </div>
                          <div className="text-[11px] text-candela-text-secondary">{col.desc}</div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="font-heading text-sm uppercase tracking-[0.16em] text-candela-text pb-2 border-b border-candela-border mb-3 font-bold">
                    DISCOVERY
                  </div>
                  <ul className="space-y-2 text-xs text-candela-text-secondary">
                    <li>
                      <Link
                        href="/collections/new-arrivals"
                        onClick={() => setActiveMenu(null)}
                        className="group block p-1.5 hover:bg-candela-surface transition"
                      >
                        <div className="font-medium text-candela-text group-hover:text-candela-accent">
                          New Arrivals
                        </div>
                        <div className="text-[11px] text-candela-text-secondary">
                          Latest European shipments & technology
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/collections/best-sellers"
                        onClick={() => setActiveMenu(null)}
                        className="group block p-1.5 hover:bg-candela-surface transition"
                      >
                        <div className="font-medium text-candela-text group-hover:text-candela-accent">
                          Best Sellers
                        </div>
                        <div className="text-[11px] text-candela-text-secondary">
                          Most specified architectural surfaces
                        </div>
                      </Link>
                    </li>
                  </ul>

                  <div className="mt-8 pt-4 border-t border-candela-border">
                    <Link
                      href="/collections"
                      onClick={() => setActiveMenu(null)}
                      className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-mono text-candela-accent hover:underline font-semibold"
                    >
                      <span>VIEW ALL COLLECTIONS</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>

                {/* Visual Preview 1 */}
                <div className="relative group overflow-hidden border border-candela-border aspect-[4/3] bg-candela-dark">
                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
                    alt="Premium Collection"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 flex flex-col justify-end text-white">
                    <span className="font-mono text-[10px] text-candela-accent uppercase tracking-wider">
                      Atelier Carrara
                    </span>
                    <h4 className="font-heading text-base font-semibold">Premium Marble Bundles</h4>
                    <Link
                      href="/collections/premium"
                      onClick={() => setActiveMenu(null)}
                      className="text-xs text-candela-accent underline font-mono mt-1"
                    >
                      Explore Collection →
                    </Link>
                  </div>
                </div>

                {/* Visual Preview 2 */}
                <div className="relative group overflow-hidden border border-candela-border aspect-[4/3] bg-candela-dark">
                  <img
                    src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=600&q=80"
                    alt="Natural Collection"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 flex flex-col justify-end text-white">
                    <span className="font-mono text-[10px] text-candela-accent uppercase tracking-wider">
                      Roma Antica
                    </span>
                    <h4 className="font-heading text-base font-semibold">Natural Travertine Strata</h4>
                    <Link
                      href="/collections/natural"
                      onClick={() => setActiveMenu(null)}
                      className="text-xs text-candela-accent underline font-mono mt-1"
                    >
                      Explore Collection →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. EXPLORE MEGA MENU */}
        {activeMenu === "explore" && (
          <div
            className="hidden lg:block border-t border-candela-border bg-candela-bg shadow-2xl transition-all animate-fadeIn"
            onMouseEnter={() => handleMouseEnter("explore")}
            onMouseLeave={handleMouseLeave}
          >
            <div className="mx-auto max-w-7xl px-8 py-8">
              <div className="grid grid-cols-6 gap-6">
                {/* BY ROOM */}
                <div>
                  <div className="font-heading text-xs uppercase tracking-[0.16em] text-candela-text pb-2 border-b border-candela-border mb-3 font-bold">
                    BY ROOM
                  </div>
                  <ul className="space-y-1.5 text-xs text-candela-text-secondary">
                    {["Living Room", "Bedroom", "Bathroom", "Kitchen", "Balcony", "Outdoor"].map(
                      (room) => (
                        <li key={room}>
                          <Link
                            href={`/explore/rooms/${room.toLowerCase().replace(/\s+/g, "-")}`}
                            onClick={() => setActiveMenu(null)}
                            className="hover:text-candela-accent transition block py-0.5"
                          >
                            {room}
                          </Link>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                {/* BY STYLE */}
                <div>
                  <div className="font-heading text-xs uppercase tracking-[0.16em] text-candela-text pb-2 border-b border-candela-border mb-3 font-bold">
                    BY STYLE
                  </div>
                  <ul className="space-y-1.5 text-xs text-candela-text-secondary">
                    {["Modern", "Minimal", "Luxury", "Classic", "Industrial", "Natural"].map(
                      (style) => (
                        <li key={style}>
                          <Link
                            href={`/explore/styles/${style.toLowerCase().replace(/\s+/g, "-")}`}
                            onClick={() => setActiveMenu(null)}
                            className="hover:text-candela-accent transition block py-0.5"
                          >
                            {style}
                          </Link>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                {/* BY MATERIAL */}
                <div>
                  <div className="font-heading text-xs uppercase tracking-[0.16em] text-candela-text pb-2 border-b border-candela-border mb-3 font-bold">
                    BY MATERIAL
                  </div>
                  <ul className="space-y-1.5 text-xs text-candela-text-secondary">
                    {["Marble", "Porcelain", "Ceramic", "Stone", "Granite"].map((material) => (
                      <li key={material}>
                        <Link
                          href={`/explore/materials/${material.toLowerCase().replace(/\s+/g, "-")}`}
                          onClick={() => setActiveMenu(null)}
                          className="hover:text-candela-accent transition block py-0.5"
                        >
                          {material}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* BY COLOUR */}
                <div>
                  <div className="font-heading text-xs uppercase tracking-[0.16em] text-candela-text pb-2 border-b border-candela-border mb-3 font-bold">
                    BY COLOUR
                  </div>
                  <ul className="space-y-1.5 text-xs text-candela-text-secondary">
                    {[
                      { name: "White", hex: "#FFFFFF" },
                      { name: "Beige", hex: "#E7DFD3" },
                      { name: "Grey", hex: "#8C8982" },
                      { name: "Black", hex: "#1A1A1A" },
                      { name: "Brown", hex: "#8B6B4F" },
                    ].map((col) => (
                      <li key={col.name}>
                        <Link
                          href={`/explore/colours/${col.name.toLowerCase()}`}
                          onClick={() => setActiveMenu(null)}
                          className="hover:text-candela-accent transition flex items-center gap-2 py-0.5"
                        >
                          <span
                            className="h-2.5 w-2.5 rounded-full border border-candela-border"
                            style={{ backgroundColor: col.hex }}
                          />
                          <span>{col.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* BY FINISH */}
                <div>
                  <div className="font-heading text-xs uppercase tracking-[0.16em] text-candela-text pb-2 border-b border-candela-border mb-3 font-bold">
                    BY FINISH
                  </div>
                  <ul className="space-y-1.5 text-xs text-candela-text-secondary">
                    {["Matte", "Glossy", "Polished", "Textured"].map((finish) => (
                      <li key={finish}>
                        <Link
                          href={`/explore/finishes/${finish.toLowerCase()}`}
                          onClick={() => setActiveMenu(null)}
                          className="hover:text-candela-accent transition block py-0.5"
                        >
                          {finish}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* BY APPLICATION */}
                <div>
                  <div className="font-heading text-xs uppercase tracking-[0.16em] text-candela-text pb-2 border-b border-candela-border mb-3 font-bold">
                    BY APPLICATION
                  </div>
                  <ul className="space-y-1.5 text-xs text-candela-text-secondary">
                    {["Floor", "Wall", "Bathroom", "Kitchen", "Outdoor", "Commercial"].map(
                      (app) => (
                        <li key={app}>
                          <Link
                            href={`/explore/applications/${app.toLowerCase()}`}
                            onClick={() => setActiveMenu(null)}
                            className="hover:text-candela-accent transition block py-0.5"
                          >
                            {app}
                          </Link>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================================
          MOBILE NAVIGATION DRAWER
      ========================================================================= */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-candela-bg animate-fadeIn">
          {/* Mobile Top Bar */}
          <div className="flex items-center justify-between border-b border-candela-border px-5 py-3.5 bg-candela-surface">
            <span className="font-heading text-base tracking-[0.18em] uppercase">CANDELA TILES &amp; MARBLES</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 text-candela-text hover:text-candela-accent"
              aria-label="Close Mobile Menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 text-sm">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2 pb-4 border-b border-candela-border">
              <Link
                href="/wishlist"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 border border-candela-border text-xs font-mono"
              >
                <Heart className="h-4 w-4 text-candela-accent" />
                <span>Wishlist ({wishlistCount})</span>
              </Link>
              <Link
                href="/compare"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 border border-candela-border text-xs font-mono"
              >
                <SlidersHorizontal className="h-4 w-4 text-candela-accent" />
                <span>Compare ({compareCount})</span>
              </Link>
            </div>

            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block font-heading text-base tracking-wider uppercase py-2 border-b border-candela-border/40"
            >
              Home
            </Link>

            {/* SHOP Accordion */}
            <div className="border-b border-candela-border/40 pb-2">
              <button
                onClick={() =>
                  setMobileExpandedSection(
                    mobileExpandedSection === "shop" ? null : "shop"
                  )
                }
                className="flex items-center justify-between w-full font-heading text-base tracking-wider uppercase py-2 text-candela-text"
              >
                <span>Shop</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    mobileExpandedSection === "shop" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {mobileExpandedSection === "shop" && (
                <div className="pl-3 py-2 space-y-3 text-xs text-candela-text-secondary">
                  <div>
                    <div className="font-bold text-candela-text uppercase tracking-wider mb-1">
                      Tiles
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 pl-2">
                      <Link href="/shop/tiles/floor-tiles" onClick={() => setIsMobileMenuOpen(false)}>Floor Tiles</Link>
                      <Link href="/shop/tiles/wall-tiles" onClick={() => setIsMobileMenuOpen(false)}>Wall Tiles</Link>
                      <Link href="/shop/tiles/bathroom-tiles" onClick={() => setIsMobileMenuOpen(false)}>Bathroom Tiles</Link>
                      <Link href="/shop/tiles/outdoor-tiles" onClick={() => setIsMobileMenuOpen(false)}>Outdoor Tiles</Link>
                      <Link href="/shop/tiles/large-format-tiles" onClick={() => setIsMobileMenuOpen(false)}>Large Slabs</Link>
                      <Link href="/shop/tiles/anti-skid-tiles" onClick={() => setIsMobileMenuOpen(false)}>Anti-Skid</Link>
                    </div>
                  </div>

                  <div>
                    <div className="font-bold text-candela-text uppercase tracking-wider mb-1">
                      Marbles
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 pl-2">
                      <Link href="/shop/marbles/imported-marble" onClick={() => setIsMobileMenuOpen(false)}>Imported Marble</Link>
                      <Link href="/shop/marbles/white-marble" onClick={() => setIsMobileMenuOpen(false)}>White Marble</Link>
                      <Link href="/shop/marbles/beige-marble" onClick={() => setIsMobileMenuOpen(false)}>Beige Marble</Link>
                      <Link href="/shop/marbles/black-marble" onClick={() => setIsMobileMenuOpen(false)}>Black Marble</Link>
                    </div>
                  </div>

                  <div>
                    <div className="font-bold text-candela-text uppercase tracking-wider mb-1">
                      Bathroom & Hardware
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 pl-2">
                      <Link href="/shop/sanitaryware" onClick={() => setIsMobileMenuOpen(false)}>Sanitaryware</Link>
                      <Link href="/shop/faucets" onClick={() => setIsMobileMenuOpen(false)}>Faucets</Link>
                      <Link href="/shop/showers" onClick={() => setIsMobileMenuOpen(false)}>Showers</Link>
                      <Link href="/shop/hardware" onClick={() => setIsMobileMenuOpen(false)}>Hardware</Link>
                    </div>
                  </div>

                  <Link
                    href="/shop"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="inline-block text-candela-accent font-mono font-semibold pt-1 underline"
                  >
                    View Entire Shop Catalogue →
                  </Link>
                </div>
              )}
            </div>

            {/* COLLECTIONS Accordion */}
            <div className="border-b border-candela-border/40 pb-2">
              <button
                onClick={() =>
                  setMobileExpandedSection(
                    mobileExpandedSection === "collections" ? null : "collections"
                  )
                }
                className="flex items-center justify-between w-full font-heading text-base tracking-wider uppercase py-2 text-candela-text"
              >
                <span>Collections</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    mobileExpandedSection === "collections" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {mobileExpandedSection === "collections" && (
                <div className="pl-3 py-2 space-y-1.5 text-xs text-candela-text-secondary">
                  <Link href="/collections/premium" onClick={() => setIsMobileMenuOpen(false)} className="block py-1">Premium Collection</Link>
                  <Link href="/collections/luxury" onClick={() => setIsMobileMenuOpen(false)} className="block py-1">Luxury Collection</Link>
                  <Link href="/collections/modern" onClick={() => setIsMobileMenuOpen(false)} className="block py-1">Modern Collection</Link>
                  <Link href="/collections/natural" onClick={() => setIsMobileMenuOpen(false)} className="block py-1">Natural Collection</Link>
                  <Link href="/collections/classic" onClick={() => setIsMobileMenuOpen(false)} className="block py-1">Classic Collection</Link>
                  <Link href="/collections/new-arrivals" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 font-semibold text-candela-accent">New Arrivals</Link>
                  <Link href="/collections/best-sellers" onClick={() => setIsMobileMenuOpen(false)} className="block py-1">Best Sellers</Link>
                  <Link href="/collections" onClick={() => setIsMobileMenuOpen(false)} className="block text-candela-accent underline font-mono pt-1">View All Collections →</Link>
                </div>
              )}
            </div>

            {/* EXPLORE Accordion */}
            <div className="border-b border-candela-border/40 pb-2">
              <button
                onClick={() =>
                  setMobileExpandedSection(
                    mobileExpandedSection === "explore" ? null : "explore"
                  )
                }
                className="flex items-center justify-between w-full font-heading text-base tracking-wider uppercase py-2 text-candela-text"
              >
                <span>Explore</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    mobileExpandedSection === "explore" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {mobileExpandedSection === "explore" && (
                <div className="pl-3 py-2 space-y-2 text-xs text-candela-text-secondary">
                  <div className="font-bold text-candela-text">By Room:</div>
                  <div className="grid grid-cols-2 gap-1 pl-2 mb-2">
                    <Link href="/explore/rooms/living-room" onClick={() => setIsMobileMenuOpen(false)}>Living Room</Link>
                    <Link href="/explore/rooms/bathroom" onClick={() => setIsMobileMenuOpen(false)}>Bathroom</Link>
                    <Link href="/explore/rooms/kitchen" onClick={() => setIsMobileMenuOpen(false)}>Kitchen</Link>
                    <Link href="/explore/rooms/outdoor" onClick={() => setIsMobileMenuOpen(false)}>Outdoor</Link>
                  </div>
                  <Link href="/explore" onClick={() => setIsMobileMenuOpen(false)} className="text-candela-accent underline font-mono">Open Explore Hub →</Link>
                </div>
              )}
            </div>

            <Link
              href="/inspiration"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block font-heading text-base tracking-wider uppercase py-2 border-b border-candela-border/40 text-candela-accent flex items-center gap-1.5"
            >
              <Sparkles className="h-4 w-4" />
              <span>Inspiration &amp; Design Ideas</span>
            </Link>

            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block font-heading text-base tracking-wider uppercase py-2 border-b border-candela-border/40"
            >
              About Candela
            </Link>

            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block font-heading text-base tracking-wider uppercase py-2 border-b border-candela-border/40"
            >
              Showroom & Contact
            </Link>

            <Link
              href="/enquiry"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block font-heading text-base tracking-wider uppercase py-2 border-b border-candela-border/40 text-candela-accent font-semibold"
            >
              Request Project Enquiry →
            </Link>
          </div>
        </div>
      )}

      {/* Global Architectural Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
