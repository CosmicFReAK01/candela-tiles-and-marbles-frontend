import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SHAPE_SHOWCASE } from "@/lib/catalogue-taxonomy";
import { ArrowRight, Shapes } from "lucide-react";

export default function ShapeIndexPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 space-y-10">
      <div className="border-b border-candela-border pb-6">
        <div className="flex items-center gap-2 text-candela-accent font-mono text-xs uppercase tracking-widest">
          <Shapes className="h-4 w-4" />
          <span>Spatial Tile Geometry</span>
        </div>
        <h1 className="mt-2 font-heading text-4xl sm:text-5xl text-candela-text">
          Browse Tiles & Slabs By Shape
        </h1>
        <p className="mt-2 max-w-2xl text-xs sm:text-sm text-candela-secondary leading-relaxed">
          From massive monolithic 1600x3200mm slabs to hexagon tessellations, chevrons, and classical subway brick formats.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SHAPE_SHOWCASE.map((shape) => (
          <Link
            key={shape.id}
            href={`/shape/${shape.slug}`}
            className="group border border-candela-border bg-candela-surface overflow-hidden flex flex-col justify-between hover:border-candela-accent transition shadow-xs"
          >
            <div>
              <div className="relative h-64 w-full overflow-hidden bg-candela-bg">
                <Image
                  src={shape.imageUrl}
                  alt={shape.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-4 right-4 bg-candela-bg/95 px-2.5 py-1 font-mono text-[11px] text-candela-text">
                  {shape.itemCount}+ Formats
                </span>
              </div>

              <div className="p-6 space-y-2">
                <h2 className="font-heading text-2xl font-semibold text-candela-text group-hover:text-candela-accent transition">
                  {shape.title}
                </h2>
                <p className="text-xs text-candela-secondary leading-relaxed">
                  {shape.description}
                </p>
              </div>
            </div>

            <div className="border-t border-candela-border px-6 py-3.5 flex items-center justify-between text-xs font-mono uppercase tracking-wider text-candela-accent bg-candela-bg">
              <span>View Geometric Layouts</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
