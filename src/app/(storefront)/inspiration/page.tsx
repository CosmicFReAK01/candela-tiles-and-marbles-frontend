"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCandelaStore } from "@/context/CandelaStoreContext";
import { ArrowRight, MessageCircle, Sparkles, MapPin } from "lucide-react";

const INSPIRATION_CATEGORIES = [
  "All",
  "Room Designs",
  "Tile Ideas",
  "Bathroom Ideas",
  "Kitchen Ideas",
  "Projects",
];

export default function InspirationPage() {
  const { inspirations } = useCandelaStore();
  const [activeTab, setActiveTab] = useState("All");

  const filteredProjects = (inspirations || []).filter((proj) => {
    if (activeTab === "All") return true;
    if (activeTab === "Bathroom Ideas") return proj.category.toLowerCase().includes("bathroom");
    if (activeTab === "Kitchen Ideas") return proj.category.toLowerCase().includes("kitchen");
    if (activeTab === "Room Designs") return proj.category.toLowerCase().includes("living") || proj.category.toLowerCase().includes("room");
    if (activeTab === "Tile Ideas") return proj.category.toLowerCase().includes("tile") || proj.category.toLowerCase().includes("stone") || proj.category.toLowerCase().includes("facade");
    if (activeTab === "Projects") return true;
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono text-candela-secondary mb-6">
        <Link href="/" className="hover:text-candela-accent">
          Home
        </Link>
        <span>/</span>
        <span className="text-candela-text font-semibold">Inspiration & Projects</span>
      </nav>

      {/* Header */}
      <div className="border-b border-candela-border pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-candela-accent">
            Design Gallery
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-semibold tracking-wide text-candela-text mt-1">
            Inspiration & Realized Projects
          </h1>
          <p className="text-xs sm:text-sm text-candela-secondary mt-1 font-light max-w-2xl">
            Explore realized architectural installations across luxury Mumbai residences, Alibaug coastal villas, and bespoke penthouse pavilions.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          {INSPIRATION_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-3 py-1.5 border transition ${
                activeTab === cat
                  ? "bg-candela-dark text-candela-accent border-candela-accent font-semibold"
                  : "border-candela-border bg-candela-surface text-candela-secondary hover:border-candela-accent hover:text-candela-text"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredProjects.map((proj) => {
          const waMessage = encodeURIComponent(
            `Hello Candela Tiles & Marbles,\n\nI was inspired by your project: "${proj.title}" (${proj.location}).\nI would like to explore the surfaces used for my project.`
          );

          return (
            <div
              key={proj.id}
              className="group border border-candela-border bg-candela-surface overflow-hidden flex flex-col justify-between hover:border-candela-accent transition duration-300"
            >
              <div className="relative h-72 w-full overflow-hidden bg-candela-dark">
                <img
                  src={proj.imageUrl}
                  alt={proj.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-candela-dark/90 via-transparent to-transparent" />

                <div className="absolute top-4 left-4 bg-candela-dark/90 px-3 py-1 font-mono text-[10px] text-candela-accent uppercase tracking-wider flex items-center gap-1.5 border border-candela-border/20">
                  <MapPin className="h-3 w-3" />
                  <span>{proj.location}</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-candela-accent">
                    {proj.category}
                  </span>
                  <h3 className="font-heading text-2xl font-bold mt-0.5">{proj.title}</h3>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-xs text-candela-text-secondary leading-relaxed">
                  {proj.description}
                </p>

                <div className="border-t border-candela-border/60 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-candela-secondary block uppercase">
                      Surfaces Specified:
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1 font-mono text-[11px]">
                      {proj.productsUsed.map((p) => (
                        <span
                          key={p}
                          className="bg-candela-bg px-2.5 py-1 border border-candela-border font-medium text-candela-text"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/917063099602?text=${waMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-emerald-600 font-mono text-xs hover:underline font-semibold"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>Inquire for this Look</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
