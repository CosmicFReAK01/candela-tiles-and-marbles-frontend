"use client";

import React, { useState } from "react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import {
  Save,
  FileText,
  ExternalLink,
  Edit2,
  Trash2,
} from "lucide-react";

interface Props {
  onToast: (message: string) => void;
}

export function CmsPagesSection({ onToast }: Props) {
  interface SitePage {
    slug: string;
    title: string;
    subtitle: string;
    hero_image_url: string;
    content: string;
    is_published: boolean;
    meta_title?: string;
    meta_description?: string;
  }

  const [sitePages, setSitePages] = useState<SitePage[]>([
    {
      slug: "about",
      title: "About Candela Atelier & Heritage",
      subtitle: "Two decades of natural stone curation, direct Italian quarry partnerships, and architectural precision.",
      hero_image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
      content: "Candela surfaces bridge the world's most prestigious European quarries with leading architectural projects across India. We specialize in monolithic Italian marble, sintered stone, architectural porcelain, and bespoke brass hardware.",
      is_published: true,
      meta_title: "About Candela Atelier | Luxury Architectural Surfaces",
      meta_description: "Discover the heritage, quarry direct-sourcing, and architectural advisory of Candela Tiles & Marbles.",
    },
    {
      slug: "contact",
      title: "Showrooms & Experience Studios",
      subtitle: "Bhiwandi Central Logistics Slab Yard & Turbhe Navi Mumbai Experience Studio.",
      hero_image_url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80",
      content: "Visit our dedicated slab viewing facilities to inspect sequential bookmatched slabs under true 5000K daylight simulation. Walk through our living spaces to evaluate tile textures, slip-resistance, and bathware ergonomics.",
      is_published: true,
      meta_title: "Contact & Showrooms | Candela Tiles & Marbles",
      meta_description: "Plan your visit to Candela's Bhiwandi Slab Yard and Turbhe Experience Studio.",
    },
    {
      slug: "inspiration",
      title: "Architectural Projects & Inspiration",
      subtitle: "Curated residential villas, penthouses, and hospitality projects surfaced with Candela materials.",
      hero_image_url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
      content: "Explore real-world case studies showcasing monolithic marble feature walls, seamless bathroom sanctuaries, and high-performance sintered porcelain kitchen islands.",
      is_published: true,
      meta_title: "Architectural Inspiration & Projects | Candela Atelier",
      meta_description: "Explore realized villas and commercial architecture designed with Candela marble and tiles.",
    },
    {
      slug: "visualizer",
      title: "3D Studio & 360° Visualizer",
      subtitle: "Interactive digital surface simulation and 360° slab rotation turntable.",
      hero_image_url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",
      content: "Digitally test slabs in living rooms, master bathrooms, and kitchens before delivery. Rotate quarry lots 360° to inspect face polish, edge profiles, and quarry reinforcing mesh.",
      is_published: true,
      meta_title: "3D Room Visualizer & 360° Studio | Candela Atelier",
      meta_description: "Test marble slabs and large format porcelain in interactive 3D spaces in real-time.",
    },
    {
      slug: "material",
      title: "Material Specifications & Engineering Guide",
      subtitle: "Technical data: water absorption, slip ratings (R9-R11), Mohs hardness, and maintenance.",
      hero_image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
      content: "Architectural specification guide covering natural stone porosity, sealing requirements, porcelain slip resistance ratings, and thermal shock tolerance for facades and pool decks.",
      is_published: true,
      meta_title: "Material Specifications Guide | Candela Atelier",
      meta_description: "Architectural data sheets and installation standards for tiles, marble, and slabs.",
    },
    {
      slug: "enquiry",
      title: "Architectural Concierge & BOQ Estimation",
      subtitle: "Direct quote desk for architects, interior designers, and luxury homeowners.",
      hero_image_url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80",
      content: "Submit your project drawings or BOQ line items for itemized estimation, batch reservation, and studio sample box dispatch within 48 hours.",
      is_published: true,
      meta_title: "Trade Enquiry Desk | Candela Tiles & Marbles",
      meta_description: "Request an architectural quotation and physical sample crate for your upcoming project.",
    },
  ]);

  const [selectedPageSlug, setSelectedPageSlug] = useState<string>("about");
  const selectedPage = sitePages.find((p) => p.slug === selectedPageSlug) || sitePages[0];

  const handleUpdateCurrentPage = (partial: Partial<SitePage>) => {
    setSitePages((prev) =>
      prev.map((p) => (p.slug === selectedPageSlug ? { ...p, ...partial } : p))
    );
  };

  const handleSavePage = async () => {
    try {
      await fetch("/api/v1/admin/cms/pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedPage),
      });
      onToast(`Page '${selectedPage.title}' updated successfully!`);
    } catch (e) {
      console.error(e);
      onToast("Failed to persist page update.");
    }
  };

  return (
<div className="space-y-6">
  {/* Top Info Banner */}
  <div className="bg-amber-50/60 border border-amber-200/80 p-3.5 rounded-sm flex items-center justify-between">
    <div className="flex items-center gap-2">
      <FileText className="h-4 w-4 text-[#9E7B47]" />
      <p className="text-xs text-amber-900 font-sans">
        Manage the core architectural content pages of the website: <strong>About Candela Atelier</strong>, <strong>Showrooms &amp; Experience Studios</strong>, <strong>Inspiration &amp; Projects</strong>, <strong>3D Studio &amp; Visualizer</strong>, <strong>Material Specifications</strong>, and <strong>Trade Enquiry</strong>.
      </p>
    </div>
    <a
      href={`/${selectedPage.slug}`}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 font-mono text-xs text-[#9E7B47] hover:underline cursor-pointer"
    >
      <span>View live on storefront</span>
      <ExternalLink className="h-3 w-3" />
    </a>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
    {/* Left Column: 4 Pages Selector (4 cols) */}
    <div className="lg:col-span-4 space-y-2">
      <span className="font-mono text-xs uppercase tracking-wider text-gray-500 block mb-2 font-semibold">
        Select Architectural Page
      </span>
      {sitePages.map((page) => {
        const isSelected = page.slug === selectedPageSlug;
        return (
          <div
            key={page.slug}
            onClick={() => setSelectedPageSlug(page.slug)}
            className={`p-3.5 rounded-sm border transition cursor-pointer ${
              isSelected
                ? "bg-[#FAF5EE] border-[#9E7B47] shadow-xs"
                : "bg-white border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#9E7B47] font-semibold">
                /{page.slug}
              </span>
              <span
                className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                  page.is_published ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {page.is_published ? "Published" : "Draft"}
              </span>
            </div>
            <h3 className="font-heading text-sm font-semibold text-gray-900 leading-snug">
              {page.title}
            </h3>
            <p className="text-xs text-gray-500 line-clamp-2 mt-1 font-light">
              {page.subtitle}
            </p>
          </div>
        );
      })}
    </div>

    {/* Right Column: Page Content Editor (8 cols) */}
    <div className="lg:col-span-8 bg-white p-6 rounded-sm border border-gray-200 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#9E7B47] font-semibold">
            Editing Page: /{selectedPage.slug}
          </span>
          <h2 className="font-heading text-xl font-semibold text-gray-900">
            {selectedPage.title}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs font-mono text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedPage.is_published}
              onChange={(e) => handleUpdateCurrentPage({ is_published: e.target.checked })}
              className="rounded text-[#9E7B47] focus:ring-[#9E7B47]"
            />
            <span>Live Published</span>
          </label>
          <button
            type="button"
            onClick={handleSavePage}
            className="inline-flex items-center gap-1.5 bg-[#9E7B47] text-white px-4 py-2 font-mono text-xs uppercase tracking-wider rounded-sm hover:bg-[#856535] transition cursor-pointer shadow-xs font-semibold"
          >
            <Save className="h-3.5 w-3.5" />
            Save Page
          </button>
        </div>
      </div>

      {/* Title & Subtitle */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-mono text-gray-600 mb-1">Page Title</label>
          <input
            type="text"
            value={selectedPage.title}
            onChange={(e) => handleUpdateCurrentPage({ title: e.target.value })}
            className="w-full rounded border border-gray-300 p-2 text-sm font-heading font-semibold text-gray-900 focus:border-[#9E7B47] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-600 mb-1">Page Subtitle / Architectural Abstract</label>
          <input
            type="text"
            value={selectedPage.subtitle}
            onChange={(e) => handleUpdateCurrentPage({ subtitle: e.target.value })}
            className="w-full rounded border border-gray-300 p-2 text-xs font-sans text-gray-900 focus:border-[#9E7B47] focus:outline-none"
          />
        </div>
      </div>

      {/* Hero Image */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-mono text-gray-600">Page Hero Photography</label>
          {selectedPage.hero_image_url && (
            <button
              type="button"
              onClick={() => handleUpdateCurrentPage({ hero_image_url: "" })}
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
            value={selectedPage.hero_image_url}
            onChange={(e) => handleUpdateCurrentPage({ hero_image_url: e.target.value })}
            className="w-full rounded border border-gray-300 p-2 text-xs font-mono text-gray-900 focus:border-[#9E7B47] focus:outline-none"
            placeholder="https://..."
          />
          <ImageUploader
            currentImageUrl={selectedPage.hero_image_url}
            onImageChange={(url) => handleUpdateCurrentPage({ hero_image_url: url })}
            label="Upload / Replace Page Hero Image"
          />
        </div>
      </div>

      {/* Body Content */}
      <div>
        <label className="block text-xs font-mono text-gray-600 mb-1">
          Page Content / Technical Specifications (Markdown Supported)
        </label>
        <textarea
          rows={6}
          value={selectedPage.content}
          onChange={(e) => handleUpdateCurrentPage({ content: e.target.value })}
          className="w-full rounded border border-gray-300 p-2 text-xs font-mono text-gray-900 focus:border-[#9E7B47] focus:outline-none leading-relaxed"
        />
      </div>

      {/* SEO Meta */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-100">
        <div>
          <label className="block text-[10px] font-mono text-gray-500 mb-1">SEO Meta Title</label>
          <input
            type="text"
            value={selectedPage.meta_title || ""}
            onChange={(e) => handleUpdateCurrentPage({ meta_title: e.target.value })}
            className="w-full rounded border border-gray-300 p-1.5 text-xs font-mono text-gray-900"
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono text-gray-500 mb-1">SEO Meta Description</label>
          <input
            type="text"
            value={selectedPage.meta_description || ""}
            onChange={(e) => handleUpdateCurrentPage({ meta_description: e.target.value })}
            className="w-full rounded border border-gray-300 p-1.5 text-xs font-sans text-gray-900"
          />
        </div>
      </div>
    </div>
  </div>
</div>
  );
}
