"use client";

import React, { useState } from "react";
import { AdminProduct } from "@/types";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  product: AdminProduct;
  setProduct: React.Dispatch<React.SetStateAction<AdminProduct>>;
}

export function MediaAnglesTab({ product, setProduct }: Props) {
  const [newGalleryInput, setNewGalleryInput] = useState("");
  const [newCustomViewTitle, setNewCustomViewTitle] = useState("");
  const [newCustomViewBadge, setNewCustomViewBadge] = useState("");
  const [newCustomViewUrl, setNewCustomViewUrl] = useState("");

  return (
    <div className="space-y-6">
      <div className="border border-gray-200 bg-gray-50/50 p-4 rounded-sm space-y-3">
        <div>
          <h3 className="font-heading text-sm font-semibold text-gray-900">
            Primary Display Image (Storefront Product Card)
          </h3>
          <p className="text-xs text-gray-500 font-light">
            Used across catalogue grids, search cards, and wishlist comparisons.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <img
            src={product.media?.primaryImage}
            alt={product.name}
            className="h-32 w-32 rounded object-cover border border-[#9E7B47] shrink-0 bg-gray-100"
          />
          <div className="flex-1 w-full">
            <ImageUploader
              label="Upload or Replace Primary Card Image"
              currentImageUrl={product.media?.primaryImage || ""}
              onImageChange={(newUrl) =>
                setProduct({
                  ...product,
                  media: { ...product.media, primaryImage: newUrl },
                })
              }
            />
          </div>
        </div>
      </div>

      {/* Multi-Angle View Photographs (Storefront Multi-View Gallery) */}
      <div className="border border-[#9E7B47]/30 bg-[#FAF5EE]/50 p-5 rounded-sm space-y-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-[#9E7B47] font-semibold">
              Multi-Angle Photography &amp; Architectural Angles
            </span>
          </div>
          <h3 className="font-heading text-base font-semibold text-gray-900 mt-0.5">
            Storefront Multi-View Angles (Flipkart-Style Gallery)
          </h3>
          <p className="text-xs text-gray-500 font-light">
            Upload or edit high-resolution photographs for each architectural angle. Customers can click these angle badges on the storefront product page to inspect details.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Bookmatch Quad (A+B Quad) */}
          <div className="border border-gray-200 bg-white p-3.5 rounded-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="inline-block bg-[#FAF5EE] text-[#9E7B47] border border-[#EADCC9] px-2 py-0.5 text-[10px] font-mono font-bold rounded">
                  A+B Quad
                </span>
                <h4 className="font-heading text-xs font-semibold text-gray-900 mt-1">
                  Bookmatch Quad View Image
                </h4>
              </div>
              {product.media?.bookmatchImage && (
                <button
                  type="button"
                  onClick={() =>
                    setProduct({
                      ...product,
                      media: { ...product.media, bookmatchImage: undefined },
                    })
                  }
                  className="text-[11px] text-red-500 hover:underline cursor-pointer"
                >
                  Clear Image
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="h-20 w-24 shrink-0 rounded overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                {product.media?.bookmatchImage ? (
                  <img
                    src={product.media.bookmatchImage}
                    alt="Bookmatch Quad"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-[10px] text-gray-400 font-mono text-center p-1">
                    No photo (renders diagram)
                  </span>
                )}
              </div>
              <div className="flex-1 space-y-1.5">
                <input
                  type="text"
                  placeholder="Image URL (https://... or /uploads/...)"
                  value={product.media?.bookmatchImage || ""}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      media: { ...product.media, bookmatchImage: e.target.value },
                    })
                  }
                  className="w-full text-xs font-mono border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:outline-none focus:border-[#9E7B47]"
                />
                <ImageUploader
                  label="Or Upload A+B Quad Photo"
                  currentImageUrl={product.media?.bookmatchImage || ""}
                  onImageChange={(url) =>
                    setProduct({
                      ...product,
                      media: { ...product.media, bookmatchImage: url },
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* 2. Architectural Scene (Kitchen Waterfall) */}
          <div className="border border-gray-200 bg-white p-3.5 rounded-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="inline-block bg-[#FAF5EE] text-[#9E7B47] border border-[#EADCC9] px-2 py-0.5 text-[10px] font-mono font-bold rounded">
                  Architectural
                </span>
                <h4 className="font-heading text-xs font-semibold text-gray-900 mt-1">
                  Kitchen Waterfall / Lifestyle Scene
                </h4>
              </div>
              {product.media?.architecturalImage && (
                <button
                  type="button"
                  onClick={() =>
                    setProduct({
                      ...product,
                      media: { ...product.media, architecturalImage: undefined },
                    })
                  }
                  className="text-[11px] text-red-500 hover:underline cursor-pointer"
                >
                  Clear Image
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="h-20 w-24 shrink-0 rounded overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                {product.media?.architecturalImage ? (
                  <img
                    src={product.media.architecturalImage}
                    alt="Kitchen Waterfall"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-[10px] text-gray-400 font-mono text-center p-1">
                    No photo (renders diagram)
                  </span>
                )}
              </div>
              <div className="flex-1 space-y-1.5">
                <input
                  type="text"
                  placeholder="Image URL (https://... or /uploads/...)"
                  value={product.media?.architecturalImage || ""}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      media: { ...product.media, architecturalImage: e.target.value },
                    })
                  }
                  className="w-full text-xs font-mono border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:outline-none focus:border-[#9E7B47]"
                />
                <ImageUploader
                  label="Or Upload Architectural Scene"
                  currentImageUrl={product.media?.architecturalImage || ""}
                  onImageChange={(url) =>
                    setProduct({
                      ...product,
                      media: { ...product.media, architecturalImage: url },
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* 3. 4X Zoom (Macro Vein Detail) */}
          <div className="border border-gray-200 bg-white p-3.5 rounded-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="inline-block bg-[#FAF5EE] text-[#9E7B47] border border-[#EADCC9] px-2 py-0.5 text-[10px] font-mono font-bold rounded">
                  4X Zoom
                </span>
                <h4 className="font-heading text-xs font-semibold text-gray-900 mt-1">
                  Macro Vein Detail / Texture Closeup
                </h4>
              </div>
              {product.media?.macroImage && (
                <button
                  type="button"
                  onClick={() =>
                    setProduct({
                      ...product,
                      media: { ...product.media, macroImage: undefined },
                    })
                  }
                  className="text-[11px] text-red-500 hover:underline cursor-pointer"
                >
                  Clear Image
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="h-20 w-24 shrink-0 rounded overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                {product.media?.macroImage ? (
                  <img
                    src={product.media.macroImage}
                    alt="Macro Vein Detail"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-[10px] text-gray-400 font-mono text-center p-1">
                    No photo (renders diagram)
                  </span>
                )}
              </div>
              <div className="flex-1 space-y-1.5">
                <input
                  type="text"
                  placeholder="Image URL (https://... or /uploads/...)"
                  value={product.media?.macroImage || ""}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      media: { ...product.media, macroImage: e.target.value },
                    })
                  }
                  className="w-full text-xs font-mono border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:outline-none focus:border-[#9E7B47]"
                />
                <ImageUploader
                  label="Or Upload 4X Macro Photo"
                  currentImageUrl={product.media?.macroImage || ""}
                  onImageChange={(url) =>
                    setProduct({
                      ...product,
                      media: { ...product.media, macroImage: url },
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* 4. 20mm / 8mm Mitred Edge Profile */}
          <div className="border border-gray-200 bg-white p-3.5 rounded-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="inline-block bg-[#FAF5EE] text-[#9E7B47] border border-[#EADCC9] px-2 py-0.5 text-[10px] font-mono font-bold rounded">
                  {product.thicknessMm ? `${product.thicknessMm}mm Edge` : "Mitred Edge"}
                </span>
                <h4 className="font-heading text-xs font-semibold text-gray-900 mt-1">
                  Edge Profile / Mitred Joint Inspection
                </h4>
              </div>
              {product.media?.edgeImage && (
                <button
                  type="button"
                  onClick={() =>
                    setProduct({
                      ...product,
                      media: { ...product.media, edgeImage: undefined },
                    })
                  }
                  className="text-[11px] text-red-500 hover:underline cursor-pointer"
                >
                  Clear Image
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="h-20 w-24 shrink-0 rounded overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                {product.media?.edgeImage ? (
                  <img
                    src={product.media.edgeImage}
                    alt="Mitred Edge"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-[10px] text-gray-400 font-mono text-center p-1">
                    No photo (renders diagram)
                  </span>
                )}
              </div>
              <div className="flex-1 space-y-1.5">
                <input
                  type="text"
                  placeholder="Image URL (https://... or /uploads/...)"
                  value={product.media?.edgeImage || ""}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      media: { ...product.media, edgeImage: e.target.value },
                    })
                  }
                  className="w-full text-xs font-mono border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:outline-none focus:border-[#9E7B47]"
                />
                <ImageUploader
                  label="Or Upload Edge Profile Photo"
                  currentImageUrl={product.media?.edgeImage || ""}
                  onImageChange={(url) =>
                    setProduct({
                      ...product,
                      media: { ...product.media, edgeImage: url },
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* 5. Additional Custom Angles / Views */}
        <div className="border-t border-gray-200 pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-heading text-xs font-semibold text-gray-900">
                Additional Custom View Angles ({(product.media?.customViews || []).length})
              </h4>
              <p className="text-[11px] text-gray-500 font-light">
                Add extra custom perspective shots (e.g. Backlit View, Raking Light, Under-Mount Angle).
              </p>
            </div>
          </div>

          {product.media?.customViews && product.media.customViews.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {product.media.customViews.map((cv, idx) => (
                <div key={cv.id || idx} className="flex items-center gap-2.5 p-2 rounded border border-gray-200 bg-white">
                  <img
                    src={cv.imageUrl}
                    alt={cv.title}
                    className="h-12 w-14 shrink-0 object-cover rounded border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="inline-block font-mono text-[9px] bg-gray-100 px-1 rounded text-gray-600">
                      {cv.badge}
                    </span>
                    <p className="font-medium text-xs text-gray-900 truncate">{cv.title}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setProduct({
                        ...product,
                        media: {
                          ...product.media,
                          customViews: product.media.customViews?.filter((_, i) => i !== idx),
                        },
                      })
                    }
                    className="p-1 text-red-500 hover:text-red-700 cursor-pointer"
                    title="Delete angle"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Custom View Angle Form */}
          <div className="bg-white p-3 border border-gray-200 rounded space-y-2">
            <span className="font-mono text-[10px] text-gray-500 uppercase tracking-wider block font-semibold">
              + Add Another Custom View Angle
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Angle Title (e.g. Backlit Marble View)"
                value={newCustomViewTitle}
                onChange={(e) => setNewCustomViewTitle(e.target.value)}
                className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-900 focus:outline-none focus:border-[#9E7B47]"
              />
              <input
                type="text"
                placeholder="Badge (e.g. Backlit, 45° Angle)"
                value={newCustomViewBadge}
                onChange={(e) => setNewCustomViewBadge(e.target.value)}
                className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-900 focus:outline-none focus:border-[#9E7B47]"
              />
              <input
                type="text"
                placeholder="Image URL (https://... or /uploads/...)"
                value={newCustomViewUrl}
                onChange={(e) => setNewCustomViewUrl(e.target.value)}
                className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-900 focus:outline-none focus:border-[#9E7B47]"
              />
            </div>
            <div className="flex items-center justify-between gap-3 pt-1">
              <ImageUploader
                label="Or Upload Image File for Angle"
                onImageChange={(uploadedUrl) => setNewCustomViewUrl(uploadedUrl)}
              />
              <button
                type="button"
                onClick={() => {
                  if (newCustomViewTitle.trim() && newCustomViewUrl.trim()) {
                    const current = product.media?.customViews || [];
                    setProduct({
                      ...product,
                      media: {
                        ...product.media,
                        customViews: [
                          ...current,
                          {
                            id: `angle-${Date.now()}`,
                            title: newCustomViewTitle.trim(),
                            badge: newCustomViewBadge.trim() || "Angle",
                            imageUrl: newCustomViewUrl.trim(),
                          },
                        ],
                      },
                    });
                    setNewCustomViewTitle("");
                    setNewCustomViewBadge("");
                    setNewCustomViewUrl("");
                  }
                }}
                disabled={!newCustomViewTitle.trim() || !newCustomViewUrl.trim()}
                className="px-4 py-1.5 bg-[#9E7B47] hover:bg-[#856535] disabled:opacity-50 text-white rounded text-xs font-mono font-medium cursor-pointer"
              >
                Add View Angle
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Images */}
      <div className="border border-gray-200 bg-gray-50/50 p-4 rounded-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-sm font-semibold text-gray-900">
              Gallery &amp; Room Lifestyle Images ({(product.media?.galleryImages || []).length})
            </h3>
            <p className="text-xs text-gray-500 font-light">
              Additional slab closeups, vein angles, and architectural project lifestyle photographs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {product.media?.galleryImages?.map((img, idx) => (
            <div key={idx} className="relative group rounded overflow-hidden border border-gray-200 bg-gray-100">
              <img src={img} alt="Gallery" className="h-28 w-full object-cover" />
              <button
                type="button"
                onClick={() =>
                  setProduct({
                    ...product,
                    media: {
                      ...product.media,
                      galleryImages: product.media.galleryImages.filter((_, i) => i !== idx),
                    },
                  })
                }
                className="absolute top-1 right-1 h-6 w-6 rounded bg-black/80 text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Add New Gallery Image input & Uploader */}
        <div className="pt-3 border-t border-gray-200 space-y-2">
          <label className="block text-xs font-mono uppercase text-gray-600 font-semibold">
            + Add New Image to Gallery
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Paste image URL (https://... or /uploads/...)..."
              value={newGalleryInput}
              onChange={(e) => setNewGalleryInput(e.target.value)}
              className="flex-1 rounded border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-900 font-mono focus:border-[#9E7B47] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => {
                if (newGalleryInput.trim()) {
                  const current = product.media?.galleryImages || [];
                  setProduct({
                    ...product,
                    media: {
                      ...product.media,
                      galleryImages: [...current, newGalleryInput.trim()],
                    },
                  });
                  setNewGalleryInput("");
                }
              }}
              className="px-4 py-1.5 bg-[#9E7B47] hover:bg-[#856535] text-white rounded text-xs font-mono font-medium cursor-pointer"
            >
              Add URL
            </button>
          </div>
          <ImageUploader
            label="Or Upload Gallery Photo from Device"
            currentImageUrl=""
            onImageChange={(uploadedUrl) => {
              if (uploadedUrl) {
                const current = product.media?.galleryImages || [];
                setProduct({
                  ...product,
                  media: {
                    ...product.media,
                    galleryImages: [...current, uploadedUrl],
                  },
                });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
