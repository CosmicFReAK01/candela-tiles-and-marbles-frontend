"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  FileText,
  Navigation as NavIcon,
  Home,
  CheckCircle2,
} from "lucide-react";
import { CmsHomepageSection } from "@/components/admin/cms/CmsHomepageSection";
import { CmsPagesSection } from "@/components/admin/cms/CmsPagesSection";
import { CmsNavigationSection } from "@/components/admin/cms/CmsNavigationSection";

interface AdminCmsBuilderTabProps {
  activeSubTab?: string;
  onSubTabChange?: (subTab: string) => void;
}

export function AdminCmsBuilderTab({
  activeSubTab = "website-homepage",
  onSubTabChange,
}: AdminCmsBuilderTabProps) {
  const [currentSection, setCurrentSection] = useState<"homepage" | "pages" | "navigation">(
    activeSubTab === "website-pages"
      ? "pages"
      : activeSubTab === "website-navigation"
      ? "navigation"
      : "homepage"
  );
  const [saveToast, setSaveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (activeSubTab === "website-pages") setCurrentSection("pages");
    else if (activeSubTab === "website-navigation") setCurrentSection("navigation");
    else setCurrentSection("homepage");
  }, [activeSubTab]);

  const handleTabSwitch = (sec: "homepage" | "pages" | "navigation") => {
    setCurrentSection(sec);
    if (onSubTabChange) {
      onSubTabChange(`website-${sec}`);
    }
  };

  const handleToast = useCallback((message: string) => {
    setToastMessage(message);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#9E7B47] font-semibold">
            Visual Atelier Studio &amp; Content Management
          </span>
          <h1 className="font-heading text-2xl font-semibold text-gray-900">
            Website Content &amp; Architecture Engine
          </h1>
          <p className="text-xs text-gray-500 font-light">
            Live editable storefront homepage text &amp; images, specialized architectural pages, and global navigation menus.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-sm border border-gray-200">
          <button
            type="button"
            onClick={() => handleTabSwitch("homepage")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-mono transition cursor-pointer ${
              currentSection === "homepage"
                ? "bg-white text-gray-900 font-semibold shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Home className="h-3.5 w-3.5 text-[#9E7B47]" />
            Homepage
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch("pages")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-mono transition cursor-pointer ${
              currentSection === "pages"
                ? "bg-white text-gray-900 font-semibold shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FileText className="h-3.5 w-3.5 text-[#9E7B47]" />
            Pages (6)
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch("navigation")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-mono transition cursor-pointer ${
              currentSection === "navigation"
                ? "bg-white text-gray-900 font-semibold shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <NavIcon className="h-3.5 w-3.5 text-[#9E7B47]" />
            Navigation
          </button>
        </div>
      </div>

      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-900 text-white px-4 py-3 rounded shadow-xl border border-emerald-700 animate-slide-up text-xs font-mono">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {currentSection === "homepage" && <CmsHomepageSection onToast={handleToast} />}
      {currentSection === "pages" && <CmsPagesSection onToast={handleToast} />}
      {currentSection === "navigation" && <CmsNavigationSection onToast={handleToast} />}
    </div>
  );
}
