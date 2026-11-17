"use client";

import React, { useCallback, useEffect, useState } from "react";
import { AdminProduct } from "@/types";
import { useCandelaStore } from "@/context/CandelaStoreContext";
import { Layers, FolderTree, Boxes, CheckCircle2 } from "lucide-react";
import { CatalogueProductsSection } from "@/components/admin/catalogue/CatalogueProductsSection";
import { CatalogueCategoriesSection } from "@/components/admin/catalogue/CatalogueCategoriesSection";
import { CatalogueCollectionsSection } from "@/components/admin/catalogue/CatalogueCollectionsSection";

interface AdminCatalogueTabProps {
  onEditProduct: (product: AdminProduct) => void;
  onNewProduct: () => void;
  activeSubTab?: string;
  onSubTabChange?: (subTab: string) => void;
}

export function AdminCatalogueTab({
  onEditProduct,
  onNewProduct,
  activeSubTab = "catalogue-products",
  onSubTabChange,
}: AdminCatalogueTabProps) {
  const { products, collectionsShowcase } = useCandelaStore();

  const [currentSection, setCurrentSection] = useState<"products" | "categories" | "collections">(
    activeSubTab === "catalogue-categories"
      ? "categories"
      : activeSubTab === "catalogue-collections"
      ? "collections"
      : "products"
  );
  const [categorySaveMsg, setCategorySaveMsg] = useState("");
  const [collectionsCount, setCollectionsCount] = useState<number>(
    collectionsShowcase.length || 7
  );

  useEffect(() => {
    if (activeSubTab === "catalogue-categories") setCurrentSection("categories");
    else if (activeSubTab === "catalogue-collections") setCurrentSection("collections");
    else setCurrentSection("products");
  }, [activeSubTab]);

  const handleSwitchSection = (sec: "products" | "categories" | "collections") => {
    setCurrentSection(sec);
    if (onSubTabChange) onSubTabChange(`catalogue-${sec}`);
  };

  const handleNotify = useCallback((msg: string, durationMs = 3000) => {
    setCategorySaveMsg(msg);
    setTimeout(() => setCategorySaveMsg(""), durationMs);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#9E7B47] font-semibold">
            Master Surfaces &amp; Architectural Catalogue
          </span>
          <h1 className="font-heading text-2xl font-semibold text-gray-900">
            Catalogue Management
          </h1>
          <p className="text-xs text-gray-500 font-light">
            Manage live products, vendor category allocations &amp; restock triggers, and curated collections.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-sm border border-gray-200">
          <button
            type="button"
            onClick={() => handleSwitchSection("products")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-mono transition cursor-pointer ${
              currentSection === "products"
                ? "bg-white text-gray-900 font-semibold shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-[#9E7B47]" />
            Products ({products.length})
          </button>
          <button
            type="button"
            onClick={() => handleSwitchSection("categories")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-mono transition cursor-pointer ${
              currentSection === "categories"
                ? "bg-white text-gray-900 font-semibold shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FolderTree className="h-3.5 w-3.5 text-[#9E7B47]" />
            Categories (7)
          </button>
          <button
            type="button"
            onClick={() => handleSwitchSection("collections")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-mono transition cursor-pointer ${
              currentSection === "collections"
                ? "bg-white text-gray-900 font-semibold shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Boxes className="h-3.5 w-3.5 text-[#9E7B47]" />
            Collections ({collectionsCount})
          </button>
        </div>
      </div>

      {categorySaveMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-900 text-white px-4 py-3 rounded shadow-xl border border-emerald-700 animate-slide-up text-xs font-mono">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{categorySaveMsg}</span>
        </div>
      )}

      {currentSection === "products" && (
        <CatalogueProductsSection
          onEditProduct={onEditProduct}
          onNewProduct={onNewProduct}
        />
      )}

      {currentSection === "categories" && (
        <CatalogueCategoriesSection
          categorySaveMsg={categorySaveMsg}
          onNotify={handleNotify}
        />
      )}

      {currentSection === "collections" && (
        <CatalogueCollectionsSection
          onNotify={handleNotify}
          onCountChange={setCollectionsCount}
        />
      )}
    </div>
  );
}
