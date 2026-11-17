"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useCandelaStore } from "@/context/CandelaStoreContext";
import { ProductCard } from "@/components/product/ProductCard";
import { candelaApi } from "@/lib/api";
import {
  MASTER_SHOP_CATEGORIES,
  SHOP_SPACES,
  INSPIRATION_PROJECTS,
  MATERIAL_SHOWCASE,
  STYLE_SHOWCASE,
} from "@/lib/catalogue-taxonomy";
import { AdminProduct, CategoryCardData, HomePageCmsData } from "@/types";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Compass,
  Clock,
  Layers,
  MapPin,
  MessageCircle,
  Phone,
  RotateCw,
  Send,
  Shield,
  Sparkles,
  Star,
  Box,
} from "lucide-react";

const EXPLORER_TABS = [
  { id: "spaces", label: "By Space" },
  { id: "materials", label: "By Material" },
  { id: "styles", label: "By Design Style" },
] as const;

type ExplorerTabId = (typeof EXPLORER_TABS)[number]["id"];

const CATALOGUE_PILLS = [
  { id: "all", label: "All Curated" },
  { id: "Tiles", label: "Porcelain & Tiles" },
  { id: "Marbles", label: "Italian Marble" },
  { id: "Sanitaryware", label: "Sanitaryware" },
  { id: "Faucets", label: "Faucets" },
  { id: "Hardware", label: "Brass Hardware" },
];

export interface StorefrontHomeClientProps {
  initialProducts?: AdminProduct[];
  initialHomePageCms?: HomePageCmsData;
  initialShopShowcase?: CategoryCardData[];
  initialCollections?: CategoryCardData[];
}

export function StorefrontHomeClient({
  initialProducts = [],
  initialHomePageCms,
  initialShopShowcase,
  initialCollections,
}: StorefrontHomeClientProps) {
  const store = useCandelaStore();
  const homePageCms =
    store.products.length > 0 || !initialHomePageCms
      ? store.homePageCms
      : initialHomePageCms;
  const products = store.products.length > 0 ? store.products : initialProducts;
  const inspirations = store.inspirations;
  const shopShowcase =
    store.shopShowcase.length > 0
      ? store.shopShowcase
      : (initialShopShowcase ?? []);
  const activeCollections =
    store.collectionsShowcase.length > 0
      ? store.collectionsShowcase
      : (initialCollections ?? []);

  // Interactive discovery state (Hooks unconditionally at top level)
  const [activeCatalogueFilter, setActiveCatalogueFilter] = useState<string>("all");
  const [activeExplorerTab, setActiveExplorerTab] = useState<ExplorerTabId>("spaces");

  // Enquiry form local state
  const [enquiryForm, setEnquiryForm] = useState({
    name: "",
    phone: "",
    email: "",
    productOrCategory: "Italian Marble Slabs",
    approximateAreaSqft: "",
    roomOrApplication: "Living Room Flooring",
    message: "",
    preferredContact: "WhatsApp",
    website: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submittedReference, setSubmittedReference] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    if (activeCatalogueFilter === "all") {
      const featured = products.filter((p) => p.isNewArrival || p.isFeatured);
      return (featured.length >= 4 ? featured : products).slice(0, 4);
    }
    const target = activeCatalogueFilter.toLowerCase();
    return products
      .filter(
        (p) =>
          p.masterCategory?.toLowerCase() === target ||
          p.category?.toLowerCase().includes(target) ||
          (p.categories && p.categories.some((c) => c.toLowerCase() === target))
      )
      .slice(0, 4);
  }, [products, activeCatalogueFilter]);

  const premiumSpotlight = useMemo(() => {
    return (
      products.find((p) => p.slug === "calacatta-viola-riserva") ||
      products[0] ||
      null
    );
  }, [products]);

  const activeInspirations = useMemo(() => {
    return inspirations && inspirations.length > 0
      ? inspirations
      : INSPIRATION_PROJECTS;
  }, [inspirations]);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setSubmitError(null);
    setSubmittedReference(null);

    try {
      const response = await candelaApi.submitEnquiry({
        clientName: enquiryForm.name,
        role: "Architect / Interior Designer",
        phoneWhatsApp: enquiryForm.phone,
        email: enquiryForm.email,
        projectCity: "Mumbai / Navi Mumbai",
        projectTimeline: "1-3 Months",
        website: enquiryForm.website,
        notes: [
          `Category: ${enquiryForm.productOrCategory}`,
          `Area / units: ${enquiryForm.approximateAreaSqft || "Not specified"}`,
          `Room / application: ${enquiryForm.roomOrApplication}`,
          `Preferred contact: ${enquiryForm.preferredContact}`,
          enquiryForm.message,
        ]
          .filter(Boolean)
          .join("\n"),
        items: [],
      });
      setSubmittedReference(response.referenceCode);
      setEnquiryForm({
        name: "",
        phone: "",
        email: "",
        productOrCategory: "Italian Marble Slabs",
        approximateAreaSqft: "",
        roomOrApplication: "Living Room Flooring",
        message: "",
        preferredContact: "WhatsApp",
        website: "",
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "We could not submit your enquiry. Please try again."
      );
    } finally {
      setFormSubmitted(false);
    }
  };

  const pillarIcons = [Compass, Building2, Shield, MessageCircle, Star, Sparkles];

  const defaultWhyCandelaPillars = [
    {
      id: "pillar-1",
      title: "Direct Quarry Inspection",
      desc: "Every lot of marble and travertine is hand-inspected in Carrara, Tivoli, and Verona for consistent veining density before container loading.",
      description:
        "Every lot of marble and travertine is hand-inspected in Carrara, Tivoli, and Verona for consistent veining density before container loading.",
    },
    {
      id: "pillar-2",
      title: "Dry-Lay Verification",
      desc: "We mock-up sequential bookmatched slabs in our Bhiwandi slab yard, allowing architects to approve exact vein intersections prior to site cutting.",
      description:
        "We mock-up sequential bookmatched slabs in our Bhiwandi slab yard, allowing architects to approve exact vein intersections prior to site cutting.",
    },
    {
      id: "pillar-3",
      title: "Technical Surface Precision",
      desc: "Full physical test data (water absorption, slip rating R9–R11, Mohs hardness) provided transparently with every architectural quotation.",
      description:
        "Full physical test data (water absorption, slip rating R9–R11, Mohs hardness) provided transparently with every architectural quotation.",
    },
    {
      id: "pillar-4",
      title: "Dedicated Trade Desk",
      desc: "Rapid BOQ estimation, sample delivery to your studio within 48 hours in Mumbai/Pune, and continuous WhatsApp project tracking.",
      description:
        "Rapid BOQ estimation, sample delivery to your studio within 48 hours in Mumbai/Pune, and continuous WhatsApp project tracking.",
    },
  ];

  const activePillars =
    homePageCms.whyCandelaPillars && homePageCms.whyCandelaPillars.length > 0
      ? homePageCms.whyCandelaPillars
      : defaultWhyCandelaPillars;

  return (
    <div className="flex flex-col bg-candela-bg text-candela-text">
      {/* =========================================================================
          0. ARCHITECTURAL ANNOUNCEMENT STRIP
      ========================================================================= */}
      {homePageCms.showAnnouncement !== false && (
        <div className="bg-[#1B1917] text-[#E6E1D8] border-b border-white/10 px-6 py-2.5 text-center font-mono text-[11px] tracking-[0.18em] uppercase">
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-candela-accent" aria-hidden="true" />
            {homePageCms.announcementText ||
              "Bhiwandi Slab Gallery & Navi Mumbai Experience Centre • Dry-Lay Inspection Available"}
          </span>
        </div>
      )}

      {/* =========================================================================
          1. ARCHITECTURAL ATELIER HERO (Asymmetric 12-Col Editorial Grid)
      ========================================================================= */}
      {homePageCms.showHero !== false && (
        <section className="relative overflow-hidden bg-[#1D1B18] text-candela-bg border-b border-candela-border/30">
          {/* Subtle Architectural Grid Overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-7xl px-6 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Editorial Column */}
            <div className="lg:col-span-7 space-y-7">
              <div className="inline-flex items-center gap-2.5 border border-candela-accent/40 bg-white/[0.04] px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-candela-accent">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{homePageCms.heroTagline || "Tiles • Marble • Bathware • Hardware"}</span>
              </div>

              <h1 className="font-heading text-4xl sm:text-6xl xl:text-[4.25rem] font-normal tracking-tight text-white leading-[1.06]">
                {homePageCms.heroTitle || "Premium Surfaces. Thoughtfully Selected."}
              </h1>

              <p className="max-w-xl text-sm sm:text-base text-[#D7D2C8] leading-relaxed font-light">
                {homePageCms.heroDescription ||
                  "Monolithic Italian marble, large-format porcelain slabs, bespoke bathware, and architectural brass hardware curated for discerning architects and homeowners."}
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  href={homePageCms.heroCtaPrimaryUrl || "/shop"}
                  className="inline-flex items-center justify-center gap-3 bg-candela-accent px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white motion-safe:transition-colors hover:bg-white hover:text-candela-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-candela-accent"
                >
                  <span>{homePageCms.heroCtaPrimaryText || "Explore Collection"}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>

                <Link
                  href={homePageCms.heroCtaSecondaryUrl || "/contact"}
                  className="inline-flex items-center justify-center gap-2.5 border border-white/25 bg-white/[0.03] px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#F8F5F0] motion-safe:transition-colors hover:border-candela-accent hover:text-candela-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-candela-accent"
                >
                  <MapPin className="h-4 w-4 text-candela-accent" aria-hidden="true" />
                  <span>{homePageCms.heroCtaSecondaryText || "Visit Showroom"}</span>
                </Link>

                <Link
                  href="/visualizer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-mono uppercase tracking-widest text-candela-accent hover:text-white motion-safe:transition-colors"
                >
                  <Box className="h-4 w-4" aria-hidden="true" />
                  <span>3D Studio</span>
                </Link>
              </div>

              {/* Quick Access Architectural Category Strip */}
              <div className="pt-4 border-t border-white/10">
                <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#A8A298] mb-3">
                  Direct Department Shortcuts
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Italian Marble", href: "/shop/marbles" },
                    { label: "Porcelain Slabs", href: "/shop/tiles" },
                    { label: "Sanitaryware", href: "/shop/sanitaryware" },
                    { label: "Faucets & Showers", href: "/shop/faucets" },
                    { label: "Solid Brass Hardware", href: "/shop/hardware" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="border border-white/15 bg-white/[0.03] px-3.5 py-1.5 font-mono text-[11px] text-[#E6E1D8] hover:border-candela-accent hover:text-candela-accent motion-safe:transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Visual Showcase Column (LCP Candidate with fetchPriority="high") */}
            <div className="lg:col-span-5">
              <div className="relative border border-white/15 bg-[#12100E] p-2.5 shadow-2xl">
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <img
                    src={homePageCms.heroBgImage}
                    alt="Candela Architectural Marble & Tile Gallery Showcase"
                    fetchPriority="high"
                    width={900}
                    height={1125}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

                  {/* Overlaid Quarry Lot Badge */}
                  {premiumSpotlight && (
                    <div className="absolute bottom-4 left-4 right-4 border border-white/15 bg-black/75 backdrop-blur-md p-4 flex items-center justify-between gap-4">
                      <div>
                        <span className="block font-mono text-[10px] uppercase tracking-widest text-candela-accent">
                          Featured Quarry Lot
                        </span>
                        <p className="font-heading text-lg text-white">
                          {premiumSpotlight.name}
                        </p>
                        <span className="font-mono text-[11px] text-[#B8B2A8]">
                          {premiumSpotlight.origin} • {premiumSpotlight.dimensionsMm}
                        </span>
                      </div>
                      <Link
                        href={`/product/${premiumSpotlight.slug}`}
                        aria-label={`View ${premiumSpotlight.name}`}
                        className="shrink-0 h-10 w-10 flex items-center justify-center border border-candela-accent/60 text-candela-accent hover:bg-candela-accent hover:text-white motion-safe:transition-colors"
                      >
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Architectural Metrics Bar */}
          <div className="border-t border-white/10 bg-black/30">
            <div className="mx-auto max-w-7xl px-6 py-5 grid grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
              <div className="border-l border-candela-accent/40 pl-4">
                <span className="block font-heading text-xl text-white">50+ Quarry Lots</span>
                <span className="font-mono text-[11px] text-[#A8A298]">Carrara • Tivoli • Verona</span>
              </div>
              <div className="border-l border-candela-accent/40 pl-4">
                <span className="block font-heading text-xl text-white">3,200 × 1,600 mm</span>
                <span className="font-mono text-[11px] text-[#A8A298]">Monolithic Bookmatch Slabs</span>
              </div>
              <div className="border-l border-candela-accent/40 pl-4">
                <span className="block font-heading text-xl text-white">Dry-Lay Yard</span>
                <span className="font-mono text-[11px] text-[#A8A298]">Bhiwandi Vein Inspection</span>
              </div>
              <div className="border-l border-candela-accent/40 pl-4">
                <span className="block font-heading text-xl text-white">48h Studio Dispatch</span>
                <span className="font-mono text-[11px] text-[#A8A298]">Sample Swatches Across MMR</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          2. LIVE CURATED CATALOGUE EXPLORER (Interactive Category Filter Pills)
      ========================================================================= */}
      {homePageCms.showNewArrivals !== false && (
        <section className="mx-auto max-w-7xl px-6 py-20 w-full border-b border-candela-border">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-candela-accent">
                {homePageCms.newArrivalsEyebrow || "2026 Live Inventory"}
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-semibold tracking-wide mt-1">
                {homePageCms.newArrivalsTitle || "New Arrivals & Active Lots"}
              </h2>
            </div>

            {/* Interactive Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter catalogue products by department">
              {CATALOGUE_PILLS.map((pill) => {
                const isSelected = activeCatalogueFilter === pill.id;
                return (
                  <button
                    key={pill.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActiveCatalogueFilter(pill.id)}
                    className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border motion-safe:transition-colors cursor-pointer min-h-[40px] ${
                      isSelected
                        ? "bg-candela-dark text-white border-candela-dark font-semibold"
                        : "bg-candela-surface text-candela-secondary border-candela-border hover:border-candela-accent hover:text-candela-text"
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="border border-candela-border bg-candela-surface p-12 text-center">
              <p className="font-heading text-xl text-candela-text">
                No immediate matches in this department preview.
              </p>
              <Link
                href="/shop"
                className="mt-4 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-candela-accent hover:underline"
              >
                <span>Browse full architectural archive</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          )}

          <div className="mt-10 flex justify-center">
            <Link
              href={
                activeCatalogueFilter === "all"
                  ? "/shop"
                  : `/shop/${activeCatalogueFilter.toLowerCase()}`
              }
              className="inline-flex items-center gap-3 border border-candela-dark px-8 py-3.5 text-xs font-mono uppercase tracking-[0.18em] text-candela-dark hover:bg-candela-dark hover:text-white motion-safe:transition-colors"
            >
              <span>View Full Department Catalogue</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}

      {/* =========================================================================
          3. ASYMMETRIC BENTO GRID — SHOP BY CATEGORY
      ========================================================================= */}
      {homePageCms.showCategories !== false && (
        <section className="bg-candela-surface/45 border-b border-candela-border py-20 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-candela-accent">
                  {homePageCms.categoriesEyebrow || "Core Catalogue"}
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl font-semibold tracking-wide mt-1">
                  {homePageCms.categoriesTitle || "Shop by Architectural Category"}
                </h2>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-candela-accent hover:underline font-semibold"
              >
                <span>All 7 Departments</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {(shopShowcase && shopShowcase.length > 0
                ? shopShowcase.map((live) => {
                    const fallback = MASTER_SHOP_CATEGORIES.find(
                      (m) => m.slug.toLowerCase() === live.slug.toLowerCase()
                    );
                    return {
                      id: live.id,
                      slug: live.slug,
                      name: live.title || fallback?.name || "",
                      description: live.description || fallback?.description || "",
                      imageUrl: live.imageUrl || fallback?.imageUrl || "",
                      rangeCount: live.itemCount || fallback?.subcategories.length || 0,
                    };
                  })
                : MASTER_SHOP_CATEGORIES.map((m) => ({
                    id: m.id,
                    slug: m.slug,
                    name: m.name,
                    description: m.description,
                    imageUrl: m.imageUrl,
                    rangeCount: m.subcategories.length,
                  }))
              ).map((cat, idx) => {
                // First two departments take 6 columns each; next three take 4 each; remaining take 6 each
                const colSpan =
                  idx < 2
                    ? "md:col-span-6"
                    : idx < 5
                    ? "md:col-span-4"
                    : "md:col-span-6";

                return (
                  <Link
                    key={cat.id}
                    href={`/shop/${cat.slug}`}
                    className={`group relative overflow-hidden border border-candela-border bg-candela-bg motion-safe:transition-colors hover:border-candela-accent flex flex-col justify-between ${colSpan}`}
                  >
                    <div
                      className={`relative w-full overflow-hidden bg-candela-dark ${
                        idx < 2 ? "h-72" : "h-56"
                      }`}
                    >
                      <img
                        src={cat.imageUrl}
                        alt={cat.name}
                        loading="lazy"
                        className="h-full w-full object-cover opacity-90 motion-safe:transition-transform motion-safe:duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-candela-dark/85 via-black/20 to-transparent" />
                      <div className="absolute top-3.5 right-3.5 bg-candela-dark/85 backdrop-blur-md px-3 py-1 font-mono text-[10px] text-candela-accent uppercase tracking-wider">
                        {cat.rangeCount} Ranges
                      </div>
                      <div className="absolute bottom-4 left-5 right-5 text-white">
                        <h3 className="font-heading text-2xl font-normal tracking-wide">
                          {cat.name}
                        </h3>
                      </div>
                    </div>

                    <div className="p-5 flex items-center justify-between gap-4">
                      <p className="text-xs text-candela-secondary line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>
                      <span className="shrink-0 h-9 w-9 border border-candela-border flex items-center justify-center text-candela-accent group-hover:bg-candela-accent group-hover:text-white group-hover:border-candela-accent motion-safe:transition-colors">
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          4. UNIFIED INTERACTIVE ARCHITECTURAL DISCOVERY (Spaces • Materials • Styles)
      ========================================================================= */}
      {homePageCms.showSpaces !== false && (
        <section className="mx-auto max-w-7xl px-6 py-20 w-full border-b border-candela-border">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-candela-accent">
                {homePageCms.spacesEyebrow || "Curated Application"}
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-semibold tracking-wide mt-1">
                Explore by Space, Material &amp; Style
              </h2>
            </div>

            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Discovery perspective tabs">
              {EXPLORER_TABS.map((tab) => {
                const active = activeExplorerTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveExplorerTab(tab.id)}
                    className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border cursor-pointer min-h-[40px] motion-safe:transition-colors ${
                      active
                        ? "bg-candela-accent text-white border-candela-accent font-semibold"
                        : "bg-candela-surface text-candela-secondary border-candela-border hover:border-candela-accent"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {activeExplorerTab === "spaces" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {SHOP_SPACES.map((space) => (
                <Link
                  key={space.id}
                  href={`/explore/rooms/${space.slug}`}
                  className="group border border-candela-border bg-candela-surface overflow-hidden hover:border-candela-accent motion-safe:transition-colors"
                >
                  <div className="relative h-56 w-full overflow-hidden bg-candela-dark">
                    <img
                      src={space.imageUrl}
                      alt={space.name}
                      loading="lazy"
                      className="h-full w-full object-cover opacity-90 motion-safe:transition-transform motion-safe:duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-candela-dark/85 via-transparent to-transparent" />
                    <div className="absolute bottom-3.5 left-4 text-white">
                      <h3 className="font-heading text-xl font-normal">{space.name}</h3>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="text-[11px] font-mono text-candela-accent">{space.tagline}</div>
                    <p className="text-xs text-candela-secondary line-clamp-2 leading-relaxed">
                      {space.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {activeExplorerTab === "materials" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {MATERIAL_SHOWCASE.map((mat) => (
                <Link
                  key={mat.id}
                  href={`/material/${mat.slug}`}
                  className="group border border-candela-border bg-candela-surface overflow-hidden hover:border-candela-accent motion-safe:transition-colors flex flex-col justify-between"
                >
                  <div className="relative h-52 w-full overflow-hidden bg-candela-dark">
                    <img
                      src={mat.imageUrl}
                      alt={mat.title}
                      loading="lazy"
                      className="h-full w-full object-cover opacity-90 motion-safe:transition-transform motion-safe:duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 text-white">
                      <span className="font-mono text-[10px] text-candela-accent uppercase">
                        {mat.origin || "Curated Stone"}
                      </span>
                      <h3 className="font-heading text-xl">{mat.title}</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-candela-secondary line-clamp-2">{mat.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {activeExplorerTab === "styles" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {STYLE_SHOWCASE.map((st) => (
                <Link
                  key={st.id}
                  href={`/style/${st.slug}`}
                  className="group border border-candela-border bg-candela-surface overflow-hidden hover:border-candela-accent motion-safe:transition-colors flex flex-col justify-between"
                >
                  <div className="relative h-52 w-full overflow-hidden bg-candela-dark">
                    <img
                      src={st.imageUrl}
                      alt={st.title}
                      loading="lazy"
                      className="h-full w-full object-cover opacity-90 motion-safe:transition-transform motion-safe:duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 text-white">
                      <span className="font-mono text-[10px] text-candela-accent uppercase">
                        {st.tag || "Architectural Aesthetic"}
                      </span>
                      <h3 className="font-heading text-xl">{st.title}</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-candela-secondary line-clamp-2">{st.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {/* =========================================================================
          5. 3D VISUALIZER & 360° QUARRY TURNTABLE STUDIO
      ========================================================================= */}
      {homePageCms.showVisualizer !== false && (
        <section className="bg-[#1B1917] text-candela-bg border-b border-white/10 py-20 px-6 relative overflow-hidden">
          <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 border border-candela-accent/40 bg-white/[0.04] px-3.5 py-1.5 font-mono text-xs text-candela-accent uppercase tracking-widest">
                <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{homePageCms.visualizerEyebrow || "Interactive 3D & 360° Studio"}</span>
              </div>

              <h2 className="font-heading text-3xl sm:text-5xl font-normal tracking-wide text-white leading-tight">
                {homePageCms.visualizerTitle || "Inspect Quarry Slabs with Full 360° Drag & Rotate"}
              </h2>

              <p className="text-sm text-[#D7D2C8] leading-relaxed font-light">
                {homePageCms.visualizerDescription ||
                  "Examine natural stone in continuous 360° turntable spin: inspect the polished front face, calibrated 20mm edge profile, and authentic quarry fiberglass reinforcing mesh before requesting your project quote."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  "Continuous 360° Turntable Spin",
                  "4-Piece Bookmatch Vein Check",
                  "Real-Time 3D Room Surface Swap",
                  "Calibrated 20mm Edge & Mesh View",
                ].map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2.5 border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs text-[#E6E1D8]"
                  >
                    <CheckCircle2 className="h-4 w-4 text-candela-accent shrink-0" aria-hidden="true" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href="/visualizer"
                  className="inline-flex items-center gap-2.5 bg-candela-accent px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-white hover:bg-white hover:text-candela-dark motion-safe:transition-colors"
                >
                  <Box className="h-4 w-4" aria-hidden="true" />
                  <span>Open 3D Room Visualizer</span>
                </Link>
                <Link
                  href="/products/calacatta-viola-riserva#view360"
                  className="inline-flex items-center gap-2.5 border border-white/25 px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-candela-bg hover:border-candela-accent hover:text-candela-accent motion-safe:transition-colors"
                >
                  <RotateCw className="h-3.5 w-3.5 text-candela-accent" aria-hidden="true" />
                  <span>Test 360° Slab Spin</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative border border-white/15 aspect-[4/3] overflow-hidden bg-black/70 shadow-2xl">
                <img
                  src={
                    homePageCms.visualizerImage ||
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
                  }
                  alt="Candela 3D Visualizer Preview"
                  loading="lazy"
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-candela-accent uppercase tracking-widest">
                        Interactive Simulation
                      </span>
                      <h3 className="font-heading text-xl text-white">
                        Living Gallery • Bookmatched Marble Preview
                      </h3>
                    </div>
                    <span className="border border-candela-accent/50 bg-black/60 px-2.5 py-1 font-mono text-[10px] text-candela-accent">
                      PBR 4K
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          6. FEATURED QUARRY COLLECTIONS
      ========================================================================= */}
      {homePageCms.showCollections !== false && (
        <section className="bg-candela-surface/40 border-b border-candela-border py-20 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-candela-accent">
                  {homePageCms.collectionsEyebrow || "Curated Architecture"}
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl font-semibold tracking-wide mt-1">
                  {homePageCms.collectionsTitle || "Featured Collections"}
                </h2>
              </div>
              <Link
                href="/collections"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-candela-accent hover:underline font-semibold"
              >
                <span>All Curated Collections</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activeCollections.slice(0, 3).map((col) => (
                <Link
                  key={col.id}
                  href={`/collections/${col.slug}`}
                  className="group relative overflow-hidden border border-candela-border bg-candela-bg motion-safe:transition-colors hover:border-candela-accent"
                >
                  <div className="relative h-72 w-full overflow-hidden bg-candela-dark">
                    <img
                      src={col.imageUrl}
                      alt={col.title}
                      loading="lazy"
                      className="h-full w-full object-cover opacity-85 motion-safe:transition-transform motion-safe:duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-candela-dark/90 via-black/30 to-transparent" />
                    <div className="absolute bottom-4 left-5 right-5 text-white">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-candela-accent">
                        {col.tag || "Curated Archive"}
                      </span>
                      <h3 className="font-heading text-2xl font-normal mt-1">{col.title}</h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-candela-secondary leading-relaxed line-clamp-2">
                      {col.description}
                    </p>
                    <div className="mt-4 pt-3 border-t border-candela-border flex items-center justify-between text-xs font-mono text-candela-accent">
                      <span>Inspect Slabs &amp; Finishes</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          7. RARE QUARRY LOT SPOTLIGHT
      ========================================================================= */}
      {homePageCms.showSpotlight !== false && premiumSpotlight && (
        <section className="mx-auto max-w-7xl px-6 py-20 w-full border-b border-candela-border">
          <div className="border border-candela-border bg-[#1E1C19] text-candela-bg p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-candela-accent">
                {homePageCms.spotlightEyebrow || "Exclusive Quarry Lot"}
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-normal text-white">
                {homePageCms.spotlightTitle || premiumSpotlight.name}
              </h2>
              <p className="text-xs sm:text-sm text-[#D7D2C8] leading-relaxed font-light">
                {homePageCms.spotlightDescription || premiumSpotlight.shortDescription}
              </p>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/10 font-mono text-xs">
                <div>
                  <span className="text-[#9E988E] block text-[10px] uppercase">Quarry Origin</span>
                  <span className="text-white mt-0.5 block">
                    {homePageCms.spotlightOrigin || premiumSpotlight.origin}
                  </span>
                </div>
                <div>
                  <span className="text-[#9E988E] block text-[10px] uppercase">Dimensions</span>
                  <span className="text-white mt-0.5 block">
                    {homePageCms.spotlightDimensions || premiumSpotlight.dimensionsMm}
                  </span>
                </div>
                <div>
                  <span className="text-[#9E988E] block text-[10px] uppercase">Surface Finish</span>
                  <span className="text-white mt-0.5 block">
                    {homePageCms.spotlightFinish || premiumSpotlight.finish}
                  </span>
                </div>
                <div>
                  <span className="text-[#9E988E] block text-[10px] uppercase">Trade Rate</span>
                  <span className="text-candela-accent font-bold mt-0.5 block">
                    {homePageCms.spotlightPrice ||
                      `₹${premiumSpotlight.pricePerSqftInr.toLocaleString("en-IN")}/sq.ft`}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  href={`/product/${premiumSpotlight.slug}`}
                  className="inline-flex items-center gap-2 bg-candela-accent px-7 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white hover:text-candela-dark motion-safe:transition-colors"
                >
                  <span>Inspect Full Slab Datasheet</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 relative aspect-[4/3] overflow-hidden border border-white/15">
              <img
                src={homePageCms.spotlightImage || premiumSpotlight.media.primaryImage}
                alt={homePageCms.spotlightTitle || premiumSpotlight.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          8. REALIZED ARCHITECTURAL WORKS (INSPIRATION CASE STUDIES)
      ========================================================================= */}
      {homePageCms.showInspiration !== false && (
        <section className="bg-candela-surface/40 border-b border-candela-border py-20 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-candela-accent">
                  {homePageCms.inspirationEyebrow || "Realized Works"}
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl font-semibold tracking-wide mt-1">
                  {homePageCms.inspirationTitle || "Architectural Case Studies"}
                </h2>
              </div>
              <Link
                href="/inspiration"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-candela-accent hover:underline font-semibold"
              >
                <span>All Completed Projects</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {activeInspirations.slice(0, 4).map((proj) => (
                <article
                  key={proj.id}
                  className="group border border-candela-border bg-candela-bg overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative h-64 w-full overflow-hidden bg-candela-dark">
                    <img
                      src={proj.imageUrl}
                      alt={proj.title}
                      loading="lazy"
                      className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-candela-dark/85 via-transparent to-transparent" />
                    <div className="absolute top-3.5 left-3.5 bg-candela-dark/90 px-3 py-1 font-mono text-[10px] text-candela-accent uppercase tracking-wider">
                      {proj.location}
                    </div>
                    <div className="absolute bottom-4 left-5 right-5 text-white">
                      <span className="font-mono text-[10px] uppercase text-candela-accent">
                        {proj.category}
                      </span>
                      <h3 className="font-heading text-xl font-normal">{proj.title}</h3>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <p className="text-xs text-candela-secondary leading-relaxed">
                      {proj.description}
                    </p>

                    <div className="pt-3 border-t border-candela-border flex items-center justify-between gap-4 text-xs">
                      <div className="flex flex-wrap gap-1.5 font-mono text-[10px] text-candela-text">
                        {proj.productsUsed.map((p) => (
                          <span
                            key={p}
                            className="bg-candela-surface px-2.5 py-1 border border-candela-border"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                      <Link
                        href="/inspiration"
                        className="shrink-0 text-candela-accent font-mono text-xs hover:underline inline-flex items-center gap-1"
                      >
                        <span>Details</span>
                        <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          9. THE CANDELA TECHNICAL STANDARD (Numbered Editorial Pillars)
      ========================================================================= */}
      {homePageCms.showWhyCandela !== false && (
        <section className="bg-candela-bg border-b border-candela-border py-20 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl mb-14 space-y-3">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-candela-accent">
                {homePageCms.whyCandelaEyebrow || "Architectural Standard"}
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-semibold tracking-wide">
                {homePageCms.whyCandelaTitle || "Why Candela Tiles & Marbles"}
              </h2>
              <p className="text-xs sm:text-sm text-candela-secondary leading-relaxed">
                {homePageCms.whyCandelaDescription ||
                  "We bridge European stone quarries and premier Indian manufacturing with hands-on architectural advisory."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {activePillars.map((pillar, idx) => {
                const IconComponent = pillarIcons[idx % pillarIcons.length] || Compass;
                return (
                  <div
                    key={pillar.id || idx}
                    className="border-t-2 border-candela-accent/70 pt-6 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-candela-accent">
                        0{idx + 1}
                      </span>
                      <IconComponent className="h-5 w-5 text-candela-accent" aria-hidden="true" />
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-candela-text">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-candela-secondary leading-relaxed">
                      {pillar.description || pillar.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          10. PROJECT CONCIERGE & ACCESSIBLE ENQUIRY ATELIER
      ========================================================================= */}
      {homePageCms.showEnquiry !== false && (
        <section className="bg-candela-surface/65 py-20 px-6 border-b border-candela-border" id="enquiry">
          <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Concierge Info Column */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-candela-accent">
                  {homePageCms.enquiryEyebrow || "Bespoke Quotation"}
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl font-semibold tracking-wide mt-1">
                  {homePageCms.enquiryTitle || "Request a Project Enquiry"}
                </h2>
                <p className="mt-3 text-xs sm:text-sm text-candela-secondary leading-relaxed">
                  {homePageCms.enquiryDescription ||
                    "Share your project requirements, target room, or approximate square footage. Our technical advisors will prepare a detailed BOQ estimate and arrange studio swatches."}
                </p>
              </div>

              <div className="border-t border-candela-border pt-6 space-y-5 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-candela-accent shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <strong className="block font-heading text-sm text-candela-text">
                      Bhiwandi Slab Gallery &amp; Dry-Lay Yard
                    </strong>
                    <span className="text-candela-secondary">
                      {homePageCms.bhiwandiAddress ||
                        "Plot 14, Architectural Stone Hub, Mumbai-Nashik Highway, Bhiwandi."}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building2 className="h-4 w-4 text-candela-accent shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <strong className="block font-heading text-sm text-candela-text">
                      Navi Mumbai Experience Centre
                    </strong>
                    <span className="text-candela-secondary">
                      {homePageCms.naviMumbaiAddress ||
                        "Plot 22, MIDC Industrial Area, Turbhe, Navi Mumbai."}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-candela-accent shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <strong className="block font-heading text-sm text-candela-text">
                      Showroom Hours
                    </strong>
                    <span className="text-candela-secondary">
                      {homePageCms.openingHours ||
                        "Mon – Sat: 10:00 AM – 7:30 PM (Sun by Appointment)"}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <a
                    href={`tel:${(homePageCms.phone || "+919820144812").replace(/\s+/g, "")}`}
                    className="inline-flex items-center gap-2 border border-candela-border bg-candela-bg px-4 py-2.5 font-mono text-xs text-candela-text hover:border-candela-accent motion-safe:transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5 text-candela-accent" aria-hidden="true" />
                    <span>{homePageCms.phone || "+91 98201 44812"}</span>
                  </a>

                  <a
                    href="https://wa.me/919820144812"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#1A4D2E] px-4 py-2.5 font-mono text-xs text-white hover:bg-[#133A22] motion-safe:transition-colors"
                  >
                    <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Direct WhatsApp Desk</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Accessible Form Container */}
            <div className="lg:col-span-7 border border-candela-border bg-candela-bg p-6 sm:p-10 shadow-sm">
              <div role="status" aria-live="polite">
                {submittedReference && (
                  <div className="mb-6 border border-emerald-400 bg-emerald-50 px-4 py-3.5 text-sm text-emerald-950 flex items-center justify-between gap-4">
                    <div>
                      <strong className="font-semibold block">Enquiry logged in database.</strong>
                      <span>
                        Tracking reference:{" "}
                        <a
                          className="font-mono font-semibold underline"
                          href={`/enquiry/track/${submittedReference}`}
                        >
                          {submittedReference}
                        </a>
                      </span>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-emerald-700 shrink-0" aria-hidden="true" />
                  </div>
                )}

                {submitError && (
                  <div className="mb-6 border border-red-400 bg-red-50 px-4 py-3.5 text-sm text-red-900">
                    {submitError}
                  </div>
                )}
              </div>

              <form onSubmit={handleEnquirySubmit} className="space-y-6" aria-label="Project Enquiry Form">
                {/* Accessible bot honeypot (hidden from human & screen-reader users) */}
                <div className="sr-only" aria-hidden="true">
                  <label htmlFor="enq-website">Leave this field blank</label>
                  <input
                    id="enq-website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={enquiryForm.website}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, website: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="enq-name"
                      className="block text-xs font-mono uppercase tracking-wider text-candela-text mb-1.5"
                    >
                      Full Name <span aria-hidden="true" className="text-candela-accent">*</span>
                    </label>
                    <input
                      id="enq-name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="e.g. Ar. Ananya Sharma"
                      value={enquiryForm.name}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                      className="w-full min-h-[48px] border border-candela-border bg-candela-surface px-4 py-2.5 text-base sm:text-sm text-candela-text focus:border-candela-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-candela-accent"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="enq-phone"
                      className="block text-xs font-mono uppercase tracking-wider text-candela-text mb-1.5"
                    >
                      Phone / WhatsApp <span aria-hidden="true" className="text-candela-accent">*</span>
                    </label>
                    <input
                      id="enq-phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      required
                      autoComplete="tel"
                      placeholder="+91 98201 XXXXX"
                      value={enquiryForm.phone}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                      className="w-full min-h-[48px] border border-candela-border bg-candela-surface px-4 py-2.5 text-base sm:text-sm text-candela-text focus:border-candela-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-candela-accent"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="enq-email"
                      className="block text-xs font-mono uppercase tracking-wider text-candela-text mb-1.5"
                    >
                      Email Address
                    </label>
                    <input
                      id="enq-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      autoCapitalize="none"
                      spellCheck={false}
                      placeholder="name@studio.in"
                      value={enquiryForm.email}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                      className="w-full min-h-[48px] border border-candela-border bg-candela-surface px-4 py-2.5 text-base sm:text-sm text-candela-text focus:border-candela-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-candela-accent"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="enq-category"
                      className="block text-xs font-mono uppercase tracking-wider text-candela-text mb-1.5"
                    >
                      Surface Category
                    </label>
                    <select
                      id="enq-category"
                      name="productOrCategory"
                      value={enquiryForm.productOrCategory}
                      onChange={(e) =>
                        setEnquiryForm({ ...enquiryForm, productOrCategory: e.target.value })
                      }
                      className="w-full min-h-[48px] border border-candela-border bg-candela-surface px-4 py-2.5 text-base sm:text-sm text-candela-text focus:border-candela-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-candela-accent"
                    >
                      <option value="Italian Marble Slabs">Italian Marble Slabs</option>
                      <option value="Vitrified Porcelain Tiles">Vitrified Porcelain Tiles</option>
                      <option value="Sintered Stone Countertops">Sintered Stone Countertops</option>
                      <option value="Luxury Sanitaryware & Basins">Luxury Sanitaryware &amp; Basins</option>
                      <option value="Architectural Faucets & Showers">Architectural Faucets &amp; Showers</option>
                      <option value="Door & Cabinet Hardware">Door &amp; Cabinet Hardware</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="enq-area"
                      className="block text-xs font-mono uppercase tracking-wider text-candela-text mb-1.5"
                    >
                      Approximate Area (Sq.Ft / Units)
                    </label>
                    <input
                      id="enq-area"
                      name="approximateAreaSqft"
                      type="text"
                      placeholder="e.g. 1,200 sq.ft or 3 bathrooms"
                      value={enquiryForm.approximateAreaSqft}
                      onChange={(e) =>
                        setEnquiryForm({ ...enquiryForm, approximateAreaSqft: e.target.value })
                      }
                      className="w-full min-h-[48px] border border-candela-border bg-candela-surface px-4 py-2.5 text-base sm:text-sm text-candela-text focus:border-candela-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-candela-accent"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="enq-space"
                      className="block text-xs font-mono uppercase tracking-wider text-candela-text mb-1.5"
                    >
                      Target Space
                    </label>
                    <select
                      id="enq-space"
                      name="roomOrApplication"
                      value={enquiryForm.roomOrApplication}
                      onChange={(e) =>
                        setEnquiryForm({ ...enquiryForm, roomOrApplication: e.target.value })
                      }
                      className="w-full min-h-[48px] border border-candela-border bg-candela-surface px-4 py-2.5 text-base sm:text-sm text-candela-text focus:border-candela-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-candela-accent"
                    >
                      <option value="Living Room Flooring">Living Room Flooring</option>
                      <option value="Master Bathroom Sanctuary">Master Bathroom Sanctuary</option>
                      <option value="Kitchen Island & Counters">Kitchen Island &amp; Counters</option>
                      <option value="Outdoor Patio & Deck">Outdoor Patio &amp; Deck</option>
                      <option value="Commercial Lobby / Retail">Commercial Lobby / Retail</option>
                      <option value="Entire Villa / Residence">Entire Villa / Residence</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="enq-notes"
                    className="block text-xs font-mono uppercase tracking-wider text-candela-text mb-1.5"
                  >
                    Project Specifics &amp; Vein Preferences
                  </label>
                  <textarea
                    id="enq-notes"
                    name="message"
                    rows={3}
                    placeholder="Mention specific vein preferences (e.g. bookmatched Calacatta), delivery timelines, or site location..."
                    value={enquiryForm.message}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                    className="w-full border border-candela-border bg-candela-surface px-4 py-3 text-base sm:text-sm text-candela-text focus:border-candela-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-candela-accent"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <fieldset className="flex flex-wrap items-center gap-4 text-xs font-mono text-candela-secondary">
                    <legend className="sr-only">Preferred Contact Method</legend>
                    <span className="text-candela-text">Preferred Contact:</span>
                    <label className="inline-flex items-center gap-2 cursor-pointer py-1">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="WhatsApp"
                        className="accent-candela-accent h-4 w-4"
                        checked={enquiryForm.preferredContact === "WhatsApp"}
                        onChange={(e) =>
                          setEnquiryForm({ ...enquiryForm, preferredContact: e.target.value })
                        }
                      />
                      <span>WhatsApp</span>
                    </label>
                    <label className="inline-flex items-center gap-2 cursor-pointer py-1">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="Phone Call"
                        className="accent-candela-accent h-4 w-4"
                        checked={enquiryForm.preferredContact === "Phone Call"}
                        onChange={(e) =>
                          setEnquiryForm({ ...enquiryForm, preferredContact: e.target.value })
                        }
                      />
                      <span>Phone Call</span>
                    </label>
                  </fieldset>

                  <button
                    type="submit"
                    disabled={formSubmitted}
                    className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 bg-candela-accent px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-white hover:bg-candela-dark motion-safe:transition-colors cursor-pointer disabled:opacity-60"
                  >
                    <Send className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{formSubmitted ? "Logging Enquiry..." : "Submit Project Enquiry"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
