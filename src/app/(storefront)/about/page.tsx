import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Building2, Compass, MapPin, Shield, Phone, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About Candela Tiles & Marbles | Architectural Stone & Slabs",
  description:
    "Learn about Candela Tiles & Marbles, our Bhiwandi slab gallery, direct European quarry imports, and architectural dry-lay advisory.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono text-candela-secondary">
        <Link href="/" className="hover:text-candela-accent">
          Home
        </Link>
        <span>/</span>
        <span className="text-candela-text font-semibold">About Candela</span>
      </nav>

      {/* Hero */}
      <div className="border-b border-candela-border pb-10 max-w-3xl space-y-4">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-candela-accent">
          The Architectural Standard
        </span>
        <h1 className="font-heading text-4xl sm:text-5xl font-semibold tracking-wide text-candela-text leading-tight">
          Thoughtfully Curated Surfaces for Enduring Architecture.
        </h1>
        <p className="text-xs sm:text-sm text-candela-secondary leading-relaxed font-light">
          Candela Tiles & Marbles is an architectural stone, tile, and bathware house headquartered in Navi Mumbai, with dedicated slab yards in Bhiwandi. We bridge natural European quarries and contemporary Indian architecture through rigorous material selection and hands-on technical guidance.
        </p>
      </div>

      {/* Visual Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border border-candela-border overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
            alt="Candela Slab Yard"
            className="w-full h-80 object-cover"
          />
          <div className="p-6 bg-candela-surface space-y-2">
            <h3 className="font-heading text-xl font-bold">Bhiwandi Slab Gallery</h3>
            <p className="text-xs text-candela-secondary leading-relaxed">
              Over 50,000 sq.ft of monolithic Italian marble, travertine, and quartz slabs. Designed specifically for full bundle dry-lay inspections before cutting.
            </p>
          </div>
        </div>

        <div className="border border-candela-border overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80"
            alt="Navi Mumbai Experience Centre"
            className="w-full h-80 object-cover"
          />
          <div className="p-6 bg-candela-surface space-y-2">
            <h3 className="font-heading text-xl font-bold">Navi Mumbai Experience Centre</h3>
            <p className="text-xs text-candela-secondary leading-relaxed">
              Tactile sample library featuring calibrated tile mockups, water-jet brass inlays, sanitaryware fixtures, and full-scale architectural lighting simulators.
            </p>
          </div>
        </div>
      </div>

      {/* Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        <div className="border border-candela-border bg-candela-surface p-6 space-y-3">
          <Compass className="h-6 w-6 text-candela-accent" />
          <h3 className="font-heading text-lg font-semibold">Direct Quarry Imports</h3>
          <p className="text-xs text-candela-secondary leading-relaxed">
            We procure blocks directly from Carrara, Verona, and Tivoli. By bypassing intermediaries, we guarantee verifiable provenance and uninterrupted bookmatched slab bundles.
          </p>
        </div>

        <div className="border border-candela-border bg-candela-surface p-6 space-y-3">
          <Building2 className="h-6 w-6 text-candela-accent" />
          <h3 className="font-heading text-lg font-semibold">Dry-Lay Verification Floor</h3>
          <p className="text-xs text-candela-secondary leading-relaxed">
            Prior to dispatch, slabs are laid flat in natural daylight at our gallery. Architects can inspect vein flow, transitions, and numbered layout diagrams in person.
          </p>
        </div>

        <div className="border border-candela-border bg-candela-surface p-6 space-y-3">
          <Shield className="h-6 w-6 text-candela-accent" />
          <h3 className="font-heading text-lg font-semibold">Technical Physical Data</h3>
          <p className="text-xs text-candela-secondary leading-relaxed">
            We provide laboratory-tested figures for water absorption (ASTM C97), slip resistance (R9-R11), and Mohs hardness so specifications withstand actual site conditions.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="border border-candela-border bg-candela-dark text-white p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <h3 className="font-heading text-2xl sm:text-3xl font-semibold">
            Schedule a Private Slab Viewing
          </h3>
          <p className="text-xs text-candela-border/80 font-light">
            Visit our Bhiwandi gallery with your floor plans and lighting details. Our stone consultants will arrange a bespoke dry-lay presentation.
          </p>
        </div>
        <Link
          href="/contact"
          className="bg-candela-accent text-white px-8 py-3 text-xs font-mono uppercase font-semibold hover:bg-white hover:text-candela-dark transition shrink-0"
        >
          Book Appointment
        </Link>
      </div>
    </div>
  );
}
