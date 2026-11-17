"use client";

import React, { useState } from "react";
import { AdminProduct, MasterCategory } from "@/types";
import { Sparkles } from "lucide-react";
import {
  ALL_COLOURS,
  ALL_COLLECTIONS,
  COMMON_SUBCATEGORIES,
  MASTER_CATEGORIES_LIST,
} from "./constants";

interface Props {
  product: AdminProduct;
  setProduct: React.Dispatch<React.SetStateAction<AdminProduct>>;
  aiLoading: boolean;
  onGenerateAiDescription: () => void;
}

export function GeneralIdentityTab({
  product,
  setProduct,
  aiLoading,
  onGenerateAiDescription,
}: Props) {
  const [customSubcategoryInput, setCustomSubcategoryInput] = useState("");
  const handleGenerateAiDescription = onGenerateAiDescription;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
            Product Name *
          </label>
          <input
            type="text"
            required
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-heading text-gray-900 focus:border-[#9E7B47] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
            SKU Code / Lot Identifier *
          </label>
          <input
            type="text"
            required
            value={product.sku}
            onChange={(e) => setProduct({ ...product, sku: e.target.value })}
            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-mono text-gray-900 focus:border-[#9E7B47] focus:outline-none"
          />
        </div>
      </div>

      {/* Categorization & Multi-Category Tagging */}
      <div className="space-y-4 border border-gray-200 bg-gray-50/50 p-4 rounded-sm">
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <div>
            <h3 className="font-heading text-sm font-semibold text-gray-900">
              Categorization &amp; Multi-Category Assignment
            </h3>
            <p className="text-[11px] text-gray-500 font-light">
              One item can belong to multiple categories, collections, and colour palettes simultaneously.
            </p>
          </div>
          <span className="font-mono text-[10px] bg-[#9E7B47]/10 text-[#9E7B47] px-2 py-0.5 rounded font-medium border border-[#9E7B47]/20">
            Multi-Tag Enabled
          </span>
        </div>

        {/* 1. Master Categories */}
        <div>
          <label className="block text-xs font-mono uppercase text-gray-600 mb-1.5 font-semibold">
            1. Master Categories (Select all that apply) *
          </label>
          <div className="flex flex-wrap gap-1.5">
            {MASTER_CATEGORIES_LIST.map((cat) => {
              const selectedCats = product.categories || [product.masterCategory || "Tiles"];
              const isSelected = selectedCats.includes(cat) || product.masterCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    let nextCats = isSelected
                      ? selectedCats.filter((c) => c !== cat)
                      : [...selectedCats, cat];
                    if (nextCats.length === 0) nextCats = [cat];
                    setProduct({
                      ...product,
                      masterCategory: nextCats[0] as MasterCategory,
                      categories: nextCats,
                    });
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono transition cursor-pointer border ${
                    isSelected
                      ? "bg-[#9E7B47] text-white border-[#9E7B47] font-semibold shadow-xs"
                      : "bg-white text-gray-700 border-gray-300 hover:border-[#9E7B47]"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-white" : "bg-gray-300"}`} />
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Subcategory / Family */}
        <div>
          <label className="block text-xs font-mono uppercase text-gray-600 mb-1 font-semibold">
            2. Subcategory / Family Tags
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {COMMON_SUBCATEGORIES.map((sub) => {
              const selectedSubs = product.subcategories || (product.subcategory ? [product.subcategory] : []);
              const isSelected = selectedSubs.includes(sub) || product.subcategory === sub;
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => {
                    const nextSubs = isSelected
                      ? selectedSubs.filter((s) => s !== sub)
                      : [...selectedSubs, sub];
                    setProduct({
                      ...product,
                      subcategory: nextSubs[0] || "",
                      subcategories: nextSubs,
                    });
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-sans transition cursor-pointer border ${
                    isSelected
                      ? "bg-stone-800 text-white border-stone-800 font-medium"
                      : "bg-white text-gray-600 border-gray-300 hover:border-gray-500"
                  }`}
                >
                  {isSelected ? "✓ " : "+ "}
                  {sub}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Add custom subcategory / family tag (press Enter or Add)..."
              value={customSubcategoryInput}
              onChange={(e) => setCustomSubcategoryInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (customSubcategoryInput.trim()) {
                    const current = product.subcategories || (product.subcategory ? [product.subcategory] : []);
                    if (!current.includes(customSubcategoryInput.trim())) {
                      const updated = [...current, customSubcategoryInput.trim()];
                      setProduct({
                        ...product,
                        subcategory: updated[0],
                        subcategories: updated,
                      });
                    }
                    setCustomSubcategoryInput("");
                  }
                }
              }}
              className="flex-1 rounded border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-900 focus:border-[#9E7B47] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => {
                if (customSubcategoryInput.trim()) {
                  const current = product.subcategories || (product.subcategory ? [product.subcategory] : []);
                  if (!current.includes(customSubcategoryInput.trim())) {
                    const updated = [...current, customSubcategoryInput.trim()];
                    setProduct({
                      ...product,
                      subcategory: updated[0],
                      subcategories: updated,
                    });
                  }
                  setCustomSubcategoryInput("");
                }
              }}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-xs font-mono text-gray-700 cursor-pointer"
            >
              + Add Tag
            </button>
          </div>
        </div>

        {/* 3. Collection Assignment */}
        <div>
          <label className="block text-xs font-mono uppercase text-gray-600 mb-1 font-semibold">
            3. Collection Assignment (Multi-Collection Supported)
          </label>
          <div className="flex flex-wrap gap-1.5">
            {ALL_COLLECTIONS.map((col) => {
              const selectedCols = product.collectionSlugs || (product.collectionSlug ? [product.collectionSlug] : []);
              const isSelected = selectedCols.includes(col.slug) || product.collectionSlug === col.slug;
              return (
                <button
                  key={col.slug}
                  type="button"
                  onClick={() => {
                    const nextCols = isSelected
                      ? selectedCols.filter((s) => s !== col.slug)
                      : [...selectedCols, col.slug];
                    setProduct({
                      ...product,
                      collectionName: col.name,
                      collectionSlug: nextCols[0] || col.slug,
                      collectionSlugs: nextCols,
                    });
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono transition cursor-pointer border ${
                    isSelected
                      ? "bg-amber-100 border-amber-400 text-amber-900 font-semibold"
                      : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <span>{isSelected ? "★" : "☆"}</span>
                  <span>{col.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Colour Palette Multi-Selection */}
        <div>
          <label className="block text-xs font-mono uppercase text-gray-600 mb-1 font-semibold">
            4. Colour Assignment (Multi-Colour Supported)
          </label>
          <div className="flex flex-wrap gap-2">
            {ALL_COLOURS.map((col) => {
              const selectedColours = product.colours || (product.colour ? [product.colour] : []);
              const isSelected = selectedColours.includes(col.name) || product.colour === col.name;
              return (
                <button
                  key={col.name}
                  type="button"
                  onClick={() => {
                    const nextColours = isSelected
                      ? selectedColours.filter((c) => c !== col.name)
                      : [...selectedColours, col.name];
                    setProduct({
                      ...product,
                      colour: nextColours[0] || col.name,
                      colours: nextColours,
                    });
                  }}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition cursor-pointer border ${
                    isSelected
                      ? "bg-gray-900 text-white border-gray-900 font-medium"
                      : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0 border"
                    style={{ backgroundColor: col.hex, borderColor: col.border }}
                  />
                  <span>{col.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Descriptions & AI Assistant */}
      <div className="space-y-4 border border-gray-200 bg-gray-50/50 p-4 rounded-sm">
        <div className="flex items-center justify-between">
          <span className="font-heading text-sm font-semibold text-gray-900">
            Editorial Descriptions
          </span>
          <button
            type="button"
            onClick={handleGenerateAiDescription}
            disabled={aiLoading}
            className="inline-flex items-center gap-1.5 rounded border border-[#9E7B47]/40 bg-[#9E7B47]/10 px-3 py-1 font-mono text-[11px] text-[#9E7B47] hover:bg-[#9E7B47]/20 transition cursor-pointer font-medium"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{aiLoading ? "Consulting AI Atelier..." : "Generate with AI"}</span>
          </button>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
            Short Description (Storefront Card Summary)
          </label>
          <textarea
            rows={2}
            value={product.shortDescription}
            onChange={(e) => setProduct({ ...product, shortDescription: e.target.value })}
            className="w-full rounded border border-gray-300 bg-white p-2.5 text-xs text-gray-900 focus:border-[#9E7B47] focus:outline-none font-light"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
            Architectural &amp; Specification Notes
          </label>
          <textarea
            rows={3}
            value={product.architecturalNotes}
            onChange={(e) => setProduct({ ...product, architecturalNotes: e.target.value })}
            className="w-full rounded border border-gray-300 bg-white p-2.5 text-xs text-gray-900 focus:border-[#9E7B47] focus:outline-none font-light"
          />
        </div>
      </div>
    </div>
  );
}
