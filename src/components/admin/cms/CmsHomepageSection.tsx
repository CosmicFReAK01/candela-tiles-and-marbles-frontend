"use client";

import React, { useState } from "react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useCandelaStore } from "@/context/CandelaStoreContext";
import {
  Monitor,
  Tablet,
  Smartphone,
  Save,
  Plus,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Layers,
  Trash2,
} from "lucide-react";

interface Props {
  onToast: (message: string) => void;
}

export function CmsHomepageSection({ onToast }: Props) {
  const { homePageCms, updateHomePageCms } = useCandelaStore();
  const [deviceViewport, setDeviceViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const [heroTagline, setHeroTagline] = useState(homePageCms.heroTagline || "Tiles • Marble • Bathware • Hardware");
  const [heroTitle, setHeroTitle] = useState(homePageCms.heroTitle || "Premium Surfaces. Thoughtfully Selected.");
  const [heroDescription, setHeroDescription] = useState(homePageCms.heroDescription || "");
  const [heroBgImage, setHeroBgImage] = useState(homePageCms.heroBgImage || "");
  const [announcementText, setAnnouncementText] = useState(homePageCms.announcementText || "");
  const [ctaPrimaryText, setCtaPrimaryText] = useState(homePageCms.heroCtaPrimaryText || "Explore Collection");
  const [ctaPrimaryUrl, setCtaPrimaryUrl] = useState(homePageCms.heroCtaPrimaryUrl || "/shop");
  const [ctaSecondaryText, setCtaSecondaryText] = useState(homePageCms.heroCtaSecondaryText || "Visit Showroom");
  const [ctaSecondaryUrl, setCtaSecondaryUrl] = useState(homePageCms.heroCtaSecondaryUrl || "/contact");

  // Section Visibility Toggles
  const [showHero, setShowHero] = useState(homePageCms.showHero !== false);
  const [showAnnouncement, setShowAnnouncement] = useState(homePageCms.showAnnouncement !== false);
  const [showCategories, setShowCategories] = useState(homePageCms.showCategories !== false);
  const [showCollections, setShowCollections] = useState(homePageCms.showCollections !== false);
  const [showSpaces, setShowSpaces] = useState(homePageCms.showSpaces !== false);
  const [showVisualizer, setShowVisualizer] = useState(homePageCms.showVisualizer !== false);
  const [showNewArrivals, setShowNewArrivals] = useState(homePageCms.showNewArrivals !== false);
  const [showInspiration, setShowInspiration] = useState(homePageCms.showInspiration !== false);
  const [showSpotlight, setShowSpotlight] = useState(homePageCms.showSpotlight !== false);
  const [showWhyCandela, setShowWhyCandela] = useState(homePageCms.showWhyCandela !== false);
  const [showEnquiry, setShowEnquiry] = useState(homePageCms.showEnquiry !== false);

  // Section Headers & Copy
  const [categoriesEyebrow, setCategoriesEyebrow] = useState(homePageCms.categoriesEyebrow || "Core Catalogue");
  const [categoriesTitle, setCategoriesTitle] = useState(homePageCms.categoriesTitle || "Shop by Category");
  const [collectionsEyebrow, setCollectionsEyebrow] = useState(homePageCms.collectionsEyebrow || "Curated Architecture");
  const [collectionsTitle, setCollectionsTitle] = useState(homePageCms.collectionsTitle || "Featured Collections");
  const [spacesEyebrow, setSpacesEyebrow] = useState(homePageCms.spacesEyebrow || "Spatial Application");
  const [spacesTitle, setSpacesTitle] = useState(homePageCms.spacesTitle || "Shop by Space");
  const [newArrivalsEyebrow, setNewArrivalsEyebrow] = useState(homePageCms.newArrivalsEyebrow || "2026 Quarry Shipments");
  const [newArrivalsTitle, setNewArrivalsTitle] = useState(homePageCms.newArrivalsTitle || "New Arrivals");
  const [inspirationEyebrow, setInspirationEyebrow] = useState(homePageCms.inspirationEyebrow || "Realized Works");
  const [inspirationTitle, setInspirationTitle] = useState(homePageCms.inspirationTitle || "Inspiration & Projects");

  // Spotlight block
  const [spotlightEyebrow, setSpotlightEyebrow] = useState(homePageCms.spotlightEyebrow || "Exclusive Quarry Lot");
  const [spotlightTitle, setSpotlightTitle] = useState(homePageCms.spotlightTitle || "Calacatta Viola Riserva");
  const [spotlightSubtitle, setSpotlightSubtitle] = useState("Exclusive Italian Calacatta Marble");
  const [spotlightDescription, setSpotlightDescription] = useState(
    homePageCms.spotlightDescription ||
      "Hand-quarried in Apuan Alps, Italy. Featuring deep cabernet veining on pure crystalline calcitic ground."
  );
  const [spotlightImage, setSpotlightImage] = useState(
    homePageCms.spotlightImage ||
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80"
  );
  const [spotlightOrigin, setSpotlightOrigin] = useState(homePageCms.spotlightOrigin || "Carrara, Italy");
  const [spotlightDimensions, setSpotlightDimensions] = useState(homePageCms.spotlightDimensions || "1600 x 3200 mm");
  const [spotlightFinish, setSpotlightFinish] = useState(homePageCms.spotlightFinish || "Bookmatched Polished");
  const [spotlightPrice, setSpotlightPrice] = useState(homePageCms.spotlightPrice || "₹1,450");

  // 3D Visualizer block
  const [visualizerEyebrow, setVisualizerEyebrow] = useState(homePageCms.visualizerEyebrow || "Interactive 360° Studio & Inspiration");
  const [visualizerTitle, setVisualizerTitle] = useState(homePageCms.visualizerTitle || "Inspect Quarry Slabs with Full 360° Drag & Rotate");
  const [visualizerSubtitle, setVisualizerSubtitle] = useState(
    homePageCms.visualizerDescription ||
      "Examine natural stone in continuous 360° turntable spin: inspect the polished front face, calibrated 20mm edge profile, and authentic quarry fiberglass reinforcing mesh before requesting your project quote."
  );
  const [visualizerImage, setVisualizerImage] = useState(
    homePageCms.visualizerImage ||
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
  );

  // Why Candela block
  const [whyCandelaEyebrow, setWhyCandelaEyebrow] = useState(homePageCms.whyCandelaEyebrow || "Architectural Standard");
  const [whyCandelaTitle, setWhyCandelaTitle] = useState(homePageCms.whyCandelaTitle || "Why Candela Tiles & Marbles");
  const [whyCandelaDescription, setWhyCandelaDescription] = useState(
    homePageCms.whyCandelaDescription ||
      "We bridge European stone quarries and premier Indian manufacturing with hands-on architectural advisory."
  );
  const [whyCandelaPillars, setWhyCandelaPillars] = useState(
    homePageCms.whyCandelaPillars || [
      { id: "p1", title: "Direct Quarry Inspection", desc: "Every lot of marble and travertine is hand-inspected in Carrara, Tivoli, and Verona for consistent veining density before container loading." },
      { id: "p2", title: "Dry-Lay Verification", desc: "We mock-up sequential bookmatched slabs in our Bhiwandi slab yard, allowing architects to approve exact vein intersections prior to site cutting." },
      { id: "p3", title: "Technical Surface Precision", desc: "Full physical test data (water absorption, slip rating R9–R11, Mohs hardness) provided transparently with every architectural quotation." },
      { id: "p4", title: "Dedicated Trade Desk", desc: "Rapid BOQ estimation, sample delivery to your studio within 48 hours in Mumbai/Pune, and continuous WhatsApp project tracking." },
    ]
  );

  // Showroom & Phone
  const [phone, setPhone] = useState(homePageCms.phone || "+91 98201 44812");
  const [bhiwandiAddress, setBhiwandiAddress] = useState(homePageCms.bhiwandiAddress || "");
  const [naviMumbaiAddress, setNaviMumbaiAddress] = useState(homePageCms.naviMumbaiAddress || "");

  const handleSaveHomepage = async () => {
    try {
      updateHomePageCms({
        heroTagline,
        heroTitle,
        heroDescription,
        heroBgImage,
        announcementText,
        heroCtaPrimaryText: ctaPrimaryText,
        heroCtaPrimaryUrl: ctaPrimaryUrl,
        heroCtaSecondaryText: ctaSecondaryText,
        heroCtaSecondaryUrl: ctaSecondaryUrl,
        phone,
        bhiwandiAddress,
        naviMumbaiAddress,
        showHero,
        showAnnouncement,
        showCategories,
        showCollections,
        showSpaces,
        showVisualizer,
        showNewArrivals,
        showInspiration,
        showSpotlight,
        showWhyCandela,
        showEnquiry,
        categoriesEyebrow,
        categoriesTitle,
        collectionsEyebrow,
        collectionsTitle,
        spacesEyebrow,
        spacesTitle,
        newArrivalsEyebrow,
        newArrivalsTitle,
        inspirationEyebrow,
        inspirationTitle,
        visualizerEyebrow,
        visualizerTitle,
        visualizerDescription: visualizerSubtitle,
        visualizerImage,
        spotlightEyebrow,
        spotlightTitle,
        spotlightDescription,
        spotlightImage,
        spotlightOrigin,
        spotlightDimensions,
        spotlightFinish,
        spotlightPrice,
        whyCandelaEyebrow,
        whyCandelaTitle,
        whyCandelaDescription,
        whyCandelaPillars,
      });

      // Also persist to Supabase PostgreSQL
      const response = await fetch("/api/v1/admin/cms/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionKey: "hero",
          title: heroTitle,
          subtitle: heroTagline,
          description: heroDescription,
          image_url: heroBgImage,
          cta_text: ctaPrimaryText,
          cta_url: ctaPrimaryUrl,
        }),
      });
      if (!response.ok) {
        throw new Error(`CMS save failed (${response.status})`);
      }

      onToast("Homepage CMS changes published live to storefront!");
    } catch (e) {
      console.error(e);
      onToast("Failed to save Homepage CMS to database.");
    }
  };

  return (
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
  {/* Left Panel: Section Editors (7 cols) */}
  <div className="lg:col-span-7 space-y-6">
    {/* Action Bar */}
    <div className="flex items-center justify-between bg-white p-3 rounded-sm border border-gray-200 shadow-xs">
      <span className="text-xs font-mono text-gray-500">
        Editing: <strong className="text-gray-800">Storefront Homepage (All Text, Images &amp; Visibility)</strong>
      </span>
      <button
        type="button"
        onClick={handleSaveHomepage}
        className="inline-flex items-center gap-1.5 bg-[#9E7B47] text-white px-4 py-2 font-mono text-xs uppercase tracking-wider rounded-sm hover:bg-[#856535] transition cursor-pointer shadow-xs font-semibold"
      >
        <Save className="h-3.5 w-3.5" />
        Publish Changes Live
      </button>
    </div>

    {/* SECTION VISIBILITY MATRIX */}
    <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-xs space-y-3">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#9E7B47] font-semibold">
          Homepage Section Visibility Controls
        </span>
        <span className="text-[10px] font-mono text-gray-400">Toggle sections on/off</span>
      </div>
      <p className="text-[11px] text-gray-500">
        Show or hide any section from the customer storefront in real-time:
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs font-mono">
        <label className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200 cursor-pointer hover:bg-gray-100">
          <input
            type="checkbox"
            checked={showHero}
            onChange={(e) => setShowHero(e.target.checked)}
            className="rounded text-[#9E7B47] focus:ring-[#9E7B47]"
          />
          <span className="truncate">Hero Banner</span>
        </label>
        <label className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200 cursor-pointer hover:bg-gray-100">
          <input
            type="checkbox"
            checked={showAnnouncement}
            onChange={(e) => setShowAnnouncement(e.target.checked)}
            className="rounded text-[#9E7B47] focus:ring-[#9E7B47]"
          />
          <span className="truncate">Top Announcement</span>
        </label>
        <label className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200 cursor-pointer hover:bg-gray-100">
          <input
            type="checkbox"
            checked={showCategories}
            onChange={(e) => setShowCategories(e.target.checked)}
            className="rounded text-[#9E7B47] focus:ring-[#9E7B47]"
          />
          <span className="truncate">Shop Categories</span>
        </label>
        <label className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200 cursor-pointer hover:bg-gray-100">
          <input
            type="checkbox"
            checked={showCollections}
            onChange={(e) => setShowCollections(e.target.checked)}
            className="rounded text-[#9E7B47] focus:ring-[#9E7B47]"
          />
          <span className="truncate">Collections</span>
        </label>
        <label className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200 cursor-pointer hover:bg-gray-100">
          <input
            type="checkbox"
            checked={showSpaces}
            onChange={(e) => setShowSpaces(e.target.checked)}
            className="rounded text-[#9E7B47] focus:ring-[#9E7B47]"
          />
          <span className="truncate">Shop by Space</span>
        </label>
        <label className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200 cursor-pointer hover:bg-gray-100">
          <input
            type="checkbox"
            checked={showVisualizer}
            onChange={(e) => setShowVisualizer(e.target.checked)}
            className="rounded text-[#9E7B47] focus:ring-[#9E7B47]"
          />
          <span className="truncate">3D Visualizer</span>
        </label>
        <label className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200 cursor-pointer hover:bg-gray-100">
          <input
            type="checkbox"
            checked={showNewArrivals}
            onChange={(e) => setShowNewArrivals(e.target.checked)}
            className="rounded text-[#9E7B47] focus:ring-[#9E7B47]"
          />
          <span className="truncate">New Arrivals</span>
        </label>
        <label className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200 cursor-pointer hover:bg-gray-100">
          <input
            type="checkbox"
            checked={showInspiration}
            onChange={(e) => setShowInspiration(e.target.checked)}
            className="rounded text-[#9E7B47] focus:ring-[#9E7B47]"
          />
          <span className="truncate">Inspiration</span>
        </label>
        <label className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200 cursor-pointer hover:bg-gray-100">
          <input
            type="checkbox"
            checked={showSpotlight}
            onChange={(e) => setShowSpotlight(e.target.checked)}
            className="rounded text-[#9E7B47] focus:ring-[#9E7B47]"
          />
          <span className="truncate">Spotlight Lot</span>
        </label>
        <label className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200 cursor-pointer hover:bg-gray-100">
          <input
            type="checkbox"
            checked={showWhyCandela}
            onChange={(e) => setShowWhyCandela(e.target.checked)}
            className="rounded text-[#9E7B47] focus:ring-[#9E7B47]"
          />
          <span className="truncate">Why Candela</span>
        </label>
        <label className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200 cursor-pointer hover:bg-gray-100">
          <input
            type="checkbox"
            checked={showEnquiry}
            onChange={(e) => setShowEnquiry(e.target.checked)}
            className="rounded text-[#9E7B47] focus:ring-[#9E7B47]"
          />
          <span className="truncate">Enquiry Form</span>
        </label>
      </div>
    </div>

    {/* SECTION 1: Announcement Bar */}
    <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-xs space-y-3">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#9E7B47] font-semibold">
          Section 1: Storefront Top Announcement Bar
        </span>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${showAnnouncement ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
          {showAnnouncement ? "Enabled" : "Hidden"}
        </span>
      </div>
      <div>
        <label className="block text-[11px] font-mono text-gray-600 mb-1">
          Announcement Text
        </label>
        <input
          type="text"
          value={announcementText}
          onChange={(e) => setAnnouncementText(e.target.value)}
          className="w-full rounded border border-gray-300 p-2 text-xs font-sans text-gray-900 focus:border-[#9E7B47] focus:outline-none"
          placeholder="e.g. Bhiwandi Slab Gallery & Navi Mumbai Experience Centre • Dry-Lay Inspection Available"
        />
      </div>
    </div>

    {/* SECTION 2: Hero Section */}
    <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#9E7B47] font-semibold">
          Section 2: Hero Banner (Text &amp; Photography)
        </span>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${showHero ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
          {showHero ? "Enabled" : "Hidden"}
        </span>
      </div>

      <div>
        <label className="block text-[11px] font-mono text-gray-600 mb-1">
          Hero Tagline Badge
        </label>
        <input
          type="text"
          value={heroTagline}
          onChange={(e) => setHeroTagline(e.target.value)}
          className="w-full rounded border border-gray-300 p-2 text-xs font-mono text-gray-900 focus:border-[#9E7B47] focus:outline-none"
          placeholder="Tiles • Marble • Bathware • Hardware"
        />
      </div>

      <div>
        <label className="block text-[11px] font-mono text-gray-600 mb-1">
          Main Headline (Title)
        </label>
        <input
          type="text"
          value={heroTitle}
          onChange={(e) => setHeroTitle(e.target.value)}
          className="w-full rounded border border-gray-300 p-2 text-sm font-heading font-semibold text-gray-900 focus:border-[#9E7B47] focus:outline-none"
          placeholder="Premium Surfaces. Thoughtfully Selected."
        />
      </div>

      <div>
        <label className="block text-[11px] font-mono text-gray-600 mb-1">
          Sub-description Paragraph
        </label>
        <textarea
          rows={3}
          value={heroDescription}
          onChange={(e) => setHeroDescription(e.target.value)}
          className="w-full rounded border border-gray-300 p-2 text-xs font-sans text-gray-900 focus:border-[#9E7B47] focus:outline-none leading-relaxed"
          placeholder="Curated imported Italian marble slabs, sintered stone, architectural porcelain..."
        />
      </div>

      {/* Hero Image Edit / Delete */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-[11px] font-mono text-gray-600">
            Hero Background Photography (Full Bleed)
          </label>
          {heroBgImage && (
            <button
              type="button"
              onClick={() => setHeroBgImage("")}
              className="text-[10px] font-mono text-red-600 hover:text-red-700 inline-flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="h-3 w-3" />
              Delete Image
            </button>
          )}
        </div>

        <div className="space-y-2">
          <input
            type="text"
            value={heroBgImage}
            onChange={(e) => setHeroBgImage(e.target.value)}
            placeholder="Paste image CDN URL or use uploader below..."
            className="w-full rounded border border-gray-300 p-2 text-xs font-mono text-gray-900 focus:border-[#9E7B47] focus:outline-none"
          />
          <ImageUploader
            currentImageUrl={heroBgImage}
            onImageChange={(url) => setHeroBgImage(url)}
            label="Upload / Replace Hero Photo"
          />
        </div>
      </div>

      {/* Call to Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-100">
        <div>
          <label className="block text-[10px] font-mono text-gray-500 mb-1">Primary CTA Button</label>
          <input
            type="text"
            value={ctaPrimaryText}
            onChange={(e) => setCtaPrimaryText(e.target.value)}
            className="w-full rounded border border-gray-300 p-1.5 text-xs font-mono text-gray-900"
          />
          <input
            type="text"
            value={ctaPrimaryUrl}
            onChange={(e) => setCtaPrimaryUrl(e.target.value)}
            className="w-full rounded border border-gray-300 p-1.5 text-xs font-mono text-gray-500 mt-1"
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono text-gray-500 mb-1">Secondary CTA Button</label>
          <input
            type="text"
            value={ctaSecondaryText}
            onChange={(e) => setCtaSecondaryText(e.target.value)}
            className="w-full rounded border border-gray-300 p-1.5 text-xs font-mono text-gray-900"
          />
          <input
            type="text"
            value={ctaSecondaryUrl}
            onChange={(e) => setCtaSecondaryUrl(e.target.value)}
            className="w-full rounded border border-gray-300 p-1.5 text-xs font-mono text-gray-500 mt-1"
          />
        </div>
      </div>
    </div>

    {/* SECTION 3: Shop by Category Headers */}
    <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#9E7B47] font-semibold">
          Section 3: Core Catalogue (Shop by Category)
        </span>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${showCategories ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
          {showCategories ? "Enabled" : "Hidden"}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-mono text-gray-600 mb-1">Section Eyebrow</label>
          <input
            type="text"
            value={categoriesEyebrow}
            onChange={(e) => setCategoriesEyebrow(e.target.value)}
            className="w-full rounded border border-gray-300 p-2 text-xs font-mono text-gray-900"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono text-gray-600 mb-1">Main Heading</label>
          <input
            type="text"
            value={categoriesTitle}
            onChange={(e) => setCategoriesTitle(e.target.value)}
            className="w-full rounded border border-gray-300 p-2 text-xs font-heading font-semibold text-gray-900"
          />
        </div>
      </div>
    </div>

    {/* SECTION 4: Featured Collections Headers */}
    <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#9E7B47] font-semibold">
          Section 4: Featured Collections
        </span>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${showCollections ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
          {showCollections ? "Enabled" : "Hidden"}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-mono text-gray-600 mb-1">Section Eyebrow</label>
          <input
            type="text"
            value={collectionsEyebrow}
            onChange={(e) => setCollectionsEyebrow(e.target.value)}
            className="w-full rounded border border-gray-300 p-2 text-xs font-mono text-gray-900"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono text-gray-600 mb-1">Main Heading</label>
          <input
            type="text"
            value={collectionsTitle}
            onChange={(e) => setCollectionsTitle(e.target.value)}
            className="w-full rounded border border-gray-300 p-2 text-xs font-heading font-semibold text-gray-900"
          />
        </div>
      </div>
    </div>

    {/* SECTION 5: Shop by Space Headers */}
    <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#9E7B47] font-semibold">
          Section 5: Shop by Space (Spatial Application)
        </span>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${showSpaces ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
          {showSpaces ? "Enabled" : "Hidden"}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-mono text-gray-600 mb-1">Section Eyebrow</label>
          <input
            type="text"
            value={spacesEyebrow}
            onChange={(e) => setSpacesEyebrow(e.target.value)}
            className="w-full rounded border border-gray-300 p-2 text-xs font-mono text-gray-900"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono text-gray-600 mb-1">Main Heading</label>
          <input
            type="text"
            value={spacesTitle}
            onChange={(e) => setSpacesTitle(e.target.value)}
            className="w-full rounded border border-gray-300 p-2 text-xs font-heading font-semibold text-gray-900"
          />
        </div>
      </div>
    </div>

    {/* SECTION 6: 3D Visualizer Banner */}
    <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#9E7B47] font-semibold">
          Section 6: 3D Room Visualizer Teaser Banner
        </span>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${showVisualizer ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
          {showVisualizer ? "Enabled" : "Hidden"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-mono text-gray-600 mb-1">Visualizer Heading</label>
          <input
            type="text"
            value={visualizerTitle}
            onChange={(e) => setVisualizerTitle(e.target.value)}
            className="w-full rounded border border-gray-300 p-2 text-xs font-heading font-semibold text-gray-900"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono text-gray-600 mb-1">Tagline</label>
          <input
            type="text"
            value={visualizerSubtitle}
            onChange={(e) => setVisualizerSubtitle(e.target.value)}
            className="w-full rounded border border-gray-300 p-2 text-xs font-mono text-gray-900"
          />
        </div>
      </div>

      {/* Visualizer Image */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-[11px] font-mono text-gray-600">Visualizer Preview Render Image</label>
          {visualizerImage && (
            <button
              type="button"
              onClick={() => setVisualizerImage("")}
              className="text-[10px] font-mono text-red-600 hover:text-red-700 inline-flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="h-3 w-3" />
              Delete Image
            </button>
          )}
        </div>
        <div className="space-y-2">
          <input
            type="text"
            value={visualizerImage}
            onChange={(e) => setVisualizerImage(e.target.value)}
            className="w-full rounded border border-gray-300 p-2 text-xs font-mono text-gray-900"
          />
          <ImageUploader
            currentImageUrl={visualizerImage}
            onImageChange={(url) => setVisualizerImage(url)}
            label="Upload / Replace Visualizer Image"
          />
        </div>
      </div>
    </div>

    {/* SECTION 7: New Arrivals Headers */}
    <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#9E7B47] font-semibold">
          Section 7: New Arrivals
        </span>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${showNewArrivals ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
          {showNewArrivals ? "Enabled" : "Hidden"}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-mono text-gray-600 mb-1">Section Eyebrow</label>
          <input
            type="text"
            value={newArrivalsEyebrow}
            onChange={(e) => setNewArrivalsEyebrow(e.target.value)}
            className="w-full rounded border border-gray-300 p-2 text-xs font-mono text-gray-900"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono text-gray-600 mb-1">Main Heading</label>
          <input
            type="text"
            value={newArrivalsTitle}
            onChange={(e) => setNewArrivalsTitle(e.target.value)}
            className="w-full rounded border border-gray-300 p-2 text-xs font-heading font-semibold text-gray-900"
          />
        </div>
      </div>
    </div>

    {/* SECTION 8: Inspiration & Projects Headers */}
    <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#9E7B47] font-semibold">
          Section 8: Architectural Inspiration &amp; Projects
        </span>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${showInspiration ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
          {showInspiration ? "Enabled" : "Hidden"}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-mono text-gray-600 mb-1">Section Eyebrow</label>
          <input
            type="text"
            value={inspirationEyebrow}
            onChange={(e) => setInspirationEyebrow(e.target.value)}
            className="w-full rounded border border-gray-300 p-2 text-xs font-mono text-gray-900"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono text-gray-600 mb-1">Main Heading</label>
          <input
            type="text"
            value={inspirationTitle}
            onChange={(e) => setInspirationTitle(e.target.value)}
            className="w-full rounded border border-gray-300 p-2 text-xs font-heading font-semibold text-gray-900"
          />
        </div>
      </div>
    </div>

    {/* SECTION 9: Spotlight Architecture Block */}
    <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#9E7B47] font-semibold">
          Section 9: Architectural Spotlight Lot
        </span>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${showSpotlight ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
          {showSpotlight ? "Enabled" : "Hidden"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-mono text-gray-600 mb-1">Spotlight Title</label>
          <input
            type="text"
            value={spotlightTitle}
            onChange={(e) => setSpotlightTitle(e.target.value)}
            className="w-full rounded border border-gray-300 p-2 text-xs font-heading font-semibold text-gray-900"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono text-gray-600 mb-1">Subtitle</label>
          <input
            type="text"
            value={spotlightSubtitle}
            onChange={(e) => setSpotlightSubtitle(e.target.value)}
            className="w-full rounded border border-gray-300 p-2 text-xs font-mono text-gray-900"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-mono text-gray-600 mb-1">Description</label>
        <textarea
          rows={2}
          value={spotlightDescription}
          onChange={(e) => setSpotlightDescription(e.target.value)}
          className="w-full rounded border border-gray-300 p-2 text-xs font-sans text-gray-900"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        <div>
          <label className="block text-[10px] text-gray-500 mb-1">Origin</label>
          <input
            type="text"
            value={spotlightOrigin}
            onChange={(e) => setSpotlightOrigin(e.target.value)}
            className="w-full rounded border border-gray-300 p-1.5 text-xs font-mono"
          />
        </div>
        <div>
          <label className="block text-[10px] text-gray-500 mb-1">Dimensions</label>
          <input
            type="text"
            value={spotlightDimensions}
            onChange={(e) => setSpotlightDimensions(e.target.value)}
            className="w-full rounded border border-gray-300 p-1.5 text-xs font-mono"
          />
        </div>
        <div>
          <label className="block text-[10px] text-gray-500 mb-1">Finish</label>
          <input
            type="text"
            value={spotlightFinish}
            onChange={(e) => setSpotlightFinish(e.target.value)}
            className="w-full rounded border border-gray-300 p-1.5 text-xs font-mono"
          />
        </div>
        <div>
          <label className="block text-[10px] text-gray-500 mb-1">Price</label>
          <input
            type="text"
            value={spotlightPrice}
            onChange={(e) => setSpotlightPrice(e.target.value)}
            className="w-full rounded border border-gray-300 p-1.5 text-xs font-mono text-[#9E7B47] font-semibold"
          />
        </div>
      </div>

      {/* Spotlight Image */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-[11px] font-mono text-gray-600">Spotlight Feature Photography</label>
          {spotlightImage && (
            <button
              type="button"
              onClick={() => setSpotlightImage("")}
              className="text-[10px] font-mono text-red-600 hover:text-red-700 inline-flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="h-3 w-3" />
              Delete Image
            </button>
          )}
        </div>
        <div className="space-y-2">
          <input
            type="text"
            value={spotlightImage}
            onChange={(e) => setSpotlightImage(e.target.value)}
            className="w-full rounded border border-gray-300 p-2 text-xs font-mono text-gray-900"
          />
          <ImageUploader
            currentImageUrl={spotlightImage}
            onImageChange={(url) => setSpotlightImage(url)}
            label="Upload / Replace Spotlight Image"
          />
        </div>
      </div>
    </div>

    {/* SECTION 10: Why Candela (4 Distinction Pillars) */}
    <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#9E7B47] font-semibold">
          Section 10: Why Candela Architectural Distinction Pillars
        </span>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${showWhyCandela ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
          {showWhyCandela ? "Enabled" : "Hidden"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-mono text-gray-600 mb-1">Section Eyebrow</label>
          <input
            type="text"
            value={whyCandelaEyebrow}
            onChange={(e) => setWhyCandelaEyebrow(e.target.value)}
            className="w-full rounded border border-gray-300 p-2 text-xs font-mono text-gray-900"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono text-gray-600 mb-1">Section Title</label>
          <input
            type="text"
            value={whyCandelaTitle}
            onChange={(e) => setWhyCandelaTitle(e.target.value)}
            className="w-full rounded border border-gray-300 p-2 text-xs font-heading font-semibold text-gray-900"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-mono text-gray-600 mb-1">Section Description</label>
        <textarea
          rows={2}
          value={whyCandelaDescription}
          onChange={(e) => setWhyCandelaDescription(e.target.value)}
          className="w-full rounded border border-gray-300 p-2 text-xs font-sans text-gray-900"
        />
      </div>

      {/* Pillars List */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-gray-600 font-semibold">
            Distinction Pillars ({whyCandelaPillars.length})
          </span>
          <button
            type="button"
            onClick={() =>
              setWhyCandelaPillars([
                ...whyCandelaPillars,
                { id: `p${Date.now()}`, title: "New Distinction Pillar", desc: "Description of the pillar..." },
              ])
            }
            className="inline-flex items-center gap-1 text-[10px] font-mono text-[#9E7B47] hover:underline cursor-pointer"
          >
            <Plus className="h-3 w-3" />
            Add Pillar
          </button>
        </div>

        <div className="space-y-3">
          {whyCandelaPillars.map((pillar, idx) => (
            <div key={pillar.id} className="p-3 bg-gray-50 border border-gray-200 rounded-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#9E7B47] font-semibold">
                  Pillar #{idx + 1}
                </span>
                {whyCandelaPillars.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setWhyCandelaPillars(whyCandelaPillars.filter((p) => p.id !== pillar.id))
                    }
                    className="text-[10px] font-mono text-red-600 hover:text-red-700 cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                type="text"
                value={pillar.title}
                onChange={(e) =>
                  setWhyCandelaPillars(
                    whyCandelaPillars.map((p) =>
                      p.id === pillar.id ? { ...p, title: e.target.value } : p
                    )
                  )
                }
                className="w-full rounded border border-gray-300 p-1.5 text-xs font-semibold text-gray-900"
                placeholder="Pillar Title"
              />
              <textarea
                rows={2}
                value={pillar.desc}
                onChange={(e) =>
                  setWhyCandelaPillars(
                    whyCandelaPillars.map((p) =>
                      p.id === pillar.id ? { ...p, desc: e.target.value } : p
                    )
                  )
                }
                className="w-full rounded border border-gray-300 p-1.5 text-xs font-sans text-gray-700"
                placeholder="Pillar Description"
              />
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* SECTION 11: Contact & Showrooms */}
    <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-xs space-y-3">
      <span className="font-mono text-[11px] uppercase tracking-wider text-[#9E7B47] font-semibold block border-b border-gray-100 pb-2">
        Section 11: Direct Showroom Contacts &amp; Addresses
      </span>
      <div>
        <label className="block text-[11px] font-mono text-gray-600 mb-1">Advisory Desk Phone</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded border border-gray-300 p-2 text-xs font-mono text-gray-900"
        />
      </div>
      <div>
        <label className="block text-[11px] font-mono text-gray-600 mb-1">Bhiwandi Central Yard Address</label>
        <input
          type="text"
          value={bhiwandiAddress}
          onChange={(e) => setBhiwandiAddress(e.target.value)}
          className="w-full rounded border border-gray-300 p-2 text-xs font-sans text-gray-900"
        />
      </div>
      <div>
        <label className="block text-[11px] font-mono text-gray-600 mb-1">Turbhe Experience Studio Address</label>
        <input
          type="text"
          value={naviMumbaiAddress}
          onChange={(e) => setNaviMumbaiAddress(e.target.value)}
          className="w-full rounded border border-gray-300 p-2 text-xs font-sans text-gray-900"
        />
      </div>
    </div>
  </div>

  {/* Right Panel: Live Visual Simulation (5 cols) */}
  <div className="lg:col-span-5 space-y-4">
    <div className="flex items-center justify-between bg-white p-2.5 rounded-sm border border-gray-200">
      <span className="text-xs font-mono font-semibold text-gray-700 flex items-center gap-1.5">
        <Sparkles className="h-3.5 w-3.5 text-[#9E7B47]" />
        Storefront Live Simulation
      </span>
      <div className="flex items-center gap-1 border border-gray-200 rounded p-0.5 bg-gray-50">
        <button
          type="button"
          onClick={() => setDeviceViewport("desktop")}
          className={`p-1 rounded text-xs transition cursor-pointer ${
            deviceViewport === "desktop" ? "bg-[#9E7B47] text-white" : "text-gray-500"
          }`}
          title="Desktop View"
        >
          <Monitor className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setDeviceViewport("tablet")}
          className={`p-1 rounded text-xs transition cursor-pointer ${
            deviceViewport === "tablet" ? "bg-[#9E7B47] text-white" : "text-gray-500"
          }`}
          title="Tablet View"
        >
          <Tablet className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setDeviceViewport("mobile")}
          className={`p-1 rounded text-xs transition cursor-pointer ${
            deviceViewport === "mobile" ? "bg-[#9E7B47] text-white" : "text-gray-500"
          }`}
          title="Mobile View"
        >
          <Smartphone className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>

    {/* Mock Storefront Canvas */}
    <div className="border border-gray-300 rounded-sm bg-neutral-900 p-4 text-white space-y-4 shadow-inner overflow-hidden sticky top-6">
      {/* Announcement Bar */}
      {showAnnouncement && (
        <div className="bg-[#1C1A17] text-amber-200/90 text-[10px] font-mono text-center py-1.5 px-2 border-b border-white/10 truncate">
          {announcementText || "Showroom Announcement Bar Preview"}
        </div>
      )}

      {/* Hero Banner Mock */}
      {showHero && (
        <div className="relative min-h-[220px] rounded border border-white/15 overflow-hidden flex flex-col justify-center items-center text-center p-4">
          {heroBgImage ? (
            <img
              src={heroBgImage}
              alt="Hero Preview"
              className="absolute inset-0 w-full h-full object-cover opacity-45 mix-blend-luminosity"
            />
          ) : (
            <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center text-xs font-mono text-neutral-500">
              [ No Hero Image Selected ]
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
          <div className="relative z-10 space-y-2 max-w-sm">
            <span className="inline-block border border-amber-400/30 bg-black/60 px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest text-[#EADCC9]">
              {heroTagline}
            </span>
            <h2 className="font-heading text-lg font-semibold text-white leading-tight">
              {heroTitle}
            </h2>
            <p className="text-[10px] text-gray-300 font-light line-clamp-2">
              {heroDescription}
            </p>
            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="bg-[#9E7B47] text-white px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider rounded-xs">
                {ctaPrimaryText}
              </span>
              <span className="border border-white/30 text-white px-2 py-1 text-[9px] font-mono uppercase tracking-wider rounded-xs">
                {ctaSecondaryText}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Spotlight Mock */}
      {showSpotlight && (
        <div className="border border-white/10 rounded p-3 bg-neutral-950 flex items-center gap-3">
          {spotlightImage ? (
            <img
              src={spotlightImage}
              alt="Spotlight"
              className="w-16 h-16 object-cover rounded shrink-0 border border-white/20"
            />
          ) : (
            <div className="w-16 h-16 bg-neutral-800 rounded flex items-center justify-center text-[9px] font-mono text-neutral-500 shrink-0">
              No Img
            </div>
          )}
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-amber-300 uppercase">{spotlightSubtitle}</span>
            <h4 className="text-xs font-heading font-semibold text-white truncate">{spotlightTitle}</h4>
            <p className="text-[9px] text-neutral-400 line-clamp-1">{spotlightDescription}</p>
            <span className="text-[9px] font-mono text-[#9E7B47] font-bold block mt-0.5">{spotlightPrice}/sq.ft</span>
          </div>
        </div>
      )}

      {/* Visualizer Mock */}
      {showVisualizer && (
        <div className="border border-white/10 rounded p-3 bg-neutral-950 flex items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-heading font-semibold text-white">{visualizerTitle}</h4>
            <span className="text-[9px] font-mono text-neutral-400 line-clamp-1">{visualizerSubtitle}</span>
          </div>
          {visualizerImage && (
            <img src={visualizerImage} alt="Vis" className="w-12 h-12 object-cover rounded shrink-0 border border-white/20" />
          )}
        </div>
      )}

      {/* Why Candela Mock */}
      {showWhyCandela && (
        <div className="border border-white/10 rounded p-3 bg-neutral-950 space-y-1.5">
          <span className="text-[9px] font-mono text-amber-300 uppercase">{whyCandelaEyebrow}</span>
          <h4 className="text-xs font-heading font-semibold text-white">{whyCandelaTitle}</h4>
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {whyCandelaPillars.slice(0, 4).map((p) => (
              <div key={p.id} className="bg-white/5 p-1.5 rounded text-[9px]">
                <strong className="text-white block font-heading truncate">{p.title}</strong>
                <p className="text-neutral-400 line-clamp-1">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
</div>
  );
}
