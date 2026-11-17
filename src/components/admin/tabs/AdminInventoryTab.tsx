"use client";

import React, { useState } from "react";
import { useCandelaStore } from "@/context/CandelaStoreContext";
import {
  Boxes,
  Search,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Warehouse,
  Building2,
  Truck,
  RotateCcw,
  SlidersHorizontal,
  X,
  FileSpreadsheet,
} from "lucide-react";

export function AdminInventoryTab() {
  const { products, updateProduct, vendorCategoryScope } = useCandelaStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterThreshold, setFilterThreshold] = useState<"all" | "low_stock">("all");
  const [selectedZone, setSelectedZone] = useState<string>("all");
  const [restockModalProduct, setRestockModalProduct] = useState<any>(null);
  const [addQty, setAddQty] = useState<number>(500);
  const [addUnitsQty, setAddUnitsQty] = useState<number>(25);
  const [restockReason, setRestockReason] = useState<string>("Italian Quarry Container Delivery");
  const [successToast, setSuccessToast] = useState("");

  const allowedProducts =
    vendorCategoryScope === "all"
      ? products
      : products.filter((p) => p.masterCategory === vendorCategoryScope);

  // Compute Warehouse Totals
  const totalStockSqft = allowedProducts.reduce((sum, p) => sum + (p.stockSqftAvailable || 0), 0);
  const totalStockUnits = allowedProducts.reduce((sum, p) => sum + (p.stockUnitsAvailable || 0), 0);
  const totalInventoryValuation = allowedProducts.reduce(
    (sum, p) => sum + (p.stockSqftAvailable || 0) * (p.pricePerSqftInr || 0),
    0
  );
  const lowStockCount = allowedProducts.filter(
    (p) => (p.stockSqftAvailable || 0) < (p.lowStockThresholdSqft || 500)
  ).length;

  const filteredProducts = allowedProducts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.warehouseZone?.toLowerCase().includes(searchQuery.toLowerCase());

    const isLow = (p.stockSqftAvailable || 0) < (p.lowStockThresholdSqft || 500);
    const matchesStock = filterThreshold === "all" || (filterThreshold === "low_stock" && isLow);
    const matchesZone = selectedZone === "all" || p.warehouseZone?.includes(selectedZone);

    return matchesSearch && matchesStock && matchesZone;
  });

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockModalProduct) return;
    const newStockSqft = (restockModalProduct.stockSqftAvailable || 0) + (addQty || 0);
    const newStockUnits = (restockModalProduct.stockUnitsAvailable || 0) + (addUnitsQty || 0);
    updateProduct(restockModalProduct.id, {
      stockSqftAvailable: newStockSqft,
      stockUnitsAvailable: newStockUnits,
      lastRestockedAt: new Date().toISOString().split("T")[0],
      inStock: newStockSqft > 0 || newStockUnits > 0,
    });
    setSuccessToast(
      `Restocked +${addQty.toLocaleString()} sq.ft / +${addUnitsQty.toLocaleString()} units for lot ${restockModalProduct.sku} (${restockModalProduct.name}).`
    );
    setRestockModalProduct(null);
    setTimeout(() => setSuccessToast(""), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#9E7B47] font-semibold">
            Warehouse Logistics &amp; Physical Stock Registry
          </span>
          <h1 className="font-heading text-2xl font-semibold text-gray-900">
            Warehouse Inventory &amp; Slab Stock
          </h1>
          <p className="text-xs text-gray-500 font-light">
            Real-time verified square footage across Bhiwandi Central Logistics Yard and Turbhe Experience Studio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-[#FAF5EE] text-[#9E7B47] border border-[#EADCC9] px-3 py-1 text-xs font-mono rounded">
            Live Warehouse Sync
          </span>
        </div>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-900 text-white px-4 py-3 rounded shadow-xl border border-emerald-700 animate-slide-up text-xs font-mono max-w-md">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Warehouse Logistics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 p-4 rounded-sm shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-mono uppercase">
            <span>Total Warehouse Stock</span>
            <Warehouse className="h-4 w-4 text-[#9E7B47]" />
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-xl font-heading font-semibold text-gray-900">
              {totalStockSqft.toLocaleString()} <span className="text-xs font-sans font-normal text-gray-500">sq.ft</span>
            </div>
            <span className="text-gray-300">/</span>
            <div className="text-sm font-heading font-medium text-gray-700">
              {totalStockUnits.toLocaleString()} <span className="text-xs font-sans font-normal text-gray-500">units</span>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 font-mono">Calibrated slabs (sq.ft) &amp; boxed units</p>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-sm shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-mono uppercase">
            <span>Total Stock Valuation</span>
            <Building2 className="h-4 w-4 text-[#9E7B47]" />
          </div>
          <div className="text-2xl font-heading font-semibold text-gray-900">
            ₹{(totalInventoryValuation / 100000).toFixed(1)} <span className="text-sm font-sans font-normal text-gray-500">Lakhs</span>
          </div>
          <p className="text-[10px] text-gray-400 font-mono">Gross inventory landed value</p>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-sm shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-mono uppercase">
            <span>Low Stock Lots</span>
            <AlertTriangle className={`h-4 w-4 ${lowStockCount > 0 ? "text-amber-600" : "text-gray-400"}`} />
          </div>
          <div className={`text-2xl font-heading font-semibold ${lowStockCount > 0 ? "text-amber-700" : "text-gray-900"}`}>
            {lowStockCount} <span className="text-sm font-sans font-normal text-gray-500">lots</span>
          </div>
          <p className="text-[10px] text-gray-400 font-mono">Below minimum threshold trigger</p>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-sm shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-mono uppercase">
            <span>Active Yard Bays</span>
            <Boxes className="h-4 w-4 text-[#9E7B47]" />
          </div>
          <div className="text-2xl font-heading font-semibold text-gray-900">
            5 <span className="text-sm font-sans font-normal text-gray-500">Zones</span>
          </div>
          <p className="text-[10px] text-gray-400 font-mono">Bhiwandi A1/A2/B1, Turbhe Exp.</p>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border border-gray-200 bg-white p-3 rounded-sm shadow-xs">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search lot SKU, name, or yard bay..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded border border-gray-300 bg-gray-50/50 py-1.5 pl-9 pr-3 text-xs font-mono text-gray-900 placeholder-gray-400 focus:border-[#9E7B47] focus:bg-white focus:outline-none transition"
            />
          </div>

          {/* Yard Zone Filter */}
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="rounded border border-gray-300 py-1.5 px-2.5 text-xs font-mono text-gray-700 bg-white"
          >
            <option value="all">All Warehouse Zones</option>
            <option value="Bhiwandi">Bhiwandi Yard</option>
            <option value="Turbhe">Turbhe Studio</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterThreshold("all")}
            className={`px-3 py-1 text-xs font-mono rounded transition cursor-pointer ${
              filterThreshold === "all"
                ? "bg-[#9E7B47] text-white font-semibold shadow-xs"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            All Stock Lots ({allowedProducts.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterThreshold("low_stock")}
            className={`px-3 py-1 text-xs font-mono rounded transition cursor-pointer flex items-center gap-1.5 ${
              filterThreshold === "low_stock"
                ? "bg-amber-600 text-white font-semibold shadow-xs"
                : "text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200"
            }`}
          >
            <AlertTriangle className="h-3 w-3" />
            <span>Low Stock ({lowStockCount})</span>
          </button>
        </div>
      </div>

      {/* Warehouse Stock Master Table */}
      <div className="border border-gray-200 bg-white rounded-sm shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#FAF5EE] border-b border-gray-200 text-gray-600 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-2.5 px-3">Lot SKU &amp; Surface</th>
              <th className="py-2.5 px-3">Warehouse Zone</th>
              <th className="py-2.5 px-3">Available Stock (Sq.ft)</th>
              <th className="py-2.5 px-3">Available Stock (Units)</th>
              <th className="py-2.5 px-3">Stock Level</th>
              <th className="py-2.5 px-3">Valuation</th>
              <th className="py-2.5 px-3">Last Restocked</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProducts.map((p) => {
              const stockSqft = p.stockSqftAvailable || 0;
              const stockUnits = p.stockUnitsAvailable ?? Math.round(stockSqft / 25);
              const threshold = p.lowStockThresholdSqft || 500;
              const isLow = stockSqft < threshold;
              const percentage = Math.min(100, Math.round((stockSqft / (threshold * 3)) * 100));
              const valuation = stockSqft * (p.pricePerSqftInr || 0);

              return (
                <tr key={p.id} className="hover:bg-gray-50/70 transition">
                  {/* SKU & Name */}
                  <td className="py-2.5 px-3">
                    <span className="font-mono text-[10px] text-[#9E7B47] font-semibold block">
                      {p.sku}
                    </span>
                    <span className="font-sans font-medium text-gray-900 text-xs block">
                      {p.name}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {p.dimensionsMm} • {p.finish}
                    </span>
                  </td>

                  {/* Warehouse Zone */}
                  <td className="py-2.5 px-3 text-gray-700">
                    <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-[10px] font-mono">
                      <Warehouse className="h-3 w-3 text-gray-500" />
                      {p.warehouseZone || "Bhiwandi Bay A1"}
                    </span>
                  </td>

                  {/* Available Stock (Sq.ft) */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-semibold text-sm ${isLow ? "text-amber-700" : "text-gray-900"}`}>
                        {stockSqft.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-gray-500">sq.ft</span>
                    </div>
                    <span className="text-[10px] text-gray-400 block">
                      Min: {threshold.toLocaleString()} sq.ft
                    </span>
                  </td>

                  {/* Available Stock (Units) */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm text-gray-900">
                        {stockUnits.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-gray-500">units</span>
                    </div>
                    <span className="text-[10px] text-gray-400 block">
                      Physical pieces
                    </span>
                  </td>

                  {/* Stock Level Progress */}
                  <td className="py-2.5 px-3 w-36">
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mb-1">
                      <div
                        className={`h-full rounded-full ${
                          isLow ? "bg-amber-500" : "bg-emerald-600"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span
                      className={`text-[9px] uppercase tracking-wider font-semibold ${
                        isLow ? "text-amber-700" : "text-emerald-700"
                      }`}
                    >
                      {isLow ? "Low Stock Warning" : "Healthy Buffer"}
                    </span>
                  </td>

                  {/* Valuation */}
                  <td className="py-2.5 px-3 text-gray-900 font-semibold">
                    ₹{valuation.toLocaleString()}
                  </td>

                  {/* Last Restocked */}
                  <td className="py-2.5 px-3 text-gray-500 text-[11px]">
                    {p.lastRestockedAt || "2026-10-15"}
                  </td>

                  {/* Actions */}
                  <td className="py-2.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setRestockModalProduct(p);
                        setAddQty(500);
                        setAddUnitsQty(20);
                      }}
                      className="inline-flex items-center gap-1 bg-white border border-gray-300 px-2.5 py-1 rounded text-xs font-mono text-gray-700 hover:bg-[#FAF5EE] hover:text-[#9E7B47] hover:border-[#9E7B47] transition cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                      Restock
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Restock Single Product Modal */}
      {restockModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-sm border border-gray-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-slide-up">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#9E7B47] font-semibold">
                  Warehouse Intake Form
                </span>
                <h3 className="font-heading text-base font-semibold text-gray-900">
                  Restock: {restockModalProduct.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRestockModalProduct(null)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleRestockSubmit} className="space-y-4 text-xs font-mono">
              <div className="bg-gray-50 p-3 rounded space-y-1 text-gray-600">
                <div className="flex justify-between">
                  <span>SKU:</span>
                  <span className="font-semibold text-gray-900">{restockModalProduct.sku}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Stock (Sq.Ft):</span>
                  <span className="font-semibold text-gray-900">
                    {(restockModalProduct.stockSqftAvailable || 0).toLocaleString()} sq.ft
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Current Stock (Units):</span>
                  <span className="font-semibold text-gray-900">
                    {(restockModalProduct.stockUnitsAvailable ?? Math.round((restockModalProduct.stockSqftAvailable || 0) / 25)).toLocaleString()} units
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Assigned Bay:</span>
                  <span className="font-semibold text-gray-900">{restockModalProduct.warehouseZone || "Bhiwandi Bay A1"}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 mb-1">Stock Received (Sq.Ft)</label>
                  <input
                    type="number"
                    value={addQty}
                    onChange={(e) => setAddQty(Number(e.target.value))}
                    min={0}
                    className="w-full rounded border border-gray-300 p-2 text-sm font-mono text-gray-900 focus:border-[#9E7B47] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Stock Received (Units)</label>
                  <input
                    type="number"
                    value={addUnitsQty}
                    onChange={(e) => setAddUnitsQty(Number(e.target.value))}
                    min={0}
                    className="w-full rounded border border-gray-300 p-2 text-sm font-mono text-gray-900 focus:border-[#9E7B47] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Intake Reason / Container Reference</label>
                <input
                  type="text"
                  value={restockReason}
                  onChange={(e) => setRestockReason(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 text-xs font-sans text-gray-900 focus:border-[#9E7B47] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setRestockModalProduct(null)}
                  className="px-4 py-2 text-xs font-mono text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#9E7B47] text-white px-5 py-2 font-mono text-xs uppercase tracking-wider rounded-sm hover:bg-[#856535] transition shadow-xs font-semibold"
                >
                  Commit Warehouse Intake
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
