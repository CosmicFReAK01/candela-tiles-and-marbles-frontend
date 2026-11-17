"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AdminProduct } from "@/types";
import { useCandelaStore } from "@/context/CandelaStoreContext";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";

interface Props {
  onEditProduct: (product: AdminProduct) => void;
  onNewProduct: () => void;
}

export function CatalogueProductsSection({ onEditProduct, onNewProduct }: Props) {
  const {
    products,
    deleteProduct,
    vendorCategoryScope,
    isProductImageUpdated,
    removeUnupdatedImageProducts,
  } = useCandelaStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [imageFilter, setImageFilter] = useState<"all" | "updated" | "unupdated">("all");

  const allowedProducts =
    vendorCategoryScope === "all"
      ? products
      : products.filter((p) => p.masterCategory === vendorCategoryScope);

  const unupdatedCount = allowedProducts.filter((p) => !isProductImageUpdated(p)).length;
  const updatedCount = allowedProducts.filter((p) => isProductImageUpdated(p)).length;

  const filteredProducts = allowedProducts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.collectionName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.finish?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all"
        ? true
        : p.masterCategory === selectedCategory ||
          (p.categories && p.categories.includes(selectedCategory)) ||
          p.category === selectedCategory ||
          p.subcategory === selectedCategory ||
          (p.subcategories && p.subcategories.includes(selectedCategory));

    const matchesImage =
      imageFilter === "all"
        ? true
        : imageFilter === "updated"
        ? isProductImageUpdated(p)
        : !isProductImageUpdated(p);

    return matchesSearch && matchesCategory && matchesImage;
  });

  const handleRemoveUnupdated = () => {
    if (unupdatedCount === 0) {
      alert("All products have valid display images.");
      return;
    }
    if (
      confirm(
        `Are you sure you want to remove all ${unupdatedCount} product(s) whose image has not been updated?`
      )
    ) {
      const removed = removeUnupdatedImageProducts();
      alert(`Successfully removed ${removed} item(s) without updated images.`);
    }
  };

  return (
<div className="space-y-4">
  {/* Controls Bar */}
  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border border-gray-200 bg-white p-3 rounded-sm shadow-sm">
    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
      {/* Search */}
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search SKU, name, finish..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded border border-gray-300 bg-gray-50/50 py-1.5 pl-9 pr-3 text-xs font-mono text-gray-900 placeholder-gray-400 focus:border-[#9E7B47] focus:bg-white focus:outline-none transition"
        />
      </div>

      {/* Category Filter */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="rounded border border-gray-300 py-1.5 px-2.5 text-xs font-mono text-gray-700 bg-white"
      >
        <option value="all">All Categories</option>
        <option value="Tiles">Tiles</option>
        <option value="Marbles">Marbles</option>
        <option value="Sanitaryware">Sanitaryware</option>
        <option value="Faucets">Faucets</option>
        <option value="Showers">Showers</option>
        <option value="Hardware">Hardware</option>
      </select>
    </div>

    <div className="flex items-center gap-2">
      {unupdatedCount > 0 && (
        <button
          type="button"
          onClick={handleRemoveUnupdated}
          className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 font-mono text-xs uppercase tracking-wider hover:bg-red-100 transition cursor-pointer shadow-xs rounded-sm"
          title="Remove items whose image has not been updated"
        >
          <Trash2 className="h-3 w-3" />
          <span>Purge Un-Updated ({unupdatedCount})</span>
        </button>
      )}

      <button
        type="button"
        onClick={onNewProduct}
        className="inline-flex items-center gap-1.5 bg-[#9E7B47] px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider text-white hover:bg-[#856535] transition cursor-pointer shadow-sm rounded-sm font-semibold"
      >
        <Plus className="h-3.5 w-3.5" />
        <span>Add Product</span>
      </button>
    </div>
  </div>

  {/* Products Table with Full Details */}
  <div className="border border-gray-200 bg-white rounded-sm shadow-sm overflow-x-auto">
    <table className="w-full text-left text-xs font-mono">
      <thead className="bg-[#FAF5EE] border-b border-gray-200 text-gray-600 uppercase tracking-wider text-[10px]">
        <tr>
          <th className="py-2.5 px-3 w-16">Preview</th>
          <th className="py-2.5 px-3">SKU &amp; Name</th>
          <th className="py-2.5 px-3">Category / Collection</th>
          <th className="py-2.5 px-3">Dimensions &amp; Finish</th>
          <th className="py-2.5 px-3">Price (₹)</th>
          <th className="py-2.5 px-3 text-[#9E7B47]">Stock (Sq.ft)</th>
          <th className="py-2.5 px-3 text-blue-700">Stock (Units)</th>
          <th className="py-2.5 px-3">Interactive</th>
          <th className="py-2.5 px-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {filteredProducts.map((p) => {
          const isImgUpdated = isProductImageUpdated(p);
          const isLowStock = (p.stockSqftAvailable || 0) < (p.lowStockThresholdSqft || 500);
          const unitsStock =
            p.stockUnitsAvailable !== undefined
              ? p.stockUnitsAvailable
              : Math.round((p.stockSqftAvailable || 0) / (p.sqftPerBox || 20));

          return (
            <tr key={p.id} className="hover:bg-gray-50/70 transition">
              {/* Image Thumbnail */}
              <td className="py-2 px-3">
                <div className="h-10 w-10 rounded border border-gray-200 overflow-hidden bg-gray-100 shrink-0">
                  {p.media?.primaryImage ? (
                    <img
                      src={p.media.primaryImage}
                      alt={p.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-[8px] text-gray-400">
                      No Img
                    </div>
                  )}
                </div>
              </td>

              {/* SKU & Name */}
              <td className="py-2 px-3">
                <span className="font-mono text-[10px] text-[#9E7B47] block font-semibold">
                  {p.sku}
                </span>
                <span className="font-sans font-medium text-gray-900 text-xs block">
                  {p.name}
                </span>
              </td>

              {/* Category & Collection (Multi-category support) */}
              <td className="py-2 px-3">
                <div className="flex flex-wrap gap-1 mb-1">
                  {(p.categories && p.categories.length > 0
                    ? p.categories
                    : [p.masterCategory || p.category]
                  ).map((catName, idx) => (
                    <span
                      key={idx}
                      className="inline-block bg-amber-50 text-amber-900 border border-amber-200 px-1.5 py-0.2 rounded text-[9px] font-medium"
                    >
                      {catName}
                    </span>
                  ))}
                </div>
                <span className="block text-gray-600 text-[10px] font-sans">
                  {p.collectionName}
                </span>
                {p.subcategory && (
                  <span className="block text-gray-400 text-[9px] font-mono">
                    {p.subcategory}
                  </span>
                )}
              </td>

              {/* Dimensions & Finish */}
              <td className="py-2 px-3">
                <span className="text-gray-900 block">{p.dimensionsMm}</span>
                <span className="text-gray-500 text-[10px]">{p.finish}</span>
              </td>

              {/* Price */}
              <td className="py-2 px-3">
                <span className="font-semibold text-gray-900 block">
                  ₹{p.pricePerSqftInr?.toLocaleString() || "Enquire"}
                </span>
                <span className="text-[9px] text-gray-400 font-mono block">/sq.ft</span>
              </td>

              {/* Stock (Sq.ft) */}
              <td className="py-2 px-3">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-semibold ${
                      isLowStock ? "text-amber-700" : "text-emerald-700"
                    }`}
                  >
                    {(p.stockSqftAvailable || 0).toLocaleString()} sq.ft
                  </span>
                  {isLowStock && (
                    <span title="Low Stock">
                      <AlertTriangle className="h-3 w-3 text-amber-600" />
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-gray-400 block truncate max-w-[120px]">
                  {p.warehouseZone || "Bhiwandi Bay A1"}
                </span>
              </td>

              {/* Stock (Units) */}
              <td className="py-2 px-3 font-mono">
                <span className="inline-block bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                  {unitsStock.toLocaleString()} Units
                </span>
                <span className="text-[9px] text-gray-400 block mt-0.5">
                  ~{p.piecesPerBox || 1} pcs/box
                </span>
              </td>

              {/* Interactive Badges */}
              <td className="py-2 px-3">
                <div className="flex items-center gap-1">
                  {p.viewer360?.enabled && (
                    <span className="bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded text-[9px]">
                      360°
                    </span>
                  )}
                  {p.visualizerAssets?.texture && (
                    <span className="bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.5 rounded text-[9px]">
                      3D PBR
                    </span>
                  )}
                </div>
              </td>

              {/* Actions */}
              <td className="py-2 px-3 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <Link
                    href={`/product/${p.slug}`}
                    target="_blank"
                    className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                    title="View on Storefront"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => onEditProduct(p)}
                    className="p-1 rounded text-gray-500 hover:text-[#9E7B47] hover:bg-gray-100 cursor-pointer"
                    title="Edit Product Details"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete product ${p.name}?`)) deleteProduct(p.id);
                    }}
                    className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
</div>
  );
}
