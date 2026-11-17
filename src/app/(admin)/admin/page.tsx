"use client";

import React, { useState } from "react";
import { AdminProduct } from "@/types";
import { useCandelaStore } from "@/context/CandelaStoreContext";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar, AdminConsoleTab } from "@/components/admin/AdminSidebar";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminDashboardTab } from "@/components/admin/tabs/AdminDashboardTab";
import { AdminCatalogueTab } from "@/components/admin/tabs/AdminCatalogueTab";
import { AdminProductEditorModal } from "@/components/admin/tabs/AdminProductEditorModal";
import { AdminCmsBuilderTab } from "@/components/admin/tabs/AdminCmsBuilderTab";
import { AdminSalesTab } from "@/components/admin/tabs/AdminSalesTab";
import { AdminInventoryTab } from "@/components/admin/tabs/AdminInventoryTab";
import { AdminMediaLibraryTab } from "@/components/admin/tabs/AdminMediaLibraryTab";
import { AdminBusinessTab } from "@/components/admin/tabs/AdminBusinessTab";
import { AdminInspirationTab } from "@/components/admin/tabs/AdminInspirationTab";
import { AdminSystemTab } from "@/components/admin/tabs/AdminSystemTab";

const createDefaultNewProduct = (): AdminProduct => ({
  id: `prod-custom-${Date.now()}`,
  sku: `CND-SLB-NEW-${Math.floor(100 + Math.random() * 900)}`,
  name: "New Architectural Surface",
  slug: `new-architectural-surface-${Date.now()}`,
  collectionName: "Luxury Collection",
  collectionSlug: "luxury",
  masterCategory: "Tiles",
  subcategory: "Floor Tiles",
  category: "Italian Marble",
  finish: "Bookmatched Polished",
  origin: "Carrara, Italy",
  dimensionsMm: "1600 x 3200 mm",
  thicknessMm: 12,
  sqftPerBox: 55.2,
  piecesPerBox: 1,
  applications: ["Flooring", "Feature Wall"],
  rooms: ["Living Room"],
  shortDescription: "Precision calibrated architectural surface.",
  architecturalNotes: "Dry-lay inspected with continuous veining.",
  inStock: true,
  pricePerSqftInr: 1450,
  dealerPricePerSqftInr: 1200,
  stockSqftAvailable: 2400,
  lowStockThresholdSqft: 500,
  warehouseZone: "Bhiwandi Bay A2",
  lastRestockedAt: new Date().toISOString().split("T")[0],
  media: {
    primaryImage: "",
    galleryImages: [],
    roughness: 0.1,
    veinColorHex: "#C5A880",
    baseColorHex: "#F5F3EF",
  },
  specs: {
    waterAbsorption: "< 0.05%",
    slipResistance: "R10 / Class B",
    stainResistance: "Class 5 (Impervious)",
    mohsHardness: "7.0 (High Traffic)",
    warrantyYears: "15 Years Structural",
  },
  viewer360: {
    enabled: true,
    frames: [
      {
        index: 1,
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      },
      {
        index: 2,
        url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    settings: { autoRotate: true, rotationSpeed: 20, direction: "clockwise" },
  },
  visualizerAssets: {
    enabled: true,
    texture:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    previewTexture:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    normalMap:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80",
    roughnessMap:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80",
    resolution: { width: 4096, height: 4096 },
  },
});

export default function AdminPage() {
  const { addProduct, updateProduct } = useCandelaStore();

  const [activeTab, setActiveTab] = useState<AdminConsoleTab>("dashboard");
  const [activeSubTab, setActiveSubTab] = useState<string>("website-homepage");
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleTabChange = (tab: AdminConsoleTab, subTab?: string) => {
    setActiveTab(tab);
    if (subTab) {
      setActiveSubTab(subTab);
    } else {
      if (tab === "website") setActiveSubTab("website-homepage");
      else if (tab === "catalogue") setActiveSubTab("catalogue-products");
      else if (tab === "sales") setActiveSubTab("sales-analytics");
    }
  };

  const handleOpenNewProduct = () => {
    setEditingProduct(createDefaultNewProduct());
    setIsNewProduct(true);
    setIsModalOpen(true);
  };

  const handleEditProduct = (prod: AdminProduct) => {
    setEditingProduct(prod);
    setIsNewProduct(false);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (savedProd: AdminProduct) => {
    if (isNewProduct) {
      addProduct(savedProd);
    } else {
      updateProduct(savedProd.id, savedProd);
    }
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handlePrimaryAction = () => {
    if (activeTab === "catalogue") handleOpenNewProduct();
  };

  return (
    <div className="h-screen bg-candela-bg text-candela-text flex flex-col font-sans admin-console select-text overflow-hidden">
      {/* ─── OBSIDIAN TOPBAR ───────────────────────────────────────── */}
      <AdminHeader
        onToggleSidebar={() => setMobileSidebarOpen((v) => !v)}
        onNavigateEnquiries={() => handleTabChange("sales", "sales-enquiries")}
      />

      {/* ─── BODY: Sidebar + Content ───────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ─── SIDEBAR ─────────────────────────────────────────────── */}
        <AdminSidebar
          activeTab={activeTab}
          activeSubTab={activeSubTab}
          onTabChange={handleTabChange}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* ─── PAGE AREA ───────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {activeTab !== "dashboard" && (
            <AdminPageHeader
              activeTab={activeTab}
              onPrimaryAction={handlePrimaryAction}
            />
          )}

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 overflow-y-auto bg-candela-bg">
            <div className="max-w-screen-2xl mx-auto p-6">
              {activeTab === "dashboard" && (
                <AdminDashboardTab
                  onNavigateTab={handleTabChange}
                  onOpenProductModal={handleOpenNewProduct}
                />
              )}

              {activeTab === "catalogue" && (
                <AdminCatalogueTab
                  onEditProduct={handleEditProduct}
                  onNewProduct={handleOpenNewProduct}
                  activeSubTab={activeSubTab}
                  onSubTabChange={(sub) => setActiveSubTab(sub)}
                />
              )}

              {activeTab === "inspiration" && <AdminInspirationTab />}

              {activeTab === "website" && (
                <AdminCmsBuilderTab
                  activeSubTab={activeSubTab}
                  onSubTabChange={(sub) => setActiveSubTab(sub)}
                />
              )}

              {activeTab === "inventory" && <AdminInventoryTab />}

              {activeTab === "sales" && (
                <AdminSalesTab
                  activeSubTab={activeSubTab}
                  onSubTabChange={(sub) => setActiveSubTab(sub)}
                />
              )}

              {activeTab === "media" && <AdminMediaLibraryTab />}
              {activeTab === "business" && <AdminBusinessTab />}
              {activeTab === "system" && <AdminSystemTab />}
            </div>
          </main>
        </div>
      </div>

      {/* ─── PRODUCT EDITOR MODAL ─────────────────────────────────── */}
      {isModalOpen && editingProduct && (
        <AdminProductEditorModal
          product={editingProduct}
          isNew={isNewProduct}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
}
