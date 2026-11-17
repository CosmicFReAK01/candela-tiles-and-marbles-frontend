import React from "react";
import Link from "next/link";
import { StorefrontHeader } from "@/components/layout/StorefrontHeader";
import { ItemCartDrawer } from "@/components/layout/ItemCartDrawer";
import { MapPin, Phone, Mail, Clock, MessageCircle, Shield } from "lucide-react";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-candela-bg text-candela-text">
      <StorefrontHeader />
      <ItemCartDrawer />
      <main className="flex-1">{children}</main>

      {/* Complete Architectural Footer */}
      <footer className="border-t border-candela-border bg-candela-dark text-candela-bg">
        <div className="mx-auto max-w-7xl px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand Info & Advisory */}
          <div className="lg:col-span-2 space-y-4">
            <div className="font-heading text-2xl tracking-[0.16em] text-white">
              CANDELA TILES & MARBLES
            </div>
            <p className="max-w-sm text-xs text-candela-border/80 leading-relaxed font-light">
              Direct European quarry importers and architectural surface specialists. Monolithic Italian marble bundles, high-performance vitrified porcelain, luxury sanitaryware, and solid brass hardware.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs font-mono text-candela-accent">
              <a
                href="https://wa.me/919820144812"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:underline"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp Advisory (+91 98201 44812)</span>
              </a>
            </div>
          </div>

          {/* Col 2: Shop by Category */}
          <div className="space-y-3 text-xs">
            <div className="font-mono uppercase tracking-widest text-candela-accent text-[11px] font-semibold">
              Shop Catalogue
            </div>
            <ul className="space-y-2 text-candela-border/80">
              <li>
                <Link href="/shop/tiles" className="hover:text-white transition">
                  Tiles (Floor, Wall, Anti-Skid)
                </Link>
              </li>
              <li>
                <Link href="/shop/marbles" className="hover:text-white transition">
                  Marbles (Imported, White, Onyx)
                </Link>
              </li>
              <li>
                <Link href="/shop/sanitaryware" className="hover:text-white transition">
                  Sanitaryware (WCs & Basins)
                </Link>
              </li>
              <li>
                <Link href="/shop/faucets" className="hover:text-white transition">
                  Faucets & Basin Mixers
                </Link>
              </li>
              <li>
                <Link href="/shop/showers" className="hover:text-white transition">
                  Showers & Hydrotherapy
                </Link>
              </li>
              <li>
                <Link href="/shop/hardware" className="hover:text-white transition">
                  Hardware & Brass Levers
                </Link>
              </li>
              <li>
                <Link href="/shop/bathroom-accessories" className="hover:text-white transition">
                  Bathroom Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Collections & Explore */}
          <div className="space-y-3 text-xs">
            <div className="font-mono uppercase tracking-widest text-candela-accent text-[11px] font-semibold">
              Collections & Spaces
            </div>
            <ul className="space-y-2 text-candela-border/80">
              <li>
                <Link href="/collections/premium" className="hover:text-white transition">
                  Premium Collection
                </Link>
              </li>
              <li>
                <Link href="/collections/luxury" className="hover:text-white transition">
                  Luxury Collection
                </Link>
              </li>
              <li>
                <Link href="/collections/modern" className="hover:text-white transition">
                  Modern Collection
                </Link>
              </li>
              <li>
                <Link href="/collections/natural" className="hover:text-white transition">
                  Natural Collection
                </Link>
              </li>
              <li>
                <Link href="/collections/new-arrivals" className="hover:text-white transition">
                  New Arrivals 2026
                </Link>
              </li>
              <li>
                <Link href="/explore/rooms/living-room" className="hover:text-white transition">
                  Living Room Surfaces
                </Link>
              </li>
              <li>
                <Link href="/explore/rooms/bathroom" className="hover:text-white transition">
                  Bathroom Sanctuaries
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Showrooms & Experience */}
          <div className="space-y-3 text-xs">
            <div className="font-mono uppercase tracking-widest text-candela-accent text-[11px] font-semibold">
              Showroom Locations
            </div>
            <div className="space-y-2 text-candela-border/80 text-[11px]">
              <div>
                <strong className="text-white block font-heading text-xs">
                  Bhiwandi Slab Gallery & Yard
                </strong>
                Plot 14, Architectural Stone Hub, Mumbai-Nashik Highway, Bhiwandi.
              </div>
              <div className="pt-1">
                <strong className="text-white block font-heading text-xs">
                  Navi Mumbai Experience Centre
                </strong>
                Plot 22, MIDC Industrial Area, Turbhe, Navi Mumbai.
              </div>
              <div className="pt-2 text-candela-border/60">
                Mon – Sat: 10:00 AM – 7:30 PM (Sun by Appointment)
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-candela-border/30 bg-black/40">
          <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-candela-border/80">
            <div className="flex flex-wrap items-center gap-3">
              <span>© {new Date().getFullYear()} CANDELA TILES & MARBLES. All rights reserved.</span>
              <span className="text-candela-border/40">•</span>
              <span className="font-mono text-[10px] text-candela-secondary">
                Curated Natural Stone Slabs, Monolithic Marbles &amp; Architectural Surfaces
              </span>
            </div>

            <div className="flex items-center gap-6 font-mono text-[11px]">
              <Link
                href="/enquiry/track/CND-2026-8492"
                className="hover:text-candela-accent transition"
              >
                Track BOQ Quote
              </Link>
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 border border-candela-accent/40 bg-candela-bg/10 px-3 py-1 text-candela-accent hover:border-candela-accent hover:text-white transition"
              >
                <span>Staff / Vendor Admin Console</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
