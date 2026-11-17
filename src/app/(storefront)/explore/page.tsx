import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { SHOP_SPACES, STYLE_SHOWCASE, MATERIAL_SHOWCASE, COLOUR_SHOWCASE } from "@/lib/catalogue-taxonomy";
import { ArrowRight, Compass, Home, Layers, Palette, Shapes, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Explore Surfaces by Room, Style & Material | CANDELA TILES & MARBLES",
  description:
    "Explore architectural surfaces categorized by Room, Style, Material, Colour, Finish, and Application.",
};

export default function ExploreHubPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono text-candela-secondary">
        <Link href="/" className="hover:text-candela-accent">
          Home
        </Link>
        <span>/</span>
        <span className="text-candela-text font-semibold">Explore</span>
      </nav>

      {/* Header */}
      <div className="border-b border-candela-border pb-6">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-candela-accent">
          Architectural Discovery
        </span>
        <h1 className="font-heading text-3xl sm:text-5xl font-semibold tracking-wide text-candela-text mt-1">
          Explore by Room, Style & Material
        </h1>
        <p className="text-xs sm:text-sm text-candela-secondary mt-2 font-light max-w-2xl leading-relaxed">
          Navigate our stone and tile catalogue through different architectural lenses—whether you&apos;re specifying for a living room pavilion, choosing an ultra-compact material, or matching a specific colour palette.
        </p>
      </div>

      {/* 1. EXPLORE BY ROOM */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-candela-border pb-3">
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4 text-candela-accent" />
            <h2 className="font-heading text-xl font-bold tracking-wide">Explore by Room</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SHOP_SPACES.map((space) => (
            <Link
              key={space.id}
              href={`/explore/rooms/${space.slug}`}
              className="group border border-candela-border bg-candela-surface overflow-hidden hover:border-candela-accent transition duration-300"
            >
              <div className="relative h-48 w-full overflow-hidden bg-candela-dark">
                <img
                  src={space.imageUrl}
                  alt={space.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-candela-dark/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 text-white">
                  <h3 className="font-heading text-xl font-bold">{space.name}</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs text-candela-text-secondary line-clamp-2 leading-relaxed">
                  {space.description}
                </p>
                <div className="pt-2 flex items-center justify-between text-xs font-mono text-candela-accent">
                  <span>View Room Slabs</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 2. EXPLORE BY STYLE */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-candela-border pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-candela-accent" />
            <h2 className="font-heading text-xl font-bold tracking-wide">Explore by Style</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: "Modern", slug: "modern" },
            { name: "Minimal", slug: "minimal" },
            { name: "Luxury", slug: "luxury" },
            { name: "Classic", slug: "classic" },
            { name: "Industrial", slug: "industrial" },
            { name: "Natural", slug: "natural" },
          ].map((style) => (
            <Link
              key={style.slug}
              href={`/explore/styles/${style.slug}`}
              className="border border-candela-border bg-candela-surface p-4 text-center hover:border-candela-accent hover:bg-candela-bg transition"
            >
              <h3 className="font-heading text-base font-semibold">{style.name}</h3>
              <span className="text-[10px] font-mono text-candela-accent mt-1 block">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. EXPLORE BY MATERIAL */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-candela-border pb-3">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-candela-accent" />
            <h2 className="font-heading text-xl font-bold tracking-wide">Explore by Material</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MATERIAL_SHOWCASE.slice(0, 4).map((mat) => (
            <Link
              key={mat.id}
              href={`/explore/materials/${mat.slug}`}
              className="group border border-candela-border bg-candela-surface overflow-hidden hover:border-candela-accent transition duration-300"
            >
              <div className="relative h-44 w-full overflow-hidden bg-candela-dark">
                <img
                  src={mat.imageUrl}
                  alt={mat.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-candela-dark/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 text-white">
                  <h3 className="font-heading text-lg font-bold">{mat.title}</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs text-candela-text-secondary line-clamp-2">
                  {mat.description}
                </p>
                <div className="pt-2 flex items-center justify-between text-xs font-mono text-candela-accent">
                  <span>Browse Material</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
