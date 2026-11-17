"use client";

import React from "react";
import Link from "next/link";
import { useCandelaStore } from "@/context/CandelaStoreContext";
import {
  Bell,
  ExternalLink,
  LogOut,
  Menu,
  ShieldCheck,
} from "lucide-react";

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
  onNavigateEnquiries?: () => void;
}

export function AdminHeader({
  onToggleSidebar,
  onNavigateEnquiries,
}: AdminHeaderProps) {
  const { enquiries } = useCandelaStore();

  const newEnquiriesCount = enquiries.filter((e) => e.status === "RECEIVED").length;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    window.location.assign("/admin/login");
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-white/10 bg-[#1D1B18] px-4 sm:px-6 text-[#F8F5F0]">
      {/* Left: Mobile Menu + Candela Atelier Brand */}
      <div className="flex items-center gap-3 sm:gap-4">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Toggle navigation menu"
            className="lg:hidden flex h-9 w-9 items-center justify-center border border-white/15 bg-white/[0.04] text-[#D7D2C8] hover:border-candela-accent hover:text-candela-accent transition cursor-pointer"
          >
            <Menu className="h-4 w-4" aria-hidden="true" />
          </button>
        )}

        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center border border-candela-accent/50 bg-black/40 text-candela-accent">
            <span className="font-heading text-base font-normal tracking-wider">C</span>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-heading text-base sm:text-lg tracking-[0.16em] uppercase text-white">
                CANDELA
              </span>
              <span className="border border-candela-accent/40 bg-candela-accent/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-candela-accent">
                Atelier Backoffice
              </span>
            </div>
            <p className="hidden sm:block font-mono text-[10px] text-[#A8A298] tracking-wider">
              Supabase PostgreSQL • Live Operations
            </p>
          </div>
        </Link>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Live Session Status Pill */}
        <div className="hidden md:flex items-center gap-1.5 border border-emerald-500/30 bg-emerald-950/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-emerald-300">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
          <span>Authenticated Staff</span>
        </div>

        {/* Live Storefront Link */}
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 border border-white/20 bg-white/[0.04] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[#E6E1D8] hover:border-candela-accent hover:text-candela-accent transition"
          title="Open live customer storefront in new tab"
        >
          <span className="hidden sm:inline">View Storefront</span>
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>

        {/* Inbound Notifications */}
        <button
          type="button"
          onClick={onNavigateEnquiries}
          title={
            newEnquiriesCount > 0
              ? `${newEnquiriesCount} unread customer enquiries`
              : "View customer enquiries"
          }
          aria-label="Customer enquiries notifications"
          className="relative flex h-9 w-9 items-center justify-center border border-white/15 bg-white/[0.04] text-[#E6E1D8] hover:border-candela-accent hover:text-candela-accent transition cursor-pointer"
        >
          <Bell className="h-4 w-4" aria-hidden="true" />
          {newEnquiriesCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[16px] items-center justify-center bg-candela-accent px-1 font-mono text-[10px] font-bold text-white">
              {newEnquiriesCount}
            </span>
          )}
        </button>

        {/* Sign Out */}
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 border border-white/15 bg-white/[0.04] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[#D7D2C8] hover:border-red-400/60 hover:text-red-300 transition cursor-pointer"
          title="Sign out of Atelier Backoffice"
        >
          <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
