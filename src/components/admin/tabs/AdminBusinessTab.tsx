"use client";

import React, { useState } from "react";
import { useCandelaStore } from "@/context/CandelaStoreContext";
import { Building2, Phone, Save, Check, AlertCircle } from "lucide-react";

export function AdminBusinessTab() {
  const { homePageCms, updateHomePageCms } = useCandelaStore();

  const [phone, setPhone] = useState(homePageCms.phone || "+91 70630 99602");
  const [email, setEmail] = useState(homePageCms.email || "candelafuture10@gmail.com");
  const [bhiwandiAddress, setBhiwandiAddress] = useState(
    homePageCms.bhiwandiAddress ||
      "Plot 14, Architectural Stone Hub, Mumbai-Nashik Highway, Bhiwandi."
  );
  const [naviMumbaiAddress, setNaviMumbaiAddress] = useState(
    homePageCms.naviMumbaiAddress ||
      "Plot 22, MIDC Industrial Area, Turbhe, Navi Mumbai."
  );
  const [openingHours, setOpeningHours] = useState(
    homePageCms.openingHours || "Mon – Sat: 10:00 AM – 7:30 PM (Sun by Appointment)"
  );

  const [saving, setSaving] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);

    const updatedExtra = {
      ...homePageCms,
      phone,
      email,
      bhiwandiAddress,
      naviMumbaiAddress,
      openingHours,
    };

    updateHomePageCms({
      phone,
      email,
      bhiwandiAddress,
      naviMumbaiAddress,
      openingHours,
    });

    try {
      const res = await fetch("/api/v1/admin/cms/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionKey: "hero",
          extraData: updatedExtra,
        }),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || "Failed to persist showroom settings");
      }
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Database update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {savedToast && (
        <div
          role="status"
          className="border border-emerald-300 bg-emerald-50 p-3.5 text-xs font-mono text-emerald-900 flex items-center gap-2"
        >
          <Check className="h-4 w-4 text-emerald-700" aria-hidden="true" />
          <span>Showroom contact details persisted to Supabase PostgreSQL!</span>
        </div>
      )}

      {saveError && (
        <div
          role="alert"
          className="border border-red-300 bg-red-50 p-3.5 text-xs font-mono text-red-900 flex items-center gap-2"
        >
          <AlertCircle className="h-4 w-4 text-red-700" aria-hidden="true" />
          <span>{saveError}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Numbers & Hours */}
        <div className="border border-candela-border bg-candela-bg p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-candela-border pb-3">
            <Phone className="h-4 w-4 text-candela-accent" aria-hidden="true" />
            <h2 className="font-heading text-xl text-candela-text">
              Trade Desk &amp; Concierge Hotline
            </h2>
          </div>

          <div>
            <label
              htmlFor="biz-phone"
              className="block text-xs font-mono uppercase tracking-wider text-candela-secondary mb-1.5"
            >
              Primary Concierge Phone / WhatsApp *
            </label>
            <input
              id="biz-phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full min-h-[44px] border border-candela-border bg-candela-surface px-3.5 py-2 text-xs font-mono text-candela-text focus:border-candela-accent focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="biz-email"
              className="block text-xs font-mono uppercase tracking-wider text-candela-secondary mb-1.5"
            >
              Official Trade Email *
            </label>
            <input
              id="biz-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full min-h-[44px] border border-candela-border bg-candela-surface px-3.5 py-2 text-xs font-mono text-candela-text focus:border-candela-accent focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="biz-hours"
              className="block text-xs font-mono uppercase tracking-wider text-candela-secondary mb-1.5"
            >
              Opening Hours &amp; Sunday Appointments
            </label>
            <input
              id="biz-hours"
              type="text"
              value={openingHours}
              onChange={(e) => setOpeningHours(e.target.value)}
              className="w-full min-h-[44px] border border-candela-border bg-candela-surface px-3.5 py-2 text-xs text-candela-text focus:border-candela-accent focus:outline-none"
            />
          </div>
        </div>

        {/* Physical Showroom Hubs */}
        <div className="border border-candela-border bg-candela-bg p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-candela-border pb-3">
            <Building2 className="h-4 w-4 text-candela-accent" aria-hidden="true" />
            <h2 className="font-heading text-xl text-candela-text">
              Physical Showroom Hubs
            </h2>
          </div>

          <div>
            <label
              htmlFor="biz-bhiwandi"
              className="block text-xs font-mono uppercase tracking-wider text-candela-secondary mb-1.5"
            >
              Bhiwandi Slab Gallery &amp; Dry-Lay Yard
            </label>
            <textarea
              id="biz-bhiwandi"
              rows={3}
              value={bhiwandiAddress}
              onChange={(e) => setBhiwandiAddress(e.target.value)}
              className="w-full border border-candela-border bg-candela-surface p-3 text-xs text-candela-text focus:border-candela-accent focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="biz-turbhe"
              className="block text-xs font-mono uppercase tracking-wider text-candela-secondary mb-1.5"
            >
              Navi Mumbai Experience Centre (Turbhe)
            </label>
            <textarea
              id="biz-turbhe"
              rows={3}
              value={naviMumbaiAddress}
              onChange={(e) => setNaviMumbaiAddress(e.target.value)}
              className="w-full border border-candela-border bg-candela-surface p-3 text-xs text-candela-text focus:border-candela-accent focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-candela-accent px-6 py-3 font-mono text-xs uppercase tracking-widest text-white hover:bg-candela-dark transition cursor-pointer disabled:opacity-60"
            >
              <Save className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{saving ? "Saving to Supabase..." : "Save Showroom Details"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
