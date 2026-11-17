"use client";

import React from "react";
import { AdminProduct } from "@/types";
import { Layers, Plus, Trash2 } from "lucide-react";

interface Props {
  product: AdminProduct;
  setProduct: React.Dispatch<React.SetStateAction<AdminProduct>>;
  newSpecLabel: string;
  setNewSpecLabel: (v: string) => void;
  newSpecValue: string;
  setNewSpecValue: (v: string) => void;
  onAddCustomSpec: () => void;
  onRemoveCustomSpec: (index: number) => void;
}

export function AttributesSpecsTab({
  product,
  setProduct,
  newSpecLabel,
  setNewSpecLabel,
  newSpecValue,
  setNewSpecValue,
  onAddCustomSpec: addCustomSpec,
  onRemoveCustomSpec: removeCustomSpec,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="border border-[#9E7B47]/30 bg-[#9E7B47]/5 p-3 rounded text-xs font-mono text-[#9E7B47] flex items-center gap-2">
        <Layers className="h-4 w-4" />
        <span>
          Dynamic fields configured specifically for: <strong>{product.masterCategory}</strong>
        </span>
      </div>

      {/* Tiles & Marble Attributes */}
      {(product.masterCategory === "Tiles" || product.masterCategory === "Marbles") && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
              Material Classification
            </label>
            <input
              type="text"
              value={product.category}
              onChange={(e) => setProduct({ ...product, category: e.target.value as any })}
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-[#9E7B47] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
              Surface Finish
            </label>
            <input
              type="text"
              value={product.finish}
              onChange={(e) => setProduct({ ...product, finish: e.target.value as any })}
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-[#9E7B47] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
              Slab / Tile Dimensions (mm)
            </label>
            <input
              type="text"
              value={product.dimensionsMm}
              onChange={(e) => setProduct({ ...product, dimensionsMm: e.target.value })}
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-mono text-gray-900 focus:border-[#9E7B47] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
              Thickness (mm)
            </label>
            <input
              type="number"
              value={product.thicknessMm}
              onChange={(e) => setProduct({ ...product, thicknessMm: parseFloat(e.target.value) || 0 })}
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-mono text-gray-900 focus:border-[#9E7B47] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
              Quarry / Origin Country
            </label>
            <input
              type="text"
              value={product.origin}
              onChange={(e) => setProduct({ ...product, origin: e.target.value })}
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-[#9E7B47] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
              Water Absorption %
            </label>
            <input
              type="text"
              value={product.specs?.waterAbsorption || "< 0.05%"}
              onChange={(e) =>
                setProduct({
                  ...product,
                  specs: { ...product.specs, waterAbsorption: e.target.value },
                })
              }
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-mono text-gray-900 focus:border-[#9E7B47] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
              Slip Resistance Rating
            </label>
            <input
              type="text"
              value={product.specs?.slipResistance || "R10 / Class B"}
              onChange={(e) =>
                setProduct({
                  ...product,
                  specs: { ...product.specs, slipResistance: e.target.value },
                })
              }
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-[#9E7B47] focus:outline-none font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
              Scratch Hardness (Mohs)
            </label>
            <input
              type="text"
              value={product.specs?.mohsHardness || "Mohs 7.5"}
              onChange={(e) =>
                setProduct({
                  ...product,
                  specs: { ...product.specs, mohsHardness: e.target.value },
                })
              }
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-[#9E7B47] focus:outline-none font-mono"
            />
          </div>
        </div>
      )}

      {/* Kitchen Master Category Attributes */}
      {product.masterCategory === "Kitchen" && (
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-2">
            <h4 className="font-heading font-semibold text-gray-900 text-sm">
              Culinary &amp; Workstation Engineering
            </h4>
            <p className="text-[11px] text-gray-500 font-light">
              Technical ratings for culinary slabs, chef sinks, and high-frequency pull-down mixers.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
                Thermal &amp; Heat Resistance
              </label>
              <input
                type="text"
                value={product.specs?.heatResistance || "Direct 1200°C Thermal Shock Proof"}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    specs: { ...product.specs, heatResistance: e.target.value },
                  })
                }
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-[#9E7B47] focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
                Food Contact Safety (NSF-51)
              </label>
              <input
                type="text"
                value={product.specs?.foodGradeSafety || "NSF-51 Certified Direct Food Prep Safe"}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    specs: { ...product.specs, foodGradeSafety: e.target.value },
                  })
                }
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-[#9E7B47] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
                Scratch &amp; Knife Resistance
              </label>
              <input
                type="text"
                value={product.specs?.scratchResistance || "Mohs 8.5 / Direct Blade Cut Resistant"}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    specs: { ...product.specs, scratchResistance: e.target.value },
                  })
                }
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-[#9E7B47] focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
                Acid &amp; Stain Immunity
              </label>
              <input
                type="text"
                value={product.specs?.acidImmunity || "Class 5 (Immune to lemon, vinegar, turmeric, oil)"}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    specs: { ...product.specs, acidImmunity: e.target.value },
                  })
                }
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-[#9E7B47] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
                Sink Bowl Configuration
              </label>
              <input
                type="text"
                value={product.specs?.sinkBowlConfig || "Single XL Basin / Double Bowl Undermount"}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    specs: { ...product.specs, sinkBowlConfig: e.target.value },
                  })
                }
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-[#9E7B47] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
                Spout Reach &amp; Swivel
              </label>
              <input
                type="text"
                value={product.specs?.spoutReach || "360° Magnetic Docking / 235mm Reach"}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    specs: { ...product.specs, spoutReach: e.target.value },
                  })
                }
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-[#9E7B47] focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* Bathroom Master Category Attributes */}
      {product.masterCategory === "Bathroom" && (
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-2">
            <h4 className="font-heading font-semibold text-gray-900 text-sm">
              Bathroom Suite &amp; Moisture Engineering
            </h4>
            <p className="text-[11px] text-gray-500 font-light">
              Water-ingress, sanitary glaze, and vanity construction ratings.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
                Wet / Dry Zone Rating
              </label>
              <input
                type="text"
                value={product.specs?.wetDryZoneRating || "Zone 0 & 1 Wet Ingress Rated"}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    specs: { ...product.specs, wetDryZoneRating: e.target.value },
                  })
                }
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-[#9E7B47] focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
                Anti-Bacterial Glaze Technology
              </label>
              <input
                type="text"
                value={product.specs?.antiBacterialGlaze || "Silver-Ion Nano Glaze (99.9% Microbial Defense)"}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    specs: { ...product.specs, antiBacterialGlaze: e.target.value },
                  })
                }
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-[#9E7B47] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
                Flush Technology &amp; Volume
              </label>
              <input
                type="text"
                value={product.specs?.flushTechnology || "Dual Flush (3 / 4.5L Rimless Cyclone)"}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    specs: { ...product.specs, flushTechnology: e.target.value },
                  })
                }
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-[#9E7B47] focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
                Trap Distance / Rough-in (mm)
              </label>
              <input
                type="text"
                value={product.specs?.trapDistance || "S-Trap 300mm / P-Trap 180mm"}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    specs: { ...product.specs, trapDistance: e.target.value },
                  })
                }
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-[#9E7B47] focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
                Vanity Cabinet Construction
              </label>
              <input
                type="text"
                value={product.specs?.cabinetMaterial || "Marine Grade High-Density HDHMR"}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    specs: { ...product.specs, cabinetMaterial: e.target.value },
                  })
                }
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-[#9E7B47] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
                Mirror Lighting &amp; Demister
              </label>
              <input
                type="text"
                value={product.specs?.mirrorLighting || "CRI>95 Tunable White + Heated Anti-Fog Pad"}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    specs: { ...product.specs, mirrorLighting: e.target.value },
                  })
                }
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-[#9E7B47] focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Wellness & Spa Master Category Attributes */}
      {product.masterCategory === "Wellness & Spa" && (
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-2">
            <h4 className="font-heading font-semibold text-gray-900 text-sm">
              Hydrotherapy &amp; Wellness Engineering
            </h4>
            <p className="text-[11px] text-gray-500 font-light">
              Balneotherapy pump ratings, jet configurations, and ergonomic structural specifications.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
                Hydrotherapy Jet Count
              </label>
              <input
                type="text"
                value={product.specs?.jetCount || "24 Targeted Micro-Jets + 8 Shiatsu Back Nozzles"}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    specs: { ...product.specs, jetCount: e.target.value },
                  })
                }
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-[#9E7B47] focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
                Pump Life Cycle / Power Rating
              </label>
              <input
                type="text"
                value={product.specs?.cycleTestRating || "1.5 HP Silent Induction / 500,000 Cycle Tested"}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    specs: { ...product.specs, cycleTestRating: e.target.value },
                  })
                }
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-[#9E7B47] focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
                Shell &amp; Tub Body Material
              </label>
              <input
                type="text"
                value={product.specs?.bodyMaterial || "Solid Surface Monolithic Mineral Resin"}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    specs: { ...product.specs, bodyMaterial: e.target.value },
                  })
                }
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-[#9E7B47] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
                Structural Shell Warranty
              </label>
              <input
                type="text"
                value={product.specs?.warrantyYears || "15 Years Structural Warranty"}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    specs: { ...product.specs, warrantyYears: e.target.value },
                  })
                }
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-[#9E7B47] focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* Faucets & Showers Attributes */}
      {(product.masterCategory === "Faucets" || product.masterCategory === "Showers") && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
              Mount Type
            </label>
            <input
              type="text"
              value={product.mountType || "Deck Mount / Single Lever"}
              onChange={(e) => setProduct({ ...product, mountType: e.target.value })}
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-[#9E7B47] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
              Flow Rate (LPM)
            </label>
            <input
              type="text"
              value={product.specs?.flowRateLpm || "8.5 LPM"}
              onChange={(e) =>
                setProduct({
                  ...product,
                  specs: { ...product.specs, flowRateLpm: e.target.value },
                })
              }
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-mono text-gray-900 focus:border-[#9E7B47] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
              Operating Pressure (Bar)
            </label>
            <input
              type="text"
              value={product.specs?.operatingPressureBar || "0.5 – 3.0 Bar"}
              onChange={(e) =>
                setProduct({
                  ...product,
                  specs: { ...product.specs, operatingPressureBar: e.target.value },
                })
              }
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-mono text-gray-900 focus:border-[#9E7B47] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
              Valve / Cartridge Core
            </label>
            <input
              type="text"
              value={product.specs?.cartridgeType || "Ceramic Disc Ø35mm (500,000 cycles)"}
              onChange={(e) =>
                setProduct({
                  ...product,
                  specs: { ...product.specs, cartridgeType: e.target.value },
                })
              }
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-[#9E7B47] focus:outline-none font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
              Body Alloy
            </label>
            <input
              type="text"
              value={product.specs?.bodyMaterial || "Solid DZR Lead-Free Brass"}
              onChange={(e) =>
                setProduct({
                  ...product,
                  specs: { ...product.specs, bodyMaterial: e.target.value },
                })
              }
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-[#9E7B47] focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Sanitaryware Attributes */}
      {product.masterCategory === "Sanitaryware" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
              Mount Type
            </label>
            <input
              type="text"
              value={product.mountType || "Wall-Hung / Rimless"}
              onChange={(e) => setProduct({ ...product, mountType: e.target.value })}
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-[#9E7B47] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
              Flush Mechanism
            </label>
            <input
              type="text"
              value={product.flushType || "Dual Flush (3/4.5L Tornado Silent)"}
              onChange={(e) => setProduct({ ...product, flushType: e.target.value })}
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-[#9E7B47] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
              Anti-Bacterial Glaze
            </label>
            <input
              type="text"
              value={product.specs?.antiBacterialGlaze || "CeraClean Ultra-Smooth Nano Glaze"}
              onChange={(e) =>
                setProduct({
                  ...product,
                  specs: { ...product.specs, antiBacterialGlaze: e.target.value },
                })
              }
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-[#9E7B47] focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* DYNAMIC CUSTOM SPECIFICATIONS MANAGER (FOR ANY CATEGORY) */}
      <div className="border border-gray-200 bg-gray-50/70 p-4 rounded-sm space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-2">
          <div>
            <h4 className="font-heading font-semibold text-gray-900 text-sm">
              Dynamic Custom Specifications
            </h4>
            <p className="text-[11px] text-gray-500 font-light">
              Add arbitrary technical attributes for architectural tenders, certifications, or custom project specifications.
            </p>
          </div>
          <span className="font-mono text-[10px] text-[#9E7B47] bg-[#9E7B47]/10 px-2 py-0.5 rounded">
            {(product.specs?.customSpecs || []).length} Custom Specs Active
          </span>
        </div>

        {/* Add new spec row */}
        <div className="flex flex-col sm:flex-row items-end gap-3 bg-white p-3 rounded border border-gray-200">
          <div className="flex-1 w-full">
            <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">
              Specification Label
            </label>
            <input
              type="text"
              placeholder="e.g. Acoustic Dampening, Edge Chamfer, PVD Finish"
              value={newSpecLabel}
              onChange={(e) => setNewSpecLabel(e.target.value)}
              className="w-full rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-900 focus:border-[#9E7B47] focus:outline-none"
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">
              Specification Value
            </label>
            <input
              type="text"
              placeholder="e.g. 1.2mm Sound Deadening Rubber, 2mm Micro-Bevel"
              value={newSpecValue}
              onChange={(e) => setNewSpecValue(e.target.value)}
              className="w-full rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-900 focus:border-[#9E7B47] focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={addCustomSpec}
            className="inline-flex items-center gap-1.5 bg-[#9E7B47] px-3.5 py-1.5 font-mono text-xs text-white hover:bg-[#856535] transition cursor-pointer rounded shrink-0 h-[34px]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Spec</span>
          </button>
        </div>

        {/* List of existing custom specs */}
        {(product.specs?.customSpecs || []).length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {product.specs?.customSpecs?.map((spec, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 bg-white border border-gray-200 rounded text-xs shadow-2xs"
              >
                <div className="min-w-0 pr-2">
                  <p className="font-mono text-[10px] uppercase text-gray-500 truncate">
                    {spec.label}
                  </p>
                  <p className="font-medium text-gray-900 truncate">
                    {spec.value}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeCustomSpec(idx)}
                  className="p-1 text-gray-400 hover:text-red-600 transition cursor-pointer shrink-0"
                  title="Remove specification"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-2 text-xs font-mono text-gray-400 italic">
            No custom specifications added yet. Add one above to appear in the technical matrix.
          </p>
        )}
      </div>
    </div>
  );
}
