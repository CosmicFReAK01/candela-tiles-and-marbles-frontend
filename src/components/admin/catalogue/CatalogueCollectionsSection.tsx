"use client";

import React, { useState, useEffect } from "react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import {
  Edit,
  ExternalLink,
  X,
} from "lucide-react";

interface Props {
  onNotify: (msg: string, durationMs?: number) => void;
  onCountChange?: (count: number) => void;
}

export function CatalogueCollectionsSection({ onNotify, onCountChange }: Props) {
  interface CollectionItem {
    id: string;
    name: string;
    slug: string;
    description: string;
    cover_image_url: string;
    display_order: number;
    is_published: boolean;
    product_count: number;
  }

  const [collections, setCollections] = useState<CollectionItem[]>([
    {
      id: "col-premium",
      slug: "premium",
      name: "Premium Collection",
      description: "Hand-selected monolithic slabs from legacy European quarries with rare geologic formations.",
      cover_image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
      display_order: 1,
      is_published: true,
      product_count: 5,
    },
    {
      id: "col-luxury",
      slug: "luxury",
      name: "Luxury Collection",
      description: "Dramatic statement bookmatches and opulent crystalline marbles for grand residences.",
      cover_image_url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85",
      display_order: 2,
      is_published: true,
      product_count: 4,
    },
    {
      id: "col-modern",
      slug: "modern",
      name: "Modern Collection",
      description: "Clean lines, subtle textural relief, and minimal architectural palettes.",
      cover_image_url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=85",
      display_order: 3,
      is_published: true,
      product_count: 6,
    },
    {
      id: "col-natural",
      slug: "natural",
      name: "Natural Collection",
      description: "Organic travertine, split-face slate, and honed limestone for biophilic sanctuaries.",
      cover_image_url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85",
      display_order: 4,
      is_published: true,
      product_count: 3,
    },
    {
      id: "col-classic",
      slug: "classic",
      name: "Classic Collection",
      description: "Enduring Statuario, Botticino, and timeless neoclassical stones.",
      cover_image_url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85",
      display_order: 5,
      is_published: true,
      product_count: 3,
    },
    {
      id: "col-new-arrivals",
      slug: "new-arrivals",
      name: "New Arrivals",
      description: "The latest 2026 quarry shipments and technological porcelain surfaces.",
      cover_image_url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=85",
      display_order: 6,
      is_published: true,
      product_count: 4,
    },
    {
      id: "col-best-sellers",
      slug: "best-sellers",
      name: "Best Sellers",
      description: "The most specified surfaces by leading Indian architectural firms with verified durability.",
      cover_image_url: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1600&q=85",
      display_order: 7,
      is_published: true,
      product_count: 5,
    },
  ]);

  const [editingCollection, setEditingCollection] = useState<CollectionItem | null>(null);

  useEffect(() => {
    fetch("/api/v1/admin/collections", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) return;
        const json = await res.json();
        if (Array.isArray(json.data) && json.data.length > 0) {
          setCollections(json.data);
          onCountChange?.(json.data.length);
        }
      })
      .catch(() => undefined);
  }, [onCountChange]);

  const handleSaveCollection = async (col: CollectionItem) => {
    try {
      await fetch("/api/v1/admin/collections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(col),
      });
      setCollections((prev) => prev.map((c) => (c.id === col.id ? col : c)));
      setEditingCollection(null);
      onNotify(`Collection '${col.name}' saved to database!`, 2500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
<div className="space-y-5">
  <div className="bg-amber-50/60 border border-amber-200/80 p-3.5 rounded-sm flex items-center justify-between">
    <p className="text-xs text-amber-900 font-sans">
      <strong>Curated Collections Architecture:</strong> Showcases all signature collections listed on the website. Click <strong>Edit Collection</strong> to update hero photography, descriptions, and storefront visibility.
    </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
    {collections.map((col) => (
      <div
        key={col.id}
        className="bg-white border border-gray-200 rounded-sm shadow-xs overflow-hidden flex flex-col justify-between"
      >
        <div>
          <div className="h-40 w-full relative overflow-hidden bg-gray-100">
            <img
              src={col.cover_image_url}
              alt={col.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[10px] font-mono">
              {col.is_published ? "Published" : "Draft"}
            </div>
          </div>

          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-semibold text-gray-900">
                {col.name}
              </h3>
              <span className="text-[10px] font-mono bg-[#FAF5EE] text-[#9E7B47] px-2 py-0.5 rounded border border-[#EADCC9]">
                /{col.slug}
              </span>
            </div>

            <p className="text-xs text-gray-600 font-light line-clamp-2">
              {col.description}
            </p>

            <div className="pt-2 border-t border-gray-100 text-xs font-mono flex items-center justify-between text-gray-500">
              <span>Products: {col.product_count}</span>
              <a
                href={`/collections/${col.slug}`}
                target="_blank"
                rel="noreferrer"
                className="text-[#9E7B47] hover:underline flex items-center gap-1"
              >
                <span>View live</span>
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>
          </div>
        </div>

        <div className="p-3 bg-gray-50 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setEditingCollection(col)}
            className="w-full py-1.5 text-center text-xs font-mono text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 transition cursor-pointer font-medium"
          >
            Edit Collection Details
          </button>
        </div>
      </div>
    ))}
  </div>

  {/* Edit Collection Modal */}
  {editingCollection && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-sm border border-gray-200 shadow-2xl max-w-lg w-full p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <h3 className="font-heading text-base font-semibold text-gray-900">
            Edit Collection: {editingCollection.name}
          </h3>
          <button
            type="button"
            onClick={() => setEditingCollection(null)}
            className="p-1 text-gray-400 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs font-mono">
          <div>
            <label className="block text-gray-600 mb-1">Collection Title</label>
            <input
              type="text"
              value={editingCollection.name}
              onChange={(e) =>
                setEditingCollection({ ...editingCollection, name: e.target.value })
              }
              className="w-full rounded border border-gray-300 p-2 font-heading font-semibold text-gray-900"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Slug URL Identifier</label>
            <input
              type="text"
              value={editingCollection.slug}
              onChange={(e) =>
                setEditingCollection({ ...editingCollection, slug: e.target.value })
              }
              className="w-full rounded border border-gray-300 p-2 font-mono text-gray-900"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Description</label>
            <textarea
              rows={3}
              value={editingCollection.description}
              onChange={(e) =>
                setEditingCollection({ ...editingCollection, description: e.target.value })
              }
              className="w-full rounded border border-gray-300 p-2 font-sans text-gray-900"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Cover Image URL</label>
            <div className="space-y-2">
              <input
                type="text"
                value={editingCollection.cover_image_url}
                onChange={(e) =>
                  setEditingCollection({
                    ...editingCollection,
                    cover_image_url: e.target.value,
                  })
                }
                className="w-full rounded border border-gray-300 p-2 font-mono text-gray-900"
              />
              <ImageUploader
                currentImageUrl={editingCollection.cover_image_url}
                onImageChange={(url) =>
                  setEditingCollection({ ...editingCollection, cover_image_url: url })
                }
                label="Upload / Replace Collection Cover Image"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editingCollection.is_published}
                onChange={(e) =>
                  setEditingCollection({
                    ...editingCollection,
                    is_published: e.target.checked,
                  })
                }
                className="rounded text-[#9E7B47] focus:ring-[#9E7B47]"
              />
              <span>Published &amp; Visible on Storefront</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setEditingCollection(null)}
            className="px-3 py-1.5 text-xs font-mono text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSaveCollection(editingCollection)}
            className="bg-[#9E7B47] text-white px-4 py-1.5 font-mono text-xs uppercase tracking-wider rounded-sm hover:bg-[#856535] transition shadow-xs font-semibold"
          >
            Save Collection
          </button>
        </div>
      </div>
    </div>
  )}
</div>
  );
}
