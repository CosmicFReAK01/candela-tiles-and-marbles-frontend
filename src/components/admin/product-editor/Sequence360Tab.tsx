"use client";

import React from "react";
import { AdminProduct } from "@/types";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ArrowLeft, ArrowRight, Pause, Play, Plus, RotateCw, Trash2, Upload } from "lucide-react";

interface Props {
  product: AdminProduct;
  setProduct: React.Dispatch<React.SetStateAction<AdminProduct>>;
  active360FrameIndex: number;
  setActive360FrameIndex: React.Dispatch<React.SetStateAction<number>>;
  isAutoSpinning: boolean;
  setIsAutoSpinning: React.Dispatch<React.SetStateAction<boolean>>;
  newFrameInput: string;
  setNewFrameInput: (v: string) => void;
  onAdd360Frame: (url: string) => void;
  onRemove360Frame: (index: number) => void;
  onUpdate360FrameUrl: (index: number, url: string) => void;
}

export function Sequence360Tab({
  product,
  setProduct,
  active360FrameIndex,
  setActive360FrameIndex,
  isAutoSpinning,
  setIsAutoSpinning,
  newFrameInput,
  setNewFrameInput,
  onAdd360Frame: handleAdd360Frame,
  onRemove360Frame: handleRemove360Frame,
  onUpdate360FrameUrl: handleUpdate360FrameUrl,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border border-gray-200 bg-gray-50/50 p-4 rounded-sm">
        <div>
          <h3 className="font-heading text-sm font-semibold text-gray-900 flex items-center gap-2">
            <RotateCw className="h-4 w-4 text-[#9E7B47]" />
            <span>360° Spin Images Manager (Flipkart-Style Interactive Turntable)</span>
          </h3>
          <p className="text-xs text-gray-500 font-light">
            Add, replace, or remove sequential 360° photographic frames. Customers can drag to rotate 360° on the storefront product page.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-gray-200 text-gray-700">
            {product.viewer360?.frames?.length || 0} Frames Total
          </span>
          <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-gray-700">
            <input
              type="checkbox"
              checked={product.viewer360?.enabled}
              onChange={(e) =>
                setProduct({
                  ...product,
                  viewer360: {
                    ...(product.viewer360 || { frames: [], settings: { autoRotate: true, rotationSpeed: 20, direction: "clockwise" } }),
                    enabled: e.target.checked,
                  },
                })
              }
              className="rounded border-gray-300 text-[#9E7B47] focus:ring-0"
            />
            <span>Enable 360° on Store</span>
          </label>
        </div>
      </div>

      {/* Interactive Frame Preview Canvas & Auto-Spin Tester */}
      <div className="border border-gray-200 bg-gray-50 p-6 rounded-sm text-center space-y-4">
        <div className="relative mx-auto h-72 max-w-lg overflow-hidden rounded border border-gray-300 bg-white flex items-center justify-center shadow-xs">
          {product.viewer360?.frames && product.viewer360.frames.length > 0 ? (
            <img
              src={product.viewer360.frames[active360FrameIndex]?.url || product.media?.primaryImage}
              alt="360 Frame Preview"
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="text-gray-400 font-mono text-xs p-6">
              No 360° frames added yet. Add frames below to enable interactive spin.
            </div>
          )}

          <div className="absolute top-2 left-2 bg-black/80 px-2.5 py-1 font-mono text-[11px] text-white rounded flex items-center gap-2">
            <span className="text-[#E6C97A]">● 360° PREVIEW</span>
            <span>
              Frame {(active360FrameIndex + 1)} / {product.viewer360?.frames?.length || 0}
            </span>
            <span className="text-gray-400">
              ({Math.round(((active360FrameIndex) / Math.max(1, (product.viewer360?.frames?.length || 1))) * 360)}°)
            </span>
          </div>

          <div className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-black/75 p-1 rounded">
            <button
              type="button"
              onClick={() =>
                setActive360FrameIndex((prev) =>
                  prev > 0 ? prev - 1 : (product.viewer360?.frames?.length || 1) - 1
                )
              }
              className="h-7 w-7 rounded bg-white/20 text-white hover:bg-white/40 flex items-center justify-center text-xs"
              title="Previous Frame"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setIsAutoSpinning(!isAutoSpinning)}
              className={`h-7 px-2.5 rounded font-mono text-[10px] uppercase flex items-center gap-1 text-white ${
                isAutoSpinning ? "bg-amber-600 hover:bg-amber-700" : "bg-[#9E7B47] hover:bg-[#8B6914]"
              }`}
            >
              {isAutoSpinning ? (
                <>
                  <Pause className="h-3 w-3" /> Pause
                </>
              ) : (
                <>
                  <Play className="h-3 w-3" /> Auto-Spin
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() =>
                setActive360FrameIndex((prev) =>
                  prev < (product.viewer360?.frames?.length || 1) - 1 ? prev + 1 : 0
                )
              }
              className="h-7 w-7 rounded bg-white/20 text-white hover:bg-white/40 flex items-center justify-center text-xs"
              title="Next Frame"
            >
              ›
            </button>
          </div>
        </div>

        <div className="max-w-lg mx-auto space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-gray-500">
            <span>0° (Front)</span>
            <span className="text-[#9E7B47] font-semibold">Interactive Scrub Slider</span>
            <span>360° (Full Turn)</span>
          </div>
          <input
            type="range"
            min="0"
            max={Math.max(0, (product.viewer360?.frames?.length || 1) - 1)}
            value={active360FrameIndex}
            onChange={(e) => {
              if (isAutoSpinning) setIsAutoSpinning(false);
              setActive360FrameIndex(parseInt(e.target.value) || 0);
            }}
            className="w-full accent-[#9E7B47] cursor-pointer"
          />
        </div>
      </div>

      {/* Add New Frame Panel */}
      <div className="border border-gray-200 bg-white p-4 rounded-sm shadow-xs space-y-3">
        <h4 className="font-heading text-sm font-semibold text-gray-900 flex items-center gap-1.5">
          <Plus className="h-4 w-4 text-[#9E7B47]" />
          <span>Add New 360° Spin Image Frame</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-xs font-mono text-gray-500 uppercase mb-1">
              Paste Image URL (Unsplash, CDN or S3)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={newFrameInput}
                onChange={(e) => setNewFrameInput(e.target.value)}
                className="flex-1 rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-[#9E7B47] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleAdd360Frame(newFrameInput)}
                className="px-4 py-2 bg-[#9E7B47] hover:bg-[#8B6914] text-white text-xs font-mono uppercase tracking-wider rounded transition cursor-pointer"
              >
                + Add Frame
              </button>
            </div>
          </div>

          <div>
            <ImageUploader
              label="Or Upload Frame Image File"
              onImageChange={(uploadedUrl) => handleAdd360Frame(uploadedUrl)}
            />
          </div>
        </div>
      </div>

      {/* Manage Individual 360 Frames List */}
      <div className="border border-gray-200 bg-white p-4 rounded-sm shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-heading text-sm font-semibold text-gray-900">
            Existing 360° Frames ({product.viewer360?.frames?.length || 0})
          </h4>
          <span className="text-[11px] font-mono text-gray-400">
            Click any frame to preview • Update URL or delete frame
          </span>
        </div>

        {(!product.viewer360?.frames || product.viewer360.frames.length === 0) ? (
          <div className="p-8 text-center border border-dashed border-gray-300 rounded text-gray-400 text-xs font-mono">
            No 360° frames currently saved. Use the form above to add your first sequence image.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {product.viewer360.frames.map((frame, idx) => {
              const isCurrent = active360FrameIndex === idx;
              const approxDeg = Math.round((idx / (product.viewer360?.frames?.length || 1)) * 360);
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-2.5 rounded border transition ${
                    isCurrent
                      ? "border-[#9E7B47] bg-[#FAF5EE]"
                      : "border-gray-200 bg-gray-50/50 hover:border-gray-300"
                  }`}
                >
                  {/* Frame Thumbnail */}
                  <div
                    onClick={() => setActive360FrameIndex(idx)}
                    className="relative h-16 w-16 shrink-0 rounded overflow-hidden border border-gray-300 bg-white cursor-pointer group"
                    title="Click to preview this frame"
                  >
                    <img
                      src={frame.url}
                      alt={`Frame ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[10px] font-mono">
                      View
                    </div>
                    <span className="absolute bottom-0.5 right-0.5 bg-black/75 text-white font-mono text-[9px] px-1 rounded">
                      #{idx + 1}
                    </span>
                  </div>

                  {/* URL & Controls */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-semibold text-[#9E7B47]">
                        Frame {idx + 1} • ~{approxDeg}°
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemove360Frame(idx)}
                        className="text-gray-400 hover:text-red-500 p-1 transition cursor-pointer"
                        title="Delete this 360° frame"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={frame.url}
                      onChange={(e) => handleUpdate360FrameUrl(idx, e.target.value)}
                      className="w-full text-[10px] font-mono bg-white border border-gray-300 rounded px-1.5 py-1 text-gray-700 focus:outline-none focus:border-[#9E7B47] truncate"
                      title="Edit Image URL"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
