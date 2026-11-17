"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  X,
} from "lucide-react";

interface Props {
  onToast: (message: string) => void;
}

export function CmsNavigationSection({ onToast }: Props) {
  interface NavItem {
    id: string;
    nav_group: "header" | "footer_primary" | "footer_secondary" | "footer_legal";
    label: string;
    url: string;
    display_order: number;
    is_active: boolean;
  }

  const [navItems, setNavItems] = useState<NavItem[]>([
    { id: "nav-hdr-1", nav_group: "header", label: "Shop Catalogue", url: "/shop", display_order: 1, is_active: true },
    { id: "nav-hdr-2", nav_group: "header", label: "Collections", url: "/collections", display_order: 2, is_active: true },
    { id: "nav-hdr-3", nav_group: "header", label: "Explore Spaces", url: "/explore", display_order: 3, is_active: true },
    { id: "nav-hdr-4", nav_group: "header", label: "Inspiration", url: "/inspiration", display_order: 4, is_active: true },
    { id: "nav-hdr-5", nav_group: "header", label: "3D Visualizer", url: "/visualizer", display_order: 5, is_active: true },
    { id: "nav-hdr-6", nav_group: "header", label: "About Atelier", url: "/about", display_order: 6, is_active: true },
    { id: "nav-hdr-7", nav_group: "header", label: "Contact Showroom", url: "/contact", display_order: 7, is_active: true },

    { id: "nav-ft-1", nav_group: "footer_primary", label: "Italian Marble Slabs", url: "/collections/italian-marble", display_order: 1, is_active: true },
    { id: "nav-ft-2", nav_group: "footer_primary", label: "Large Porcelain Slabs", url: "/collections/porcelain-slabs", display_order: 2, is_active: true },
    { id: "nav-ft-3", nav_group: "footer_primary", label: "Travertine Collection", url: "/collections/travertine", display_order: 3, is_active: true },
    { id: "nav-ft-4", nav_group: "footer_primary", label: "Luxury Sanitaryware", url: "/shop/sanitaryware", display_order: 4, is_active: true },

    { id: "nav-ft-sec-1", nav_group: "footer_secondary", label: "About Candela Atelier", url: "/about", display_order: 1, is_active: true },
    { id: "nav-ft-sec-2", nav_group: "footer_secondary", label: "Bhiwandi Central Yard", url: "/contact", display_order: 2, is_active: true },
    { id: "nav-ft-sec-3", nav_group: "footer_secondary", label: "Turbhe Experience Studio", url: "/contact", display_order: 3, is_active: true },
    { id: "nav-ft-sec-4", nav_group: "footer_secondary", label: "Architectural Desk", url: "/enquiry", display_order: 4, is_active: true },
  ]);

  const [activeNavGroup, setActiveNavGroup] = useState<"header" | "footer_primary" | "footer_secondary">("header");
  const [editingNavItem, setEditingNavItem] = useState<NavItem | null>(null);

  const filteredNavItems = navItems.filter((n) => n.nav_group === activeNavGroup);

  const handleSaveNavItem = async (item: NavItem) => {
    try {
      await fetch("/api/v1/admin/cms/navigation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      setNavItems((prev) => {
        const exists = prev.some((n) => n.id === item.id);
        if (exists) {
          return prev.map((n) => (n.id === item.id ? item : n));
        }
        return [...prev, item];
      });
      setEditingNavItem(null);
      setEditingNavItem(null);
      onToast("Navigation updated in database!");
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteNavItem = async (id: string) => {
    if (!confirm("Are you sure you want to remove this navigation link?")) return;
    try {
      await fetch(`/api/v1/admin/cms/navigation?id=${id}`, { method: "DELETE" });
      setNavItems((prev) => prev.filter((n) => n.id !== id));
      onToast("Navigation link removed.");
    } catch (e) {
      console.error(e);
    }
  };

  return (
<div className="space-y-6">
  {/* Sub Navigation Group Switcher */}
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3 rounded-sm border border-gray-200 shadow-xs">
    <div className="flex items-center gap-2">
      <span className="text-xs font-mono text-gray-500">Menu Scope:</span>
      <div className="flex items-center gap-1 border border-gray-200 rounded p-0.5 bg-gray-50">
        <button
          type="button"
          onClick={() => setActiveNavGroup("header")}
          className={`px-3 py-1 font-mono text-xs rounded transition cursor-pointer ${
            activeNavGroup === "header"
              ? "bg-[#9E7B47] text-white font-semibold"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Head Navigation ({navItems.filter((n) => n.nav_group === "header").length})
        </button>
        <button
          type="button"
          onClick={() => setActiveNavGroup("footer_primary")}
          className={`px-3 py-1 font-mono text-xs rounded transition cursor-pointer ${
            activeNavGroup === "footer_primary"
              ? "bg-[#9E7B47] text-white font-semibold"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Footer Primary ({navItems.filter((n) => n.nav_group === "footer_primary").length})
        </button>
        <button
          type="button"
          onClick={() => setActiveNavGroup("footer_secondary")}
          className={`px-3 py-1 font-mono text-xs rounded transition cursor-pointer ${
            activeNavGroup === "footer_secondary"
              ? "bg-[#9E7B47] text-white font-semibold"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Footer Secondary ({navItems.filter((n) => n.nav_group === "footer_secondary").length})
        </button>
      </div>
    </div>

    <button
      type="button"
      onClick={() =>
        setEditingNavItem({
          id: `nav-${Date.now()}`,
          nav_group: activeNavGroup,
          label: "New Navigation Link",
          url: "/",
          display_order: filteredNavItems.length + 1,
          is_active: true,
        })
      }
      className="inline-flex items-center gap-1.5 bg-[#9E7B47] text-white px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider rounded-sm hover:bg-[#856535] transition cursor-pointer shadow-xs font-semibold"
    >
      <Plus className="h-3.5 w-3.5" />
      Add Navigation Item
    </button>
  </div>

  {/* Navigation Items List Table */}
  <div className="border border-gray-200 bg-white rounded-sm shadow-xs overflow-hidden">
    <table className="w-full text-left text-xs font-mono">
      <thead className="bg-[#FAF5EE] border-b border-gray-200 text-gray-600 uppercase tracking-wider text-[10px]">
        <tr>
          <th className="py-2.5 px-4 w-12 text-center">Order</th>
          <th className="py-2.5 px-4">Menu Label</th>
          <th className="py-2.5 px-4">Target URL</th>
          <th className="py-2.5 px-4 w-24">Status</th>
          <th className="py-2.5 px-4 w-28 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {filteredNavItems
          .sort((a, b) => a.display_order - b.display_order)
          .map((item) => (
            <tr key={item.id} className="hover:bg-gray-50/70 transition">
              <td className="py-3 px-4 text-center font-bold text-gray-500">
                {item.display_order}
              </td>
              <td className="py-3 px-4 font-sans font-medium text-gray-900">
                {item.label}
              </td>
              <td className="py-3 px-4 text-gray-600 font-mono">
                <a href={item.url} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                  {item.url}
                  <ExternalLink className="h-2.5 w-2.5 text-gray-400" />
                </a>
              </td>
              <td className="py-3 px-4">
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[10px] ${
                    item.is_active
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {item.is_active ? "Active" : "Disabled"}
                </span>
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingNavItem(item)}
                    className="p-1 rounded text-gray-500 hover:text-[#9E7B47] hover:bg-gray-100 cursor-pointer"
                    title="Edit Link"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteNavItem(item.id)}
                    className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                    title="Delete Link"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>

  {/* Edit Navigation Modal */}
  {editingNavItem && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-sm border border-gray-200 shadow-2xl max-w-md w-full p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <h3 className="font-heading text-base font-semibold text-gray-900">
            Edit Navigation Link
          </h3>
          <button
            type="button"
            onClick={() => setEditingNavItem(null)}
            className="p-1 text-gray-400 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs font-mono">
          <div>
            <label className="block text-gray-600 mb-1">Navigation Group</label>
            <select
              value={editingNavItem.nav_group}
              onChange={(e) =>
                setEditingNavItem({ ...editingNavItem, nav_group: e.target.value as any })
              }
              className="w-full rounded border border-gray-300 p-2 font-mono text-gray-900"
            >
              <option value="header">Head Navigation (Storefront Header)</option>
              <option value="footer_primary">Footer Primary (Surfaces &amp; Collections)</option>
              <option value="footer_secondary">Footer Secondary (Atelier &amp; Showrooms)</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Link Display Label</label>
            <input
              type="text"
              value={editingNavItem.label}
              onChange={(e) => setEditingNavItem({ ...editingNavItem, label: e.target.value })}
              className="w-full rounded border border-gray-300 p-2 font-sans text-gray-900"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Target URL Route</label>
            <input
              type="text"
              value={editingNavItem.url}
              onChange={(e) => setEditingNavItem({ ...editingNavItem, url: e.target.value })}
              className="w-full rounded border border-gray-300 p-2 font-mono text-gray-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-600 mb-1">Display Order</label>
              <input
                type="number"
                value={editingNavItem.display_order}
                onChange={(e) =>
                  setEditingNavItem({ ...editingNavItem, display_order: parseInt(e.target.value, 10) || 1 })
                }
                className="w-full rounded border border-gray-300 p-2 font-mono text-gray-900"
              />
            </div>
            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingNavItem.is_active}
                  onChange={(e) =>
                    setEditingNavItem({ ...editingNavItem, is_active: e.target.checked })
                  }
                  className="rounded text-[#9E7B47] focus:ring-[#9E7B47]"
                />
                <span>Link Active</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setEditingNavItem(null)}
            className="px-3 py-1.5 text-xs font-mono text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSaveNavItem(editingNavItem)}
            className="bg-[#9E7B47] text-white px-4 py-1.5 font-mono text-xs uppercase tracking-wider rounded-sm hover:bg-[#856535] transition shadow-xs font-semibold"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )}
</div>
  );
}
