import React from "react";
import Link from "next/link";
import Image from "next/image";
import { COLOUR_SHOWCASE } from "@/lib/catalogue-taxonomy";
import { fetchStorefrontProducts } from "@/lib/storefront-data";
import { ArrowLeft, Box, Palette } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ColourDetailPage({ params }: { params: { slug: string } }) {
  const currentColour = COLOUR_SHOWCASE.find((c) => c.slug === params.slug);
  const title = currentColour?.title || params.slug.replace(/-/g, " ");

  const allProducts = await fetchStorefrontProducts();
  const matchingProducts = allProducts.filter(
    (p) =>
      p.colour?.toLowerCase().includes(params.slug.toLowerCase()) ||
      p.name.toLowerCase().includes(params.slug.toLowerCase())
  );
  const displayProducts = matchingProducts.length > 0 ? matchingProducts : allProducts.slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 space-y-10">
      <div className="flex items-center gap-3">
        <Link
          href="/colour"
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-candela-secondary hover:text-candela-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to All Colour Palettes
        </Link>
      </div>

      <div className="relative border border-candela-border bg-candela-dark text-candela-bg overflow-hidden p-8 sm:p-12">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 border border-candela-accent/40 bg-candela-accent/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-candela-accent">
            <Palette className="h-3 w-3" />
            <span>Tone & Hue Collection</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-semibold capitalize text-white">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-candela-border leading-relaxed">
            {currentColour?.description ||
              `Discover natural stone and architectural surfaces in ${title} palettes.`}
          </p>
        </div>
        {currentColour?.imageUrl && (
          <div className="absolute inset-0 opacity-20">
            <Image
              src={currentColour.imageUrl}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-candela-border pb-3">
          <span className="font-mono text-xs uppercase text-candela-secondary">
            SURFACES IN {title.toUpperCase()}
          </span>
          <Link
            href="/products"
            className="text-xs font-mono text-candela-accent hover:underline"
          >
            All Catalog Items →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group border border-candela-border bg-candela-surface overflow-hidden flex flex-col justify-between hover:border-candela-accent transition shadow-xs"
            >
              <div>
                <div className="relative h-60 w-full overflow-hidden bg-candela-bg">
                  <Image
                    src={product.media.primaryImage}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-candela-dark/90 px-2.5 py-1 font-mono text-[10px] uppercase text-candela-bg">
                      {product.category}
                    </span>
                    {product.media.glbModelUrl && (
                      <span className="inline-flex items-center gap-1 bg-candela-bg/95 px-2 py-1 font-mono text-[10px] text-candela-text">
                        <Box className="h-3 w-3 text-candela-accent" /> 3D GLB
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 space-y-1.5">
                  <div className="font-mono text-[10px] text-candela-secondary">
                    {product.sku} • {product.origin}
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-candela-text group-hover:text-candela-accent transition">
                    {product.name}
                  </h3>
                  <p className="text-xs text-candela-secondary line-clamp-2">
                    {product.shortDescription}
                  </p>
                </div>
              </div>

              <div className="border-t border-candela-border p-4 bg-candela-bg flex items-center justify-between text-xs font-mono">
                <span className="text-candela-accent font-medium">Request Price</span>
                <span className="text-candela-secondary">Inspect 3D / Add to Cart →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
