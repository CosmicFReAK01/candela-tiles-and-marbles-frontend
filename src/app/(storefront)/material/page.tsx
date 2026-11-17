import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MATERIAL_SHOWCASE } from "@/lib/catalogue-taxonomy";
import { ArrowRight, Layers } from "lucide-react";

export default function MaterialIndexPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 space-y-10">
      <div className="border-b border-candela-border pb-6">
        <div className="flex items-center gap-2 text-candela-accent font-mono text-xs uppercase tracking-widest">
          <Layers className="h-4 w-4" />
          <span>Raw Materials & Geological Composition</span>
        </div>
        <h1 className="mt-2 font-heading text-4xl sm:text-5xl text-candela-text">
          Browse Tiles & Slabs By Material
        </h1>
        <p className="mt-2 max-w-2xl text-xs sm:text-sm text-candela-secondary leading-relaxed">
          From genuine imported Italian marble and volcanic sintered stone to dense vitrified porcelain and translucent onyx quartzite.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MATERIAL_SHOWCASE.map((material) => (
          <Link
            key={material.id}
            href={`/material/${material.slug}`}
            className="group border border-candela-border bg-candela-surface overflow-hidden flex flex-col justify-between hover:border-candela-accent transition shadow-xs"
          >
            <div>
              <div className="relative h-64 w-full overflow-hidden bg-candela-bg">
                <Image
                  src={material.imageUrl}
                  alt={material.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {material.tag && (
                  <span className="absolute top-4 left-4 bg-candela-dark/90 px-3 py-1 font-mono text-[10px] uppercase text-candela-bg">
                    {material.tag}
                  </span>
                )}
                <span className="absolute bottom-4 right-4 bg-candela-bg/95 px-2.5 py-1 font-mono text-[11px] text-candela-text">
                  {material.itemCount}+ Slabs
                </span>
              </div>

              <div className="p-6 space-y-2">
                <h2 className="font-heading text-2xl font-semibold text-candela-text group-hover:text-candela-accent transition">
                  {material.title}
                </h2>
                <p className="text-xs text-candela-secondary leading-relaxed">
                  {material.description}
                </p>
              </div>
            </div>

            <div className="border-t border-candela-border px-6 py-3.5 flex items-center justify-between text-xs font-mono uppercase tracking-wider text-candela-accent bg-candela-bg">
              <span>Inspect Material Geology</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
