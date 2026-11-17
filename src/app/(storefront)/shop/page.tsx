import React from "react";
import { Metadata } from "next";
import { ShopCatalogueView } from "@/components/catalogue/ShopCatalogueView";

export const metadata: Metadata = {
  title: "Shop All Surfaces & Architectural Hardware | CANDELA TILES & MARBLES",
  description:
    "Explore our full catalogue of Italian marble slabs, porcelain tiles, luxury sanitaryware, architectural faucets, and solid brass hardware.",
};

export default function ShopMainPage() {
  return <ShopCatalogueView />;
}
