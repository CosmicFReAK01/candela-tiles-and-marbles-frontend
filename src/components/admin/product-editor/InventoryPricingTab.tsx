"use client";

import React from "react";
import { AdminProduct } from "@/types";

interface Props {
  product: AdminProduct;
  setProduct: React.Dispatch<React.SetStateAction<AdminProduct>>;
}

export function InventoryPricingTab({ product, setProduct }: Props) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
            Customer Price (₹ / sq.ft or Unit)
          </label>
          <input
            type="number"
            value={
              product.pricePerSqftInr !== undefined && product.pricePerSqftInr !== null
                ? product.pricePerSqftInr
                : ""
            }
            placeholder="Optional (e.g. 12340)"
            onChange={(e) =>
              setProduct({
                ...product,
                pricePerSqftInr: e.target.value === "" ? 0 : parseFloat(e.target.value) || 0,
              })
            }
            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-mono text-[#9E7B47] font-bold focus:border-[#9E7B47] focus:outline-none"
          />
          <span className="text-[10px] text-gray-400 font-mono block mt-0.5">Selling price per unit/sq.ft</span>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
            Dealer Wholesale Rate (₹ / sq.ft)
          </label>
          <input
            type="number"
            value={
              product.dealerPricePerSqftInr !== undefined && product.dealerPricePerSqftInr !== null
                ? product.dealerPricePerSqftInr
                : ""
            }
            placeholder="Optional (e.g. 11000)"
            onChange={(e) =>
              setProduct({
                ...product,
                dealerPricePerSqftInr:
                  e.target.value === "" ? 0 : parseFloat(e.target.value) || 0,
              })
            }
            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-mono text-gray-900 focus:border-[#9E7B47] focus:outline-none"
          />
          <span className="text-[10px] text-gray-400 font-mono block mt-0.5">B2B contractor rate (optional)</span>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-[#9E7B47] mb-1 font-semibold">
            Available Stock (sq.ft)
          </label>
          <div className="relative">
            <input
              type="number"
              value={
                product.stockSqftAvailable !== undefined && product.stockSqftAvailable !== null
                  ? product.stockSqftAvailable
                  : ""
              }
              placeholder="Optional"
              onChange={(e) =>
                setProduct({
                  ...product,
                  stockSqftAvailable:
                    e.target.value === "" ? 0 : parseFloat(e.target.value) || 0,
                })
              }
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-mono text-gray-900 font-semibold focus:border-[#9E7B47] focus:outline-none pr-12"
            />
            <span className="absolute right-2.5 top-2 text-[10px] font-mono text-gray-400">sq.ft</span>
          </div>
          <span className="text-[10px] text-gray-400 font-mono block mt-0.5">Physical slab / tile area (optional)</span>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-blue-700 mb-1 font-semibold">
            Available Stock (Units)
          </label>
          <div className="relative">
            <input
              type="number"
              value={
                product.stockUnitsAvailable !== undefined && product.stockUnitsAvailable !== null
                  ? product.stockUnitsAvailable
                  : ""
              }
              placeholder="Optional"
              onChange={(e) =>
                setProduct({
                  ...product,
                  stockUnitsAvailable:
                    e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0,
                })
              }
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-mono text-blue-900 font-semibold focus:border-blue-600 focus:outline-none pr-12"
            />
            <span className="absolute right-2.5 top-2 text-[10px] font-mono text-gray-400">Units</span>
          </div>
          <span className="text-[10px] text-gray-400 font-mono block mt-0.5">Pieces / boxes / slab count (optional)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
            Warehouse Yard / Bay Location
          </label>
          <input
            type="text"
            value={product.warehouseZone || ""}
            placeholder="e.g. Bhiwandi Bay A2 (optional)"
            onChange={(e) => setProduct({ ...product, warehouseZone: e.target.value })}
            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-[#9E7B47] focus:outline-none"
          />
          <span className="text-[10px] text-gray-400 font-mono block mt-0.5">Physical yard bay address (optional)</span>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
            Low Stock Threshold (sq.ft)
          </label>
          <input
            type="number"
            value={
              product.lowStockThresholdSqft !== undefined && product.lowStockThresholdSqft !== null
                ? product.lowStockThresholdSqft
                : ""
            }
            placeholder="Optional (adding value not necessary)"
            onChange={(e) =>
              setProduct({
                ...product,
                lowStockThresholdSqft:
                  e.target.value === "" ? undefined : parseFloat(e.target.value) || 0,
              })
            }
            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-mono text-gray-900 focus:border-[#9E7B47] focus:outline-none"
          />
          <span className="text-[10px] text-gray-400 font-mono block mt-0.5">Optional alert trigger — not necessary to fill</span>
        </div>
      </div>
    </div>
  );
}
