"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, Check } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    location: "Bhiwandi Slab Gallery",
    date: "",
    time: "Morning (11:00 AM - 1:00 PM)",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({
        name: "",
        phone: "",
        email: "",
        location: "Bhiwandi Slab Gallery",
        date: "",
        time: "Morning (11:00 AM - 1:00 PM)",
        message: "",
      });
      alert(
        "Showroom visit requested! Our customer desk will confirm your appointment via WhatsApp within 2 hours."
      );
    }, 1200);
  };

  const whatsappMsg = encodeURIComponent(
    `Hello Candela Tiles & Marbles,\n\nI would like to schedule a showroom visit to explore natural marble slabs and tiles.\n\nPlease share directions and available advisor slots.`
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono text-candela-secondary">
        <Link href="/" className="hover:text-candela-accent">
          Home
        </Link>
        <span>/</span>
        <span className="text-candela-text font-semibold">Showroom & Contact</span>
      </nav>

      {/* Header */}
      <div className="border-b border-candela-border pb-6 max-w-3xl space-y-3">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-candela-accent">
          Visit Our Showroom & Yards
        </span>
        <h1 className="font-heading text-3xl sm:text-5xl font-semibold tracking-wide text-candela-text">
          Showroom Experience & Advisory Desk
        </h1>
        <p className="text-xs sm:text-sm text-candela-secondary font-light leading-relaxed">
          Experience full monolithic slabs, dry-lay verification floors, and tactile material samples in person.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left 7 Columns: Locations & Details */}
        <div className="lg:col-span-7 space-y-8">
          {/* Location 1: Bhiwandi */}
          <div className="border border-candela-border bg-candela-surface p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-candela-border pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-candela-accent" />
                <h3 className="font-heading text-xl font-bold">
                  Bhiwandi Slab Gallery & Yard
                </h3>
              </div>
              <span className="bg-candela-accent/10 text-candela-accent font-mono text-[10px] px-2 py-0.5 uppercase tracking-wider">
                Full Slab Stockyard
              </span>
            </div>

            <p className="text-xs text-candela-secondary leading-relaxed">
              Plot 14, Architectural Stone Hub, Near Mankoli Flyover, Mumbai-Nashik Highway, Bhiwandi, Maharashtra 421302.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono pt-2">
              <div>
                <span className="text-candela-secondary text-[10px] uppercase block">
                  Inventory on Display
                </span>
                <span className="text-candela-text font-medium">
                  Italian Marble Bundles, Bookmatched Slabs, 20mm Travertine
                </span>
              </div>
              <div>
                <span className="text-candela-secondary text-[10px] uppercase block">
                  Services
                </span>
                <span className="text-candela-text font-medium">
                  Dry-Lay Inspection Floor, Crane Loading, Waterjet Cutting
                </span>
              </div>
            </div>
          </div>

          {/* Location 2: Navi Mumbai */}
          <div className="border border-candela-border bg-candela-surface p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-candela-border pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-candela-accent" />
                <h3 className="font-heading text-xl font-bold">
                  Navi Mumbai Experience Centre
                </h3>
              </div>
              <span className="bg-candela-dark text-candela-bg font-mono text-[10px] px-2 py-0.5 uppercase tracking-wider">
                Tile & Bathware Studio
              </span>
            </div>

            <p className="text-xs text-candela-secondary leading-relaxed">
              Plot 22, MIDC Industrial Area, TTC Turbhe, Navi Mumbai, Maharashtra 400705.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono pt-2">
              <div>
                <span className="text-candela-secondary text-[10px] uppercase block">
                  Inventory on Display
                </span>
                <span className="text-candela-text font-medium">
                  Large Format Vitrified, Luxury Basins, Concealed Faucets, Hardware
                </span>
              </div>
              <div>
                <span className="text-candela-secondary text-[10px] uppercase block">
                  Services
                </span>
                <span className="text-candela-text font-medium">
                  Architectural Lighting Simulators, BIM & Texture Library, Trade Desk
                </span>
              </div>
            </div>
          </div>

          {/* Contact Details & Hours */}
          <div className="border border-candela-border bg-candela-bg p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-candela-accent">
                <Phone className="h-3 w-3" />
                <span>Phone / WhatsApp</span>
              </div>
              <a
                href="tel:+917063099602"
                className="font-mono text-sm font-bold text-candela-text hover:text-candela-accent block"
              >
                +91 70630 99602
              </a>
              <span className="text-candela-secondary text-[11px] block">
                Direct Trade & Project Desk
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-candela-accent">
                <Mail className="h-3 w-3" />
                <span>Email Enquiries</span>
              </div>
              <a
                href="mailto:candelafuture10@gmail.com"
                className="font-mono text-xs text-candela-text hover:text-candela-accent block font-medium"
              >
                candelafuture10@gmail.com
              </a>
              <span className="text-candela-secondary text-[11px] block">
                BOQ Estimation & CAD Requests
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-candela-accent">
                <Clock className="h-3 w-3" />
                <span>Hours</span>
              </div>
              <div className="text-candela-text font-mono text-[11px] leading-tight">
                Mon – Sat: 10:00 AM – 7:30 PM
              </div>
              <span className="text-candela-secondary text-[11px] block">
                Sun: By Prior Appointment
              </span>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Appointment Booking Form */}
        <div className="lg:col-span-5 border border-candela-border bg-candela-surface p-6 sm:p-8 space-y-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-candela-accent">
              Book a Visit
            </span>
            <h3 className="font-heading text-2xl font-bold text-candela-text mt-1">
              Schedule Private Viewing
            </h3>
            <p className="text-xs text-candela-secondary mt-1">
              Our architectural stone advisors will prepare customized slab bundles and dry-lay floor space for your visit.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-candela-text mb-1">
                Your Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ar. Rajesh Mehta"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-candela-border bg-candela-bg px-3.5 py-2 text-xs text-candela-text focus:border-candela-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-candela-text mb-1">
                Phone / WhatsApp Number *
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98201 XXXXX"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-candela-border bg-candela-bg px-3.5 py-2 text-xs text-candela-text focus:border-candela-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-candela-text mb-1">
                Preferred Showroom Location
              </label>
              <select
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full border border-candela-border bg-candela-bg px-3.5 py-2 text-xs text-candela-text focus:border-candela-accent focus:outline-none"
              >
                <option value="Bhiwandi Slab Gallery">Bhiwandi Slab Gallery (Large Format Marbles)</option>
                <option value="Navi Mumbai Experience Centre">Navi Mumbai Experience Centre (Tiles & Bathware)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-candela-text mb-1">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full border border-candela-border bg-candela-bg px-3 py-2 text-xs text-candela-text focus:border-candela-accent focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-candela-text mb-1">
                  Time Slot
                </label>
                <select
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full border border-candela-border bg-candela-bg px-3 py-2 text-xs text-candela-text focus:border-candela-accent focus:outline-none"
                >
                  <option value="Morning">Morning (11:00 AM - 1:00 PM)</option>
                  <option value="Afternoon">Afternoon (2:00 PM - 5:00 PM)</option>
                  <option value="Evening">Evening (5:00 PM - 7:30 PM)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-candela-text mb-1">
                Specific Surface Lots or Requirements
              </label>
              <textarea
                rows={3}
                placeholder="Mention specific marble lots (e.g. Calacatta Viola, Travertino), target area, or CAD plans..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full border border-candela-border bg-candela-bg px-3.5 py-2 text-xs text-candela-text focus:border-candela-accent focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitted}
              className="w-full inline-flex items-center justify-center gap-2 bg-candela-accent px-6 py-3 font-mono text-xs uppercase font-semibold text-white hover:bg-candela-dark transition cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{submitted ? "Scheduling..." : "Confirm Showroom Appointment"}</span>
            </button>

            <div className="pt-2 text-center">
              <a
                href={`https://wa.me/917063099602?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-700 hover:underline"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>Or connect with an advisor on WhatsApp directly</span>
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
