"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useCandelaStore } from "@/context/CandelaStoreContext";
import { AdminConsoleTab } from "@/components/admin/AdminSidebar";
import {
  Package,
  MessageSquare,
  AlertTriangle,
  Warehouse,
  ArrowRight,
  Plus,
  Eye,
  CheckCircle2,
  Globe,
  Sparkles,
} from "lucide-react";

interface AdminDashboardTabProps {
  onNavigateTab: (tab: AdminConsoleTab, subTab?: string) => void;
  onOpenProductModal: () => void;
}

export function AdminDashboardTab({
  onNavigateTab,
  onOpenProductModal,
}: AdminDashboardTabProps) {
  const { products, enquiries } = useCandelaStore();

  const stats = useMemo(() => {
    const totalSqft = products.reduce(
      (sum, p) => sum + (Number(p.stockSqftAvailable) || 0),
      0
    );
    const lowStock = products.filter(
      (p) => (p.stockSqftAvailable || 0) < (p.lowStockThresholdSqft || 500)
    );
    const unreadEnquiries = enquiries.filter((e) => e.status === "RECEIVED");
    return {
      totalCount: products.length,
      totalSqft,
      lowStock,
      unreadEnquiries,
    };
  }, [products, enquiries]);

  return (
    <div className="space-y-8">
      {/* ─── OBSIDIAN ARCHITECTURAL HERO HEADER (Matches User Storefront) ─── */}
      <section className="relative overflow-hidden bg-[#1D1B18] text-candela-bg border border-white/10 p-6 sm:p-10">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
          aria-hidden="true"
        />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 border border-candela-accent/40 bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-candela-accent">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              <span>Atelier Executive Control</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl font-normal text-white tracking-wide leading-tight">
              Showroom &amp; Catalogue Overview
            </h1>

            <p className="text-xs sm:text-sm text-[#D7D2C8] font-light leading-relaxed">
              Managing <strong className="text-white font-medium">{stats.totalCount}</strong>{" "}
              architectural surface lots,{" "}
              <strong className="text-white font-medium">
                {stats.totalSqft.toLocaleString("en-IN")} sq.ft
              </strong>{" "}
              of calibrated stock, and{" "}
              <strong className="text-white font-medium">{enquiries.length}</strong> live
              client project enquiries in Supabase.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenProductModal}
              className="inline-flex items-center gap-2 bg-candela-accent px-5 py-3 font-mono text-xs uppercase tracking-widest text-white hover:bg-white hover:text-candela-dark transition cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Add Surface Lot</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab("website", "website-homepage")}
              className="inline-flex items-center gap-2 border border-white/25 bg-white/[0.04] px-5 py-3 font-mono text-xs uppercase tracking-widest text-[#E6E1D8] hover:border-candela-accent hover:text-candela-accent transition cursor-pointer"
            >
              <Globe className="h-3.5 w-3.5 text-candela-accent" aria-hidden="true" />
              <span>Edit Homepage CMS</span>
            </button>
          </div>
        </div>
      </section>

      {/* ─── 4 LIVE METRIC CARDS (No hardcoded placeholders) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Lots */}
        <button
          type="button"
          onClick={() => onNavigateTab("catalogue", "catalogue-products")}
          className="text-left group border border-candela-border border-t-2 border-t-candela-accent bg-candela-surface/55 p-5 hover:bg-candela-surface hover:border-candela-accent transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-candela-secondary">
              Catalogue Lots
            </span>
            <Package className="h-4 w-4 text-candela-accent" aria-hidden="true" />
          </div>
          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="font-heading text-4xl text-candela-text">
              {stats.totalCount}
            </span>
            <span className="font-mono text-[11px] text-emerald-700 font-medium">
              Published
            </span>
          </div>
          <p className="mt-2 text-xs text-candela-secondary">
            Live items synced with Supabase
          </p>
        </button>

        {/* Enquiries */}
        <button
          type="button"
          onClick={() => onNavigateTab("sales", "sales-enquiries")}
          className="text-left group border border-candela-border border-t-2 border-t-candela-accent bg-candela-surface/55 p-5 hover:bg-candela-surface hover:border-candela-accent transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-candela-secondary">
              Inbound Enquiries
            </span>
            <MessageSquare className="h-4 w-4 text-candela-accent" aria-hidden="true" />
          </div>
          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="font-heading text-4xl text-candela-text">
              {enquiries.length}
            </span>
            {stats.unreadEnquiries.length > 0 && (
              <span className="border border-amber-300 bg-amber-50 px-2 py-0.5 font-mono text-[10px] text-amber-800 font-semibold">
                {stats.unreadEnquiries.length} New
              </span>
            )}
          </div>
          <p className="mt-2 text-xs text-candela-secondary">
            Saved in public.enquiries table
          </p>
        </button>

        {/* Inventory Sq.Ft */}
        <button
          type="button"
          onClick={() => onNavigateTab("inventory")}
          className="text-left group border border-candela-border border-t-2 border-t-candela-accent bg-candela-surface/55 p-5 hover:bg-candela-surface hover:border-candela-accent transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-candela-secondary">
              Total Stock Volume
            </span>
            <Warehouse className="h-4 w-4 text-candela-accent" aria-hidden="true" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-heading text-3xl sm:text-4xl text-candela-text">
              {stats.totalSqft.toLocaleString("en-IN")}
            </span>
            <span className="font-mono text-[11px] text-candela-secondary">sq.ft</span>
          </div>
          <p className="mt-2 text-xs text-candela-secondary">
            Across active warehouse lots
          </p>
        </button>

        {/* Low Stock Warnings */}
        <button
          type="button"
          onClick={() => onNavigateTab("inventory")}
          className="text-left group border border-candela-border border-t-2 border-t-amber-600 bg-candela-surface/55 p-5 hover:bg-candela-surface hover:border-amber-600 transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-candela-secondary">
              Low Stock Alerts
            </span>
            <AlertTriangle className="h-4 w-4 text-amber-600" aria-hidden="true" />
          </div>
          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="font-heading text-4xl text-candela-text">
              {stats.lowStock.length}
            </span>
            <span className="font-mono text-[11px] text-amber-700 font-medium">
              Below Threshold
            </span>
          </div>
          <p className="mt-2 text-xs text-candela-secondary">
            Requires yard replenishment
          </p>
        </button>
      </div>

      {/* ─── LIVE ENQUIRY PIPELINE ─── */}
      <div className="border border-candela-border bg-candela-bg p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-candela-border pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-candela-accent" aria-hidden="true" />
            <h2 className="font-heading text-xl text-candela-text">
              Client Enquiry Pipeline
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab("sales", "sales-enquiries")}
            className="text-xs font-mono uppercase tracking-wider text-candela-accent font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Open Leads ({enquiries.length})</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Received", status: "RECEIVED", accent: "text-amber-700" },
            { label: "Under Review", status: "UNDER_REVIEW", accent: "text-blue-700" },
            { label: "Quotation Shared", status: "QUOTATION_SHARED", accent: "text-candela-accent" },
            { label: "Sample Dispatched", status: "SAMPLE_DISPATCHED", accent: "text-purple-700" },
            { label: "Converted", status: "CONVERTED", accent: "text-emerald-700" },
            { label: "Archived", status: "ARCHIVED", accent: "text-candela-secondary" },
          ].map((col) => {
            const count = enquiries.filter((e) => e.status === col.status).length;
            return (
              <button
                key={col.status}
                type="button"
                onClick={() => onNavigateTab("sales", "sales-enquiries")}
                className="border border-candela-border bg-candela-surface/50 p-3.5 text-center hover:border-candela-accent hover:bg-candela-surface transition cursor-pointer"
              >
                <span className="block font-mono text-[10px] text-candela-secondary uppercase tracking-wider truncate">
                  {col.label}
                </span>
                <span className={`block font-heading text-3xl mt-1 ${col.accent}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── TWO-COLUMN LIVE FEED: ACTIVE LOTS & RECENT ENQUIRIES ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Catalogue Products */}
        <div className="border border-candela-border bg-candela-bg p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-candela-border pb-3">
            <h3 className="font-heading text-xl text-candela-text">
              Active Catalogue Lots
            </h3>
            <button
              type="button"
              onClick={() => onNavigateTab("catalogue", "catalogue-products")}
              className="text-xs font-mono uppercase tracking-wider text-candela-accent font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Manage All</span>
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </button>
          </div>

          <div className="divide-y divide-candela-border/70">
            {products.slice(0, 5).map((prod) => (
              <div
                key={prod.id}
                className="py-3.5 flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={prod.media?.primaryImage}
                    alt={prod.name}
                    className="h-12 w-12 object-cover border border-candela-border shrink-0 bg-candela-surface"
                  />
                  <div className="min-w-0">
                    <p className="font-heading text-base text-candela-text truncate group-hover:text-candela-accent transition">
                      {prod.name}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] text-candela-secondary pt-0.5">
                      <span>{prod.sku}</span>
                      <span>•</span>
                      <span className="text-candela-accent font-semibold">
                        ₹{(prod.pricePerSqftInr || 0).toLocaleString("en-IN")}/sq.ft
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className="font-mono text-[10px] bg-candela-surface px-2 py-0.5 border border-candela-border text-candela-text">
                    {prod.masterCategory}
                  </span>
                  <p className="font-mono text-[10px] text-candela-secondary mt-1">
                    {(prod.stockSqftAvailable || 0).toLocaleString("en-IN")} sq.ft
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock & Latest Leads */}
        <div className="border border-candela-border bg-candela-bg p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-candela-border pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" aria-hidden="true" />
              <h3 className="font-heading text-xl text-candela-text">
                Stock Alerts ({stats.lowStock.length})
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab("inventory")}
              className="text-xs font-mono uppercase tracking-wider text-candela-accent font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Restock Yard</span>
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </button>
          </div>

          <div className="divide-y divide-candela-border/70">
            {stats.lowStock.slice(0, 5).map((prod) => (
              <div
                key={prod.id}
                className="py-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={prod.media?.primaryImage}
                    alt={prod.name}
                    className="h-10 w-10 object-cover border border-amber-400 shrink-0 bg-candela-surface"
                  />
                  <div className="min-w-0">
                    <p className="font-heading text-sm text-candela-text truncate">
                      {prod.name}
                    </p>
                    <p className="font-mono text-[10px] text-amber-700 font-medium">
                      {prod.stockSqftAvailable || 0} sq.ft left (Min:{" "}
                      {prod.lowStockThresholdSqft || 500})
                    </p>
                  </div>
                </div>

                <Link
                  href={`/product/${prod.slug}`}
                  target="_blank"
                  className="shrink-0 font-mono text-[10px] text-candela-accent font-semibold hover:underline flex items-center gap-1 border border-candela-border bg-candela-surface px-2.5 py-1"
                >
                  <Eye className="h-3 w-3" aria-hidden="true" />
                  <span>Inspect</span>
                </Link>
              </div>
            ))}

            {stats.lowStock.length === 0 && (
              <div className="py-10 text-center text-xs font-mono text-candela-secondary">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto mb-2" aria-hidden="true" />
                All active surface lots exceed minimum yard threshold.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
