"use client";

import React from "react";
import { AdminProduct } from "@/types";
import { X, Save } from "lucide-react";
import { useProductEditor, EditorTab } from "@/hooks/useProductEditor";
import { GeneralIdentityTab } from "@/components/admin/product-editor/GeneralIdentityTab";
import { AttributesSpecsTab } from "@/components/admin/product-editor/AttributesSpecsTab";
import { MediaAnglesTab } from "@/components/admin/product-editor/MediaAnglesTab";
import { Sequence360Tab } from "@/components/admin/product-editor/Sequence360Tab";
import { InventoryPricingTab } from "@/components/admin/product-editor/InventoryPricingTab";
import {
  SeoMetaTab,
  VersionHistoryTab,
} from "@/components/admin/product-editor/SeoAndHistoryTabs";

interface AdminProductEditorModalProps {
  product: AdminProduct;
  isNew?: boolean;
  onClose: () => void;
  onSave: (product: AdminProduct) => void;
}

const EDITOR_TABS: { id: EditorTab; label: string }[] = [
  { id: "general", label: "General" },
  { id: "attributes", label: "Category Attributes" },
  { id: "media", label: "Display Images" },
  { id: "sequence360", label: "360° Spin Images" },
  { id: "inventory", label: "Inventory & Zone" },
  { id: "seo", label: "SEO Meta" },
  { id: "history", label: "Version History" },
];

export function AdminProductEditorModal({
  product: initialProduct,
  isNew = false,
  onClose,
  onSave,
}: AdminProductEditorModalProps) {
  const {
    product,
    setProduct,
    activeTab,
    setActiveTab,
    active360FrameIndex,
    setActive360FrameIndex,
    isAutoSpinning,
    setIsAutoSpinning,
    newFrameInput,
    setNewFrameInput,
    newSpecLabel,
    setNewSpecLabel,
    newSpecValue,
    setNewSpecValue,
    aiLoading,
    add360Frame,
    remove360Frame,
    update360FrameUrl,
    addCustomSpec,
    removeCustomSpec,
    generateAiDescription,
    saveProduct,
  } = useProductEditor({ initialProduct, onSave });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveProduct();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto admin-console select-text selection:bg-blue-600 selection:text-white">
      <div className="relative flex flex-col w-full max-w-5xl rounded-sm border border-gray-200 bg-white text-gray-900 shadow-2xl max-h-[92vh]">
        {/* Sticky Top Action Bar */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-white">
          <div className="flex items-center gap-3">
            <span className="font-serif text-sm font-bold text-[#9E7B47]">
              {isNew ? "CREATE LOT" : "EDIT SPECIFICATION"}
            </span>
            <span className="text-gray-300 text-xs">/</span>
            <h2 className="font-heading text-lg font-semibold text-gray-900 truncate max-w-md">
              {product.name || "Untitled Surface"}
            </h2>
            <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 border border-gray-200 text-gray-600 rounded">
              {product.sku}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 bg-[#9E7B47] px-5 py-2 font-mono text-xs uppercase tracking-wider text-white hover:bg-[#856535] transition cursor-pointer shadow-sm rounded-sm"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save &amp; Publish</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-sm border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-400 transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="flex items-center border-b border-gray-200 bg-gray-50 px-6 overflow-x-auto">
          {EDITOR_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-mono text-xs uppercase tracking-wider border-b-2 transition whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "border-[#9E7B47] text-[#9E7B47] font-semibold bg-[#9E7B47]/10"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Editor Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "general" && (
            <GeneralIdentityTab
              product={product}
              setProduct={setProduct}
              aiLoading={aiLoading}
              onGenerateAiDescription={generateAiDescription}
            />
          )}

          {activeTab === "attributes" && (
            <AttributesSpecsTab
              product={product}
              setProduct={setProduct}
              newSpecLabel={newSpecLabel}
              setNewSpecLabel={setNewSpecLabel}
              newSpecValue={newSpecValue}
              setNewSpecValue={setNewSpecValue}
              onAddCustomSpec={addCustomSpec}
              onRemoveCustomSpec={removeCustomSpec}
            />
          )}

          {activeTab === "media" && (
            <MediaAnglesTab product={product} setProduct={setProduct} />
          )}

          {activeTab === "sequence360" && (
            <Sequence360Tab
              product={product}
              setProduct={setProduct}
              active360FrameIndex={active360FrameIndex}
              setActive360FrameIndex={setActive360FrameIndex}
              isAutoSpinning={isAutoSpinning}
              setIsAutoSpinning={setIsAutoSpinning}
              newFrameInput={newFrameInput}
              setNewFrameInput={setNewFrameInput}
              onAdd360Frame={add360Frame}
              onRemove360Frame={remove360Frame}
              onUpdate360FrameUrl={update360FrameUrl}
            />
          )}

          {activeTab === "inventory" && (
            <InventoryPricingTab product={product} setProduct={setProduct} />
          )}

          {activeTab === "seo" && (
            <SeoMetaTab product={product} setProduct={setProduct} />
          )}

          {activeTab === "history" && (
            <VersionHistoryTab product={product} setProduct={setProduct} />
          )}
        </div>
      </div>
    </div>
  );
}
