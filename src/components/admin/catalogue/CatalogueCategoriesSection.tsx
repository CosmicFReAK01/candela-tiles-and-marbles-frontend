"use client";

import React, { useState, useEffect } from "react";
import { useCandelaStore } from "@/context/CandelaStoreContext";
import { ImageUploader } from "@/components/admin/ImageUploader";
import {
  Edit,
  Boxes,
  Warehouse,
  CheckCircle2,
  AlertTriangle,
  Save,
  X,
} from "lucide-react";

interface Props {
  categorySaveMsg: string;
  onNotify: (msg: string, durationMs?: number) => void;
  onSyncTotalProductsCount?: () => void;
}

export function CatalogueCategoriesSection({ categorySaveMsg, onNotify }: Props) {
  const {
    products,
    updateProduct,
    shopShowcase,
    updateShowcaseItem,
  } = useCandelaStore();

  interface CategoryItem {
    id: string;
    name: string;
    slug: string;
    description: string;
    image_url: string;
    display_order: number;
    is_active: boolean;
    product_count: number;
    total_stock_sqft: number;
  }

  const [categories, setCategories] = useState<CategoryItem[]>([
    {
      id: "cat-tiles",
      name: "Tiles",
      slug: "tiles",
      description: "Full-body porcelain, glazed vitrified tiles, large-format slabs, and anti-skid surfaces.",
      image_url: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80",
      display_order: 1,
      is_active: true,
      product_count: products.filter((p) => p.masterCategory === "Tiles").length || 3,
      total_stock_sqft: 8400,
    },
    {
      id: "cat-marbles",
      name: "Marbles",
      slug: "marbles",
      description: "Quarry-selected natural marble bundles, bookmatched Italian Statuario, Calacatta Viola, Travertino.",
      image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      display_order: 2,
      is_active: true,
      product_count: products.filter((p) => p.masterCategory === "Marbles" || p.category === "Italian Marble").length || 4,
      total_stock_sqft: 12500,
    },
    {
      id: "cat-sanitaryware",
      name: "Sanitaryware",
      slug: "sanitaryware",
      description: "Rimless wall-hung WCs, monolithic freestanding stone basins, countertop vessel sinks.",
      image_url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
      display_order: 3,
      is_active: true,
      product_count: products.filter((p) => p.masterCategory === "Sanitaryware").length || 2,
      total_stock_sqft: 450,
    },
    {
      id: "cat-faucets",
      name: "Faucets",
      slug: "faucets",
      description: "Tall basin mixers, wall-mounted concealed spouts, and thermostatic controls in brushed bronze.",
      image_url: "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?auto=format&fit=crop&w=1200&q=80",
      display_order: 4,
      is_active: true,
      product_count: products.filter((p) => p.masterCategory === "Faucets").length || 1,
      total_stock_sqft: 320,
    },
    {
      id: "cat-showers",
      name: "Showers",
      slug: "showers",
      description: "Ceiling-recessed rain and waterfall heads, thermostatic multi-way concealed diverters.",
      image_url: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=1200&q=80",
      display_order: 5,
      is_active: true,
      product_count: 1,
      total_stock_sqft: 200,
    },
    {
      id: "cat-hardware",
      name: "Hardware",
      slug: "hardware",
      description: "Diamond-knurled solid brass door levers, linear kitchen pull bars, concealed architectural hinges.",
      image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
      display_order: 6,
      is_active: true,
      product_count: 1,
      total_stock_sqft: 600,
    },
    {
      id: "cat-accessories",
      name: "Bathroom Accessories",
      slug: "bathroom-accessories",
      description: "Minimalist towel warmers, wall-mounted robe hooks, stone-inlaid soap dispensers.",
      image_url: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80",
      display_order: 7,
      is_active: true,
      product_count: 0,
      total_stock_sqft: 0,
    },
  ]);

  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [restockCategoryModal, setRestockCategoryModal] = useState<CategoryItem | null>(null);
  const [restockQtySqft, setRestockQtySqft] = useState<number>(1000);
  const [categorySaving, setCategorySaving] = useState(false);

  const setCategorySaveMsg = (msg: string) => onNotify(msg, 3000);

  useEffect(() => {
    fetch("/api/v1/admin/categories", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Failed to load categories");
        const payload = await response.json();
        return payload.data || [];
      })
      .then((items: Array<Record<string, unknown>>) => {
        if (!Array.isArray(items) || items.length === 0) return;
        setCategories(
          items.map((item) => ({
            id: String(item.id),
            name: String(item.name || ""),
            slug: String(item.slug || ""),
            description: String(item.description || ""),
            image_url: String(item.image_url || item.imageUrl || ""),
            display_order: Number(item.display_order ?? item.displayOrder ?? 0),
            is_active: Boolean(item.is_active ?? item.active ?? true),
            product_count: Number(item.product_count ?? 0),
            total_stock_sqft: Number(item.total_stock_sqft ?? 0),
          }))
        );
      })
      .catch((error) => onNotify(error.message, 3000));
  }, [onNotify]);

  const handleSaveCategory = async (cat: CategoryItem) => {
    setCategorySaving(true);
    try {
      const res = await fetch("/api/v1/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cat),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || err.message || "Failed to save category");
      }

      setCategories((prev) => prev.map((c) => (c.id === cat.id ? cat : c)));

      // Sync updated image, title & description to storefront context immediately
      const targetShowcase = shopShowcase.find(
        (s) => s.id === cat.id || s.slug.toLowerCase() === cat.slug.toLowerCase()
      );
      if (targetShowcase) {
        updateShowcaseItem("shop", targetShowcase.id, {
          title: cat.name,
          description: cat.description,
          imageUrl: cat.image_url,
        });
      }

      setEditingCategory(null);
      setCategorySaveMsg(`Category '${cat.name}' image and details saved to Supabase!`);
      setTimeout(() => setCategorySaveMsg(""), 3000);
    } catch (e: any) {
      console.error(e);
      setCategorySaveMsg(e?.message || "Failed to update category");
    } finally {
      setCategorySaving(false);
    }
  };

  const handleExecuteCategoryRestock = async () => {
    if (!restockCategoryModal || restockQtySqft <= 0) return;
    try {
      await fetch("/api/v1/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryName: restockCategoryModal.name,
          addedStockSqft: restockQtySqft,
        }),
      });

      // Update in context products
      products.forEach((p) => {
        if (p.masterCategory === restockCategoryModal.name || p.category === restockCategoryModal.name) {
          updateProduct(p.id, {
            stockSqftAvailable: (p.stockSqftAvailable || 0) + restockQtySqft,
            inStock: true,
            lastRestockedAt: new Date().toISOString().split("T")[0],
          });
        }
      });

      setCategories((prev) =>
        prev.map((c) =>
          c.id === restockCategoryModal.id
            ? { ...c, total_stock_sqft: c.total_stock_sqft + restockQtySqft }
            : c
        )
      );

      setCategorySaveMsg(
        `Successfully added +${restockQtySqft.toLocaleString()} sq.ft to all items in category '${restockCategoryModal.name}'!`
      );
      setRestockCategoryModal(null);
      setTimeout(() => setCategorySaveMsg(""), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
<div className="space-y-5">
  <div className="border border-candela-border bg-candela-surface/75 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
    <p className="text-xs text-candela-text font-sans">
      <strong>Category Logistics Hub ({categories.length}):</strong> Review product counts and aggregate warehouse stock per surface category. Upload or change category cover images and trigger category-wide restocking below.
    </p>
  </div>

  {categorySaveMsg && (
    <div className="border border-emerald-300 bg-emerald-50 p-3 text-xs font-mono text-emerald-900 flex items-center gap-2">
      <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
      <span>{categorySaveMsg}</span>
    </div>
  )}

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
    {categories.map((cat) => (
      <div
        key={cat.id}
        className="bg-white border border-gray-200 rounded-sm shadow-xs overflow-hidden flex flex-col justify-between"
      >
        <div>
          <div className="h-36 w-full relative overflow-hidden bg-gray-100">
            <img
              src={cat.image_url}
              alt={cat.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[10px] font-mono">
              Order: #{cat.display_order}
            </div>
          </div>

          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-semibold text-gray-900">
                {cat.name}
              </h3>
              <span className="text-[10px] font-mono bg-[#FAF5EE] text-[#9E7B47] px-2 py-0.5 rounded border border-[#EADCC9]">
                /{cat.slug}
              </span>
            </div>

            <p className="text-xs text-gray-600 font-light line-clamp-2">
              {cat.description}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-xs font-mono">
              <div>
                <span className="text-[10px] text-gray-400 block">Products Listed</span>
                <span className="font-semibold text-gray-900">{cat.product_count} items</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">Warehouse Stock</span>
                <span className="font-semibold text-emerald-700">
                  {cat.total_stock_sqft.toLocaleString()} sq.ft
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setEditingCategory(cat)}
            className="flex-1 py-1.5 text-center text-xs font-mono text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 transition cursor-pointer"
          >
            Edit Category
          </button>
          <button
            type="button"
            onClick={() => {
              setRestockCategoryModal(cat);
              setRestockQtySqft(1000);
            }}
            className="flex-1 py-1.5 text-center text-xs font-mono text-white bg-[#9E7B47] rounded hover:bg-[#856535] transition cursor-pointer font-semibold shadow-xs flex items-center justify-center gap-1"
          >
            <Warehouse className="h-3 w-3" />
            Restock Category
          </button>
        </div>
      </div>
    ))}
  </div>

  {/* Restock Category Modal */}
  {restockCategoryModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-sm border border-gray-200 shadow-2xl max-w-md w-full p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <h3 className="font-heading text-base font-semibold text-gray-900">
            Restock Category: {restockCategoryModal.name}
          </h3>
          <button
            type="button"
            onClick={() => setRestockCategoryModal(null)}
            className="p-1 text-gray-400 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs text-gray-600 font-sans">
          This bulk action adds square footage to all <strong>{restockCategoryModal.product_count}</strong> active products catalogued under <strong>{restockCategoryModal.name}</strong> and marks them as in-stock with current timestamp.
        </p>

        <div className="space-y-2">
          <label className="block text-xs font-mono text-gray-700">
            Square Footage to Add (Sq.Ft)
          </label>
          <input
            type="number"
            value={restockQtySqft}
            onChange={(e) => setRestockQtySqft(Number(e.target.value) || 0)}
            className="w-full rounded border border-gray-300 p-2 text-sm font-mono text-gray-900 focus:border-[#9E7B47] focus:outline-none"
            placeholder="e.g. 1500"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setRestockCategoryModal(null)}
            className="px-3 py-1.5 text-xs font-mono text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExecuteCategoryRestock}
            className="bg-[#9E7B47] text-white px-4 py-1.5 font-mono text-xs uppercase tracking-wider rounded-sm hover:bg-[#856535] transition shadow-xs font-semibold"
          >
            Confirm Restock
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Edit Category Modal */}
  {editingCategory && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4">
      <div className="bg-candela-bg border border-candela-border shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-candela-border pb-3">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-candela-accent block">
              Department Photography &amp; Metadata
            </span>
            <h3 className="font-heading text-xl text-candela-text">
              Edit Category: {editingCategory.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setEditingCategory(null)}
            aria-label="Close modal"
            className="p-1.5 text-candela-secondary hover:text-candela-text cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-candela-secondary mb-1">Category Name</label>
              <input
                type="text"
                value={editingCategory.name}
                onChange={(e) =>
                  setEditingCategory({ ...editingCategory, name: e.target.value })
                }
                className="w-full border border-candela-border bg-white p-2.5 font-sans text-candela-text focus:border-candela-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-candela-secondary mb-1">Display Order</label>
              <input
                type="number"
                value={editingCategory.display_order}
                onChange={(e) =>
                  setEditingCategory({
                    ...editingCategory,
                    display_order: Number(e.target.value) || 1,
                  })
                }
                className="w-full border border-candela-border bg-white p-2.5 font-mono text-candela-text focus:border-candela-accent focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-candela-secondary mb-1">Description</label>
            <textarea
              rows={2}
              value={editingCategory.description}
              onChange={(e) =>
                setEditingCategory({ ...editingCategory, description: e.target.value })
              }
              className="w-full border border-candela-border bg-white p-2.5 font-sans text-candela-text focus:border-candela-accent focus:outline-none"
            />
          </div>

          <div className="space-y-2 border-t border-candela-border pt-3">
            <ImageUploader
              currentImageUrl={editingCategory.image_url}
              onImageChange={(newUrl) =>
                setEditingCategory({ ...editingCategory, image_url: newUrl })
              }
              label="Category Cover Image (Upload File or Enter URL)"
              helperText="Displayed on Homepage Bento Grid and Department Showcases."
              aspectRatioHint="16:9 or 4:3 landscape photography"
              categoryScope="CATEGORY"
            />

            <div>
              <label className="block text-[10px] text-candela-secondary mb-1">
                Or Edit Direct Image URL
              </label>
              <input
                type="text"
                value={editingCategory.image_url}
                onChange={(e) =>
                  setEditingCategory({ ...editingCategory, image_url: e.target.value })
                }
                placeholder="https://..."
                className="w-full border border-candela-border bg-white p-2 font-mono text-[11px] text-candela-text focus:border-candela-accent focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-candela-border">
          <button
            type="button"
            onClick={() => setEditingCategory(null)}
            className="px-4 py-2 text-xs font-mono text-candela-secondary hover:text-candela-text cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={categorySaving}
            onClick={() => handleSaveCategory(editingCategory)}
            className="bg-candela-accent text-white px-5 py-2 font-mono text-xs uppercase tracking-widest hover:bg-candela-dark transition cursor-pointer disabled:opacity-60"
          >
            {categorySaving ? "Saving..." : "Save Category"}
          </button>
        </div>
      </div>
    </div>
  )}
</div>
  );
}
