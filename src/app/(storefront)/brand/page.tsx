import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BRAND_SHOWCASE } from "@/lib/catalogue-taxonomy";
import { ArrowRight, Award } from "lucide-react";

export default function BrandIndexPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 space-y-10">
      <div className="border-b border-candela-border pb-6">
        <div className="flex items-center gap-2 text-candela-accent font-mono text-xs uppercase tracking-widest">
          <Award className="h-4 w-4" />
          <span>Premier Indian & Global Brands</span>
        </div>
        <h1 className="mt-2 font-heading text-4xl sm:text-5xl text-candela-text">
          Browse Tiles & Slabs By Brand
        </h1>
        <p className="mt-2 max-w-2xl text-xs sm:text-sm text-candela-secondary leading-relaxed">
          Authorized trade partner & curator for India&apos;s leading tile manufacturers including Kajaria, Somany, Nitco, Hindware Italian Collection, Simpolo, and Johnson.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {BRAND_SHOWCASE.map((brand) => (
          <Link
            key={brand.id}
            href={`/brand/${brand.slug}`}
            className="group border border-candela-border bg-candela-surface overflow-hidden flex flex-col justify-between hover:border-candela-accent transition shadow-xs"
          >
            <div>
              <div className="relative h-64 w-full overflow-hidden bg-candela-bg">
                <Image
                  src={brand.imageUrl}
                  alt={brand.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-candela-dark/90 px-3 py-1 font-mono text-[10px] uppercase text-candela-bg">
                  {brand.rating}
                </span>
                <span className="absolute bottom-4 right-4 bg-candela-bg/95 px-2.5 py-1 font-mono text-[11px] text-candela-text">
                  {brand.origin}
                </span>
              </div>

              <div className="p-6 space-y-2">
                <h2 className="font-heading text-2xl font-semibold text-candela-text group-hover:text-candela-accent transition">
                  {brand.name}
                </h2>
                <p className="text-xs text-candela-secondary leading-relaxed">
                  {brand.desc}
                </p>
              </div>
            </div>

            <div className="border-t border-candela-border px-6 py-3.5 flex items-center justify-between text-xs font-mono uppercase tracking-wider text-candela-accent bg-candela-bg">
              <span>View Brand Catalog</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
