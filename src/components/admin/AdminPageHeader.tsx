"use client";

import React from "react";
import { AdminConsoleTab } from "./AdminSidebar";
import { ExternalLink, Plus } from "lucide-react";

const BREADCRUMB_MAP: Record<
  AdminConsoleTab,
  { parent?: string; title: string; description: string }
> = {
  dashboard: {
    title: "Executive Overview",
    description: "Live metrics across catalogue lots, stock availability, and client enquiries.",
  },
  website: {
    parent: "Storefront CMS",
    title: "Website Content & Navigation",
    description: "Edit homepage sections, informational pages, and storefront menus stored in Supabase.",
  },
  catalogue: {
    parent: "Catalogue",
    title: "Products, Categories & Collections",
    description: "Manage live architectural surfaces, pricing, dimensions, and category classifications.",
  },
  inspiration: {
    parent: "Storefront",
    title: "Realized Architectural Projects",
    description: "Curate completed residential and commercial case studies with material tags.",
  },
  inventory: {
    parent: "Operations",
    title: "Inventory & Yard Logistics",
    description: "Monitor active square footage, bay locations, and low-stock thresholds.",
  },
  media: {
    title: "Media & Texture Asset Library",
    description: "Upload surface imagery, ingest external references, and cascade URL updates.",
  },
  sales: {
    parent: "CRM",
    title: "Sales Analytics & Client Enquiries",
    description: "Track inbound project specifications from architects, homeowners, and developers.",
  },
  business: {
    title: "Showrooms & Concierge",
    description: "Manage Bhiwandi & Navi Mumbai gallery addresses, phone lines, and hours.",
  },
  system: {
    parent: "Security",
    title: "Security, Diagnostics & Session Log",
    description: "Verify JWT middleware protection, Supabase connectivity, and session activity.",
  },
};

interface AdminPageHeaderProps {
  activeTab: AdminConsoleTab;
  onPrimaryAction?: () => void;
  previewHref?: string;
}

export function AdminPageHeader({
  activeTab,
  onPrimaryAction,
  previewHref = "/",
}: AdminPageHeaderProps) {
  const meta = BREADCRUMB_MAP[activeTab];

  return (
    <div className="border-b border-candela-border bg-candela-surface/75 px-6 py-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 mb-1">
        <span className="font-mono text-[10px] uppercase tracking-widest text-candela-secondary">
          Atelier Backoffice
        </span>
        {meta.parent && (
          <>
            <span className="font-mono text-[10px] text-candela-border">/</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-candela-secondary">
              {meta.parent}
            </span>
          </>
        )}
        <span className="font-mono text-[10px] text-candela-border">/</span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-candela-accent font-semibold">
          {meta.title}
        </span>
      </div>

      {/* Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-normal text-candela-text leading-tight">
            {meta.title}
          </h1>
          <p className="text-xs text-candela-secondary mt-1 max-w-2xl">
            {meta.description}
          </p>
        </div>

        {/* Contextual Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {(activeTab === "website" ||
            activeTab === "catalogue" ||
            activeTab === "inspiration") && (
            <a
              href={previewHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 border border-candela-border bg-candela-bg px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-candela-text hover:border-candela-accent hover:text-candela-accent transition"
            >
              <span>Preview Live Site</span>
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          )}
          {activeTab === "catalogue" && onPrimaryAction && (
            <button
              type="button"
              onClick={onPrimaryAction}
              className="inline-flex items-center gap-2 bg-candela-accent px-5 py-2 font-mono text-[11px] uppercase tracking-widest text-white hover:bg-candela-dark transition cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Add Surface Lot</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
