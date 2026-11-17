"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCandelaStore } from "@/context/CandelaStoreContext";
import { InspirationProject } from "@/types";
import { ImageUploader } from "@/components/admin/ImageUploader";
import {
  Sparkles,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  MapPin,
  Search,
  Check,
  X,
  Save,
  Tag,
  Layers,
} from "lucide-react";

export function AdminInspirationTab() {
  const { inspirations, addInspiration, updateInspiration, deleteInspiration } = useCandelaStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [editingItem, setEditingItem] = useState<InspirationProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Living Room & Foyer");
  const [formLocation, setFormLocation] = useState("Mumbai, Maharashtra");
  const [formDesc, setFormDesc] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formProducts, setFormProducts] = useState("");

  const filteredItems = (inspirations || []).filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.productsUsed?.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" ||
      item.category.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const handleOpenNew = () => {
    setIsNew(true);
    setEditingItem(null);
    setFormTitle("");
    setFormCategory("Living Room & Foyer");
    setFormLocation("Mumbai, Maharashtra");
    setFormDesc("");
    setFormImage("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80");
    setFormProducts("Calacatta Viola Riserva, Travertino Navona Vein-Cut");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: InspirationProject) => {
    setIsNew(false);
    setEditingItem(item);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormLocation(item.location);
    setFormDesc(item.description);
    setFormImage(item.imageUrl);
    setFormProducts(item.productsUsed?.join(", ") || "");
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const productsArray = formProducts
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    if (isNew) {
      const newItem: InspirationProject = {
        id: `proj-${Date.now()}`,
        title: formTitle,
        category: formCategory,
        location: formLocation,
        description: formDesc,
        imageUrl: formImage,
        productsUsed: productsArray,
      };
      addInspiration(newItem);
    } else if (editingItem) {
      updateInspiration(editingItem.id, {
        title: formTitle,
        category: formCategory,
        location: formLocation,
        description: formDesc,
        imageUrl: formImage,
        productsUsed: productsArray,
      });
    }

    setIsModalOpen(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#9E7B47] font-semibold">
            Visual Design Studio
          </span>
          <h1 className="font-heading text-2xl font-semibold text-gray-900">
            Inspiration &amp; Design Projects ({filteredItems.length})
          </h1>
          <p className="text-xs text-gray-500 font-light">
            Curate realized luxury projects, room spaces, and visual surface ideas for visiting architects and homeowners.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/inspiration"
            target="_blank"
            className="inline-flex items-center gap-1.5 border border-gray-300 bg-white px-3.5 py-2 font-mono text-xs text-gray-700 hover:text-[#9E7B47] hover:border-[#9E7B47] transition cursor-pointer shadow-xs rounded-sm"
          >
            <span>View /inspiration Gallery</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>

          <button
            type="button"
            onClick={handleOpenNew}
            className="inline-flex items-center gap-1.5 bg-[#9E7B47] px-4 py-2 font-mono text-xs uppercase tracking-wider text-white hover:bg-[#856535] transition cursor-pointer shadow-sm rounded-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Inspiration Project</span>
          </button>
        </div>
      </div>

      {saveToast && (
        <div className="rounded border border-emerald-300 bg-emerald-50 p-3 text-xs font-mono text-emerald-800 flex items-center gap-2 shadow-xs">
          <Check className="h-4 w-4 text-emerald-600" />
          <span>Inspiration project saved and synchronized with customer storefront!</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border border-gray-200 bg-white p-3 rounded-sm shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects by room, city, surface..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded border border-gray-300 bg-gray-50/50 py-1.5 pl-9 pr-3 text-xs font-mono text-gray-900 placeholder-gray-400 focus:border-[#9E7B47] focus:bg-white focus:outline-none transition"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {["all", "living", "bathroom", "kitchen", "facade"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs font-mono rounded transition cursor-pointer whitespace-nowrap capitalize ${
                selectedCategory === cat
                  ? "bg-[#9E7B47] text-white font-semibold shadow-xs"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {cat === "all" ? "All Spaces" : `${cat} Spaces`}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 bg-white rounded-sm shadow-sm overflow-hidden flex flex-col justify-between group hover:border-[#9E7B47] transition duration-200"
          >
            <div>
              {/* Project Image */}
              <div className="relative h-48 w-full overflow-hidden bg-gray-100 border-b border-gray-200">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2.5 left-2.5 bg-black/80 px-2 py-0.5 text-[10px] font-mono text-white rounded flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-[#9E7B47]" />
                  <span>{item.location}</span>
                </div>
                <div className="absolute top-2.5 right-2.5 bg-[#9E7B47] text-white text-[10px] font-mono px-2 py-0.5 rounded font-medium">
                  {item.category}
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-2">
                <h3 className="font-heading text-lg font-bold text-gray-900 group-hover:text-[#9E7B47] transition">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-2 font-light">
                  {item.description}
                </p>

                {/* Tagged Products */}
                {item.productsUsed && item.productsUsed.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1">
                    {item.productsUsed.map((prod, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-[10px] font-mono bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200"
                      >
                        <Tag className="h-2.5 w-2.5 text-[#9E7B47]" />
                        <span>{prod}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-100 bg-gray-50/50 p-3 flex items-center justify-between">
              <span className="font-mono text-[10px] text-gray-500">
                ID: {item.id}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 rounded hover:bg-gray-200 text-gray-600 hover:text-[#9E7B47] transition cursor-pointer"
                  title="Edit inspiration design"
                >
                  <Edit className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Delete inspiration project "${item.title}"?`)) {
                      deleteInspiration(item.id);
                    }
                  }}
                  className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition cursor-pointer"
                  title="Delete project"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full py-12 text-center text-xs font-mono text-gray-500 border border-dashed border-gray-300 rounded bg-white">
            No design inspiration projects match your search query.
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative flex flex-col w-full max-w-2xl rounded-sm border border-gray-200 bg-white text-gray-900 shadow-2xl max-h-[92vh]">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-white">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#9E7B47]" />
                <h2 className="font-heading text-lg font-bold text-gray-900">
                  {isNew ? "Add Design Inspiration Project" : `Edit: ${editingItem?.title}`}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-900 p-1 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Worli Seaface Penthouse Master Suite"
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-900 focus:border-[#9E7B47] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
                    Space / Room Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-[#9E7B47] focus:outline-none"
                  >
                    <option value="Living Room & Foyer">Living Room &amp; Foyer</option>
                    <option value="Master Bathroom & Pool Suite">Master Bathroom &amp; Pool Suite</option>
                    <option value="Kitchen & Dining">Kitchen &amp; Dining</option>
                    <option value="Exterior Facade & Verandah">Exterior Facade &amp; Verandah</option>
                    <option value="Commercial & Lobby">Commercial &amp; Lobby</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
                    Project Location / City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. Worli, Mumbai"
                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-[#9E7B47] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
                  Design Narrative &amp; Architectural Description
                </label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Describe the architectural concept, veining continuity, lighting, and finishes applied..."
                  className="w-full rounded border border-gray-300 bg-white p-2.5 text-xs text-gray-900 focus:border-[#9E7B47] focus:outline-none font-light"
                />
              </div>

              {/* Tagged Products */}
              <div>
                <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
                  Surfaces &amp; Materials Used (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formProducts}
                  onChange={(e) => setFormProducts(e.target.value)}
                  placeholder="e.g. Calacatta Viola Riserva, Travertino Navona Vein-Cut"
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-mono text-gray-900 focus:border-[#9E7B47] focus:outline-none"
                />
              </div>

              {/* Image Uploader */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="block text-xs font-mono uppercase text-gray-500">
                  Project Architectural Photography (1200 x 800)
                </label>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  {formImage && (
                    <img
                      src={formImage}
                      alt="Preview"
                      className="h-28 w-36 object-cover rounded border border-gray-200 shrink-0 bg-gray-100"
                    />
                  )}
                  <div className="flex-1 w-full">
                    <ImageUploader
                      label="Upload or Replace Design Photo"
                      currentImageUrl={formImage || ""}
                      onImageChange={(url) => setFormImage(url)}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-xs font-mono text-gray-700 hover:bg-gray-50 rounded-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 bg-[#9E7B47] px-5 py-2 font-mono text-xs uppercase tracking-wider text-white hover:bg-[#856535] rounded-sm transition cursor-pointer shadow-sm font-semibold"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{isNew ? "Create Project" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
