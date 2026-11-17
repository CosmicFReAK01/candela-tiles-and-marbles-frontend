"use client";

import React, { useState } from "react";
import { useCandelaStore } from "@/context/CandelaStoreContext";
import {
  Copy,
  Check,
  ExternalLink,
  Upload,
  Plus,
  RefreshCw,
  Sparkles,
  Layers,
  Home,
  FileText,
  Boxes,
  CheckCircle2,
  X,
  Search,
} from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";

interface ProjectedMediaItem {
  id: string;
  url: string;
  label: string;
  category: "product" | "homepage" | "pages" | "collection" | "visualizer";
  projectedLocations: string[];
  productRef?: any;
}

export function AdminMediaLibraryTab() {
  const { products, updateProduct, homePageCms, updateHomePageCms } = useCandelaStore();

  const [activeFilter, setActiveFilter] = useState<
    "all" | "product" | "homepage" | "pages" | "collection" | "visualizer"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Cascading Replacement State
  const [replacingItem, setReplacingItem] = useState<ProjectedMediaItem | null>(null);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [cascadeSuccessToast, setCascadeSuccessToast] = useState("");

  // Aggregate all media projected across website
  const mediaItems: ProjectedMediaItem[] = [];

  // 1. Product Images
  products.forEach((p) => {
    if (p.media?.primaryImage) {
      mediaItems.push({
        id: `${p.id}-primary`,
        url: p.media.primaryImage,
        label: `${p.name} (Primary Display)`,
        category: "product",
        projectedLocations: [`Product Card: ${p.name}`, `PDP Main Gallery: /product/${p.slug}`],
        productRef: p,
      });
    }
    p.media?.galleryImages?.forEach((g, idx) => {
      mediaItems.push({
        id: `${p.id}-gallery-${idx}`,
        url: g,
        label: `${p.name} (Gallery Frame #${idx + 1})`,
        category: "product",
        projectedLocations: [`PDP Gallery #${idx + 1}: /product/${p.slug}`],
        productRef: p,
      });
    });
    if (p.visualizerAssets?.texture) {
      mediaItems.push({
        id: `${p.id}-texture`,
        url: p.visualizerAssets.texture,
        label: `${p.name} (PBR Texture)`,
        category: "visualizer",
        projectedLocations: [`3D Room Visualizer: ${p.name}`],
        productRef: p,
      });
    }
  });

  // 2. Homepage Images
  if (homePageCms.heroBgImage) {
    mediaItems.push({
      id: "home-hero-bg",
      url: homePageCms.heroBgImage,
      label: "Homepage Hero Background",
      category: "homepage",
      projectedLocations: ["Storefront Homepage: Above-The-Fold Hero Section"],
    });
  }

  // 3. Real Storefront Pages Images
  mediaItems.push({
    id: "page-about",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    label: "About Candela Atelier Hero",
    category: "pages",
    projectedLocations: ["Page Header: /about"],
  });
  mediaItems.push({
    id: "page-contact",
    url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80",
    label: "Showrooms & Contact Hero",
    category: "pages",
    projectedLocations: ["Page Header: /contact"],
  });
  mediaItems.push({
    id: "page-inspiration",
    url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
    label: "Inspiration & Projects Hero",
    category: "pages",
    projectedLocations: ["Page Header: /inspiration"],
  });
  mediaItems.push({
    id: "page-visualizer",
    url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",
    label: "3D Studio & Visualizer Hero",
    category: "pages",
    projectedLocations: ["Page Header: /visualizer"],
  });

  // Filter items
  const filteredItems = mediaItems.filter((item) => {
    const matchesFilter = activeFilter === "all" || item.category === activeFilter;
    const matchesSearch =
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.projectedLocations.some((loc) => loc.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleOpenReplaceModal = (item: ProjectedMediaItem) => {
    setReplacingItem(item);
    setNewImageUrl(item.url);
  };

  const handleExecuteCascadeReplace = async () => {
    if (!replacingItem || !newImageUrl || newImageUrl === replacingItem.url) {
      setReplacingItem(null);
      return;
    }

    setIsUpdating(true);
    const oldUrl = replacingItem.url;

    try {
      // 1. Call database cascading API
      const res = await fetch("/api/v1/admin/media/replace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldUrl, newUrl: newImageUrl }),
      });
      const data = await res.json();

      // 2. Cascade update in React store context
      // Update any products whose primaryImage or galleryImages had oldUrl
      products.forEach((p) => {
        let needsUpdate = false;
        const updatedMedia = { ...p.media };

        if (p.media?.primaryImage === oldUrl) {
          updatedMedia.primaryImage = newImageUrl;
          needsUpdate = true;
        }
        if (p.media?.galleryImages?.includes(oldUrl)) {
          updatedMedia.galleryImages = p.media.galleryImages.map((img) =>
            img === oldUrl ? newImageUrl : img
          );
          needsUpdate = true;
        }

        if (needsUpdate) {
          updateProduct(p.id, {
            media: updatedMedia as any,
            isImageUpdated: true,
          });
        }
      });

      // Update homepage hero if it had oldUrl
      if (homePageCms.heroBgImage === oldUrl) {
        updateHomePageCms({ heroBgImage: newImageUrl });
      }

      const locationsText = replacingItem.projectedLocations.join(", ");
      setCascadeSuccessToast(
        `Image replaced successfully! Cascaded to ${data.cascaded?.productsUpdated || 1} products & ${locationsText}.`
      );
      setReplacingItem(null);
      setTimeout(() => setCascadeSuccessToast(""), 4000);
    } catch (err) {
      console.error("Cascade replace error:", err);
      // Fallback update in local state
      if (replacingItem.productRef) {
        updateProduct(replacingItem.productRef.id, {
          media: { ...replacingItem.productRef.media, primaryImage: newImageUrl },
          isImageUpdated: true,
        });
      }
      setCascadeSuccessToast("Updated image locally in session.");
      setReplacingItem(null);
      setTimeout(() => setCascadeSuccessToast(""), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#9E7B47] font-semibold">
            Digital Asset Registry &amp; Cascade Projection
          </span>
          <h1 className="font-heading text-2xl font-semibold text-gray-900">
            Media Library ({filteredItems.length} Assets)
          </h1>
          <p className="text-xs text-gray-500 font-light">
            All photography across the website. When an image is updated or replaced, changes cascade everywhere it was originally projected.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(["all", "product", "homepage", "pages", "visualizer"] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveFilter(cat)}
              className={`px-3 py-1 font-mono text-xs rounded transition cursor-pointer capitalize ${
                activeFilter === cat
                  ? "bg-[#9E7B47] text-white font-semibold shadow-xs"
                  : "border border-gray-300 bg-white text-gray-700 hover:text-gray-900"
              }`}
            >
              {cat === "all" ? "All Media" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Success Notification */}
      {cascadeSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-900 text-white px-4 py-3 rounded shadow-xl border border-emerald-700 animate-slide-up text-xs font-mono max-w-md">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{cascadeSuccessToast}</span>
        </div>
      )}

      {/* Search & Info Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 border border-gray-200 rounded-sm shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by label or projected page..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded border border-gray-300 bg-gray-50/50 py-1.5 pl-9 pr-3 text-xs font-mono text-gray-900 focus:border-[#9E7B47] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="text-[11px] font-mono text-gray-500">
          Click <strong>Update / Replace</strong> on any card to swap an asset and cascade to all live pages.
        </div>
      </div>

      {/* Grid of Media Assets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group relative border border-gray-200 bg-white rounded-sm overflow-hidden flex flex-col justify-between shadow-xs hover:border-[#9E7B47] transition duration-200"
          >
            {/* Image Preview */}
            <div className="relative h-48 w-full bg-neutral-900 overflow-hidden flex items-center justify-center">
              <img
                src={item.url}
                alt={item.label}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />

              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[9px] font-mono capitalize">
                {item.category}
              </div>

              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(item.url)}
                  className="bg-white/90 text-gray-900 p-2 rounded hover:bg-white transition cursor-pointer"
                  title="Copy CDN URL"
                >
                  {copiedUrl === item.url ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white/90 text-gray-900 p-2 rounded hover:bg-white transition"
                  title="Open Full Image"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Asset Metadata & Projection */}
            <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-heading font-semibold text-gray-900 truncate">
                  {item.label}
                </h4>

                <div className="mt-1.5 space-y-0.5">
                  <span className="text-[10px] font-mono text-gray-400 block uppercase">
                    Projected On:
                  </span>
                  {item.projectedLocations.map((loc, idx) => (
                    <span
                      key={idx}
                      className="block text-[11px] font-sans text-gray-600 line-clamp-1 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100"
                    >
                      {loc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Replace Button */}
              <div className="pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => handleOpenReplaceModal(item)}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-white border border-gray-300 text-gray-800 text-xs font-mono rounded hover:bg-[#FAF5EE] hover:border-[#9E7B47] hover:text-[#9E7B47] transition cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Update / Replace</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── CASCADING IMAGE REPLACEMENT MODAL ──────────────────────────────── */}
      {replacingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-sm border border-gray-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-slide-up">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#9E7B47] font-semibold">
                  Cascading Asset Replacement
                </span>
                <h3 className="font-heading text-lg font-semibold text-gray-900">
                  Update &amp; Cascade Everywhere
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReplacingItem(null)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Current vs New Comparison */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] font-mono text-gray-500 block mb-1 uppercase">
                  Current Image
                </span>
                <div className="h-28 rounded border border-gray-200 overflow-hidden bg-neutral-900">
                  <img
                    src={replacingItem.url}
                    alt="Current"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#9E7B47] block mb-1 uppercase font-semibold">
                  Replacement Preview
                </span>
                <div className="h-28 rounded border border-amber-300 overflow-hidden bg-neutral-900">
                  {newImageUrl ? (
                    <img
                      src={newImageUrl}
                      alt="New Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs font-mono text-neutral-500">
                      [ Enter New Image ]
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Projection Summary Alert */}
            <div className="bg-amber-50 border border-amber-200 p-3 rounded text-xs font-sans text-amber-900 space-y-1">
              <strong className="block font-mono text-[11px] uppercase tracking-wider text-amber-800">
                Cascading Impact:
              </strong>
              <p>
                Updating this image will automatically update everywhere it was originally projected:
              </p>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px] font-mono">
                {replacingItem.projectedLocations.map((loc, i) => (
                  <li key={i}>{loc}</li>
                ))}
              </ul>
            </div>

            {/* New URL Input & Uploader */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-gray-700 mb-1">
                  New Image CDN URL
                </label>
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded border border-gray-300 p-2 text-xs font-mono text-gray-900 focus:border-[#9E7B47] focus:outline-none"
                />
              </div>

              <div>
                <ImageUploader
                  currentImageUrl={newImageUrl}
                  onImageChange={(url) => setNewImageUrl(url)}
                  label="Or Upload New Image File"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setReplacingItem(null)}
                disabled={isUpdating}
                className="px-4 py-2 text-xs font-mono text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteCascadeReplace}
                disabled={isUpdating || !newImageUrl || newImageUrl === replacingItem.url}
                className="bg-[#9E7B47] text-white px-5 py-2 font-mono text-xs uppercase tracking-wider rounded-sm hover:bg-[#856535] transition shadow-xs font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isUpdating ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Cascading...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Cascade Replace Everywhere</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
